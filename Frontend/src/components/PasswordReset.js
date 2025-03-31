import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft, FaKey } from "react-icons/fa";
import apiClient from "../api/api";
import { notificationActions } from "../redux/notificationReducer";
import { useDispatch } from "react-redux";

export default function PasswordReset() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setConfirmPasswordVisible((prev) => !prev);
  }, []);

  const toLogin = useCallback(() => {
    navigate("/signin");
  }, [navigate]);

  const validateEmail = useCallback(() => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email]);

  // ✅ Send OTP (GET request with email as query param)
  const handleSendOtp = async () => {
    if (!validateEmail()) return;
    setLoading(true);
    dispatch(notificationActions.setNotification({ message: "Sending OTP...", status: "loading" }));

    try {
      const response = await apiClient.get(`/api/otp/send?email=${encodeURIComponent(email)}`);
      console.log(response.data);
      if (response.status === 200) {
        setOtpSent(true);
        dispatch(notificationActions.setNotification({ message: "OTP sent successfully", status: "success" }));
      }
    } catch (error) {
      setErrors({ email: error.response?.data?.message || "Failed to send OTP. Try again." });
      dispatch(notificationActions.setNotification({ message: "OTP sending failed", status: "error" }));
    }
    setLoading(false);
  };

  // ✅ Verify OTP (GET request with email & OTP as query params)
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setErrors({ otp: "OTP is required." });
      return;
    }

    setLoading(true);
    dispatch(notificationActions.setNotification({ message: "Verifying OTP...", status: "loading" }));

    try {
      const response = await apiClient.get(`/api/otp/verify?email=${encodeURIComponent(email)}&otp=${otp}`);
      console.log(response.data);
      if (response.status === 200) {
        setOtpVerified(true);
        dispatch(notificationActions.setNotification({ message: "OTP verified successfully", status: "success" }));
      }
    } catch (error) {
      setErrors({ otp: error.response?.data?.message || "Invalid OTP." });
      dispatch(notificationActions.setNotification({ message: "OTP verification failed", status: "error" }));
    }
    setLoading(false);
  };

  const validatePasswords = useCallback(() => {
    const newErrors = {};
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = "Password must contain at least one special character (!@#$%^&*).";
    }

    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    setLoading(true);
    dispatch(notificationActions.setNotification({ message: "Resetting password...", status: "loading" }));

    try {
      await apiClient.post("/user/reset-password", { email, password });
      dispatch(notificationActions.setNotification({ message: "Password reset successful", status: "success" }));
      navigate("/signin");
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Failed to reset password. Try again." });
      dispatch(notificationActions.setNotification({ message: "Password reset failed", status: "error" }));
    }
    setLoading(false);
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center fonts">
      <div className="card p-4 border-0" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-3 special-font">Reset Your Password</h3>
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          <div className="mb-3">
            <label className="text-dark fs-5 d-flex align-items-center">
              <FaEnvelope className="me-2" /> Email Address
            </label>
            <div className="input-group">
              <input type="email" className="form-control custom-input" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={otpSent} />
              <button type="button" className={`btn ${otpSent ? "btn-success" : "btn-primary"}`} onClick={handleSendOtp} disabled={otpSent || loading}>
                {otpSent ? <FaCheckCircle /> : "Send OTP"}
              </button>
            </div>
            {errors.email && <p className="text-danger fs-6">{errors.email}</p>}
          </div>

          {otpSent && !otpVerified && (
            <div className="mb-3">
              <label className="text-dark fs-5 d-flex align-items-center">
                <FaKey className="me-2" /> Enter OTP
              </label>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                <button type="button" className="btn btn-primary" onClick={handleVerifyOtp} disabled={loading}>Verify OTP</button>
              </div>
              {errors.otp && <p className="text-danger fs-6">{errors.otp}</p>}
            </div>
          )}

          {otpVerified && (
            <>
              <div className="mb-3 fs-5">
                <label className="d-flex align-items-center">
                  <FaLock className="me-2" /> New Password
                </label>
                <div className="input-group">
                  <input type={passwordVisible ? "text" : "password"} className="form-control" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password" />
                  <span className="input-group-text" onClick={togglePasswordVisibility}>
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {errors.password && <p className="text-danger fs-6">{errors.password}</p>}
                </div>
              </div>

              <div className="fs-5">
                <label className="d-flex align-items-center">
                  <FaLock className="me-2" /> Confirm Password
                </label>
                <div className="input-group">
                  <input type={confirmPasswordVisible ? "text" : "password"} className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password" />
                  <span className="input-group-text" onClick={toggleConfirmPasswordVisibility}>
                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.confirmPassword && <p className="text-danger fs-6">{errors.confirmPassword}</p>}
              </div>
              <button type="submit" className="btn btn-success w-40 m-auto fs-6 rounded-3 mt-3" disabled={loading}>Reset Password</button>
            </>
          )}
        </form>
      </div>
      <div className="back-login mt-3 d-flex align-items-center text-start fs-6">
        <FaArrowLeft className="me-2 cursor-pointer" onClick={toLogin} />
        <span className="text-primary cursor-pointer" onClick={toLogin}>Back to Login</span>
      </div>

    </div>
  );
}
