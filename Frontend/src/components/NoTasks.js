import React from "react";
import { MdAddTask } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function NoTasks() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="container-fluid d-flex align-items-center justify-content-center main no-task"
        style={{
          height: "calc(100vh - 70px)",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <MdAddTask
            style={{ fontSize: "5rem", color: "#007B5E", marginBottom: "20px" }}
          />
          <h1 style={{ fontWeight: "bold", fontSize: "2.5rem", color: "#007B5E" }}>
            No Tasks Yet
          </h1>
          <p style={{ fontSize: "1.3rem", color: "#555", margin: "20px 0" }}>
            Start managing your tasks today! Add your first task and take the first step toward achieving your goals.
          </p>
          <button
            style={{
              backgroundColor: "#007B5E",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => { navigate('/task') }}
          >
            <MdAddTask className="me-2" /> Add Task
          </button>
        </div>
      </div>
    </>
  );
}
