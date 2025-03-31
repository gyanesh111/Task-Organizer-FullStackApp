import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNotification, notificationActions } from "../redux/notificationReducer";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NotificationModel() {
  const { message, status } = useSelector(useNotification);
  const dispatch = useDispatch();
  const [visibleMessage, setVisibleMessage] = useState("");

  useEffect(() => {
    if (message) {
      setVisibleMessage(message);

      // Only start the timeout if status is "success" or "error"
      if (status === "success" || status === "error") {
        const timer = setTimeout(() => {
          setVisibleMessage(""); // Clear UI
          dispatch(notificationActions.clearNotification()); // Clear Redux
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [message, status, dispatch]);

  // Keep showing if status is "loading"
  if (!visibleMessage && status !== "loading") return null;

  return (
    <div
      className="position-fixed start-50 translate-middle-x"
      style={{
        top: "10px",
        zIndex: 1050,
        width: "500px",
        maxWidth: "90%",
        transition: "opacity 0.5s ease-in-out",
        opacity: visibleMessage || status === "loading" ? 1 : 0,
      }}
    >
      <div
        className={`p-3 mb-2 border rounded shadow-lg text-black ${status === "loading"
          ? "bg-light"
          : status === "error"
            ? "bg-danger text-white"
            : "bg-success text-white"
          } w-100 d-flex justify-content-between align-items-center`}
      >
        <p className="mb-0 fs-6 d-flex align-items-center">
          {status === "loading" && (
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
          )}
          {visibleMessage || (status === "loading" && "Processing...")}
        </p>

        {status !== "loading" && (
          <button
            className="btn-close btn-close-white fs-5"
            onClick={() => {
              dispatch(notificationActions.clearNotification());
              setVisibleMessage("");
            }}
          ></button>
        )}
      </div>
    </div>
  );
}
