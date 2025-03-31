import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/userReducer"; // ✅ Redux action for registration
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaKey } from "react-icons/fa";
import { notificationActions } from "../redux/notificationReducer"; // ✅ Import notification actions
import apiClient from "../api/api";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ Redux dispatch function

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const toLogin = useCallback(() => navigate("/signin"), [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: undefined }));

      // Reset OTP state if email is edited
      if (otpSent || otpVerified) {
        setOtpSent(false);
        setOtpVerified(false);
        setOtp("");
      }
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const validateForm = useCallback(() => {
    const { firstName, lastName, email, password } = formData;
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = "Password must contain at least one special character (!@#$%^&*).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSendOtp = async () => {
    if (!validateForm()) return;
    setLoading(true);
    dispatch(notificationActions.setNotification({ message: "Sending OTP...", status: "loading" }));

    try {
      const response = await apiClient.get(`/api/otp/send?email=${encodeURIComponent(formData.email)}`);
      if (response.status === 200) {
        setOtpSent(true);
        setErrors({});
        dispatch(notificationActions.setNotification({ message: "OTP sent successfully!", status: "success" }));
      }
    } catch (error) {
      setErrors({ email: error.response?.data?.message || "Failed to send OTP. Try again." });
      dispatch(notificationActions.setNotification({ message: "Failed to send OTP.", status: "error" }));
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setErrors({ otp: "OTP is required." });
      return;
    }

    setLoading(true);
    dispatch(notificationActions.setNotification({ message: "Verifying OTP...", status: "loading" }));

    try {
      const response = await apiClient.get(`/api/otp/verify?email=${encodeURIComponent(formData.email)}&otp=${otp}`);
      if (response.status === 200) {
        setOtpVerified(true);
        setErrors({});
        dispatch(notificationActions.setNotification({ message: "OTP verified successfully!", status: "success" }));
      }
    } catch (error) {
      setErrors({ otp: error.response?.data?.message || "Invalid OTP." });
      dispatch(notificationActions.setNotification({ message: "OTP verification failed.", status: "error" }));
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!otpVerified) {
      setErrors({ general: "OTP verification is required!" });
      return;
    }

    setLoading(true);
    dispatch(notificationActions.setNotification({ message: "Registering user...", status: "loading" }));

    try {
      await dispatch(registerUser(formData)).unwrap(); // ✅ Dispatch Redux action to register user
      dispatch(notificationActions.setNotification({ message: "Registration successful!", status: "success" }));
      navigate("/signin");
    } catch (error) {
      setErrors({ general: error.response?.data || "Registration failed. Please try again." });
      dispatch(notificationActions.setNotification({ message: error.response?.data || "Registration failed.", status: "error" }));
    }
    setLoading(false);
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <div className="card p-4 border-0" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-3 special-font">Create your account</h3>

        <div className="mb-4 d-flex justify-content-center align-items-center">
          <span className="text-dark fs-6">Already have an account?</span>
          <span className="text-primary fs-6 cursor-pointer ms-2" onClick={toLogin}>
            Sign In
          </span>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column">
          {/* First Name & Last Name */}
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="first-name" className="text-dark fs-5 d-flex align-items-center">
                <FaUser className="me-2" /> First Name
              </label>
              <input
                id="first-name"
                type="text"
                name="firstName"
                className="form-control"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && <p className="text-danger fs-6">{errors.firstName}</p>}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="last-name" className="text-dark fs-5 d-flex align-items-center">
                <FaUser className="me-2" /> Last Name
              </label>
              <input
                id="last-name"
                type="text"
                name="lastName"
                className="form-control"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && <p className="text-danger fs-6">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email & Password */}
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="email" className="text-dark fs-5 d-flex align-items-center">
                <FaEnvelope className="me-2" /> Email Address
              </label>
              <div className="input-group">
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className={`btn ${otpSent ? "btn-success" : "btn-primary"}`}
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {otpSent ? <FaCheckCircle /> : "Send OTP"}
                </button>
              </div>
              {errors.email && <p className="text-danger fs-6">{errors.email}</p>}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="password" className="text-dark fs-5 d-flex align-items-center">
                <FaLock className="me-2" /> Password
              </label>
              <div className="input-group">
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className="text-danger fs-6">{errors.password}</p>}
            </div>
          </div>

          {/* OTP Section */}
          {otpSent && !otpVerified && (
            <div className="mb-3">
              <label className="text-dark fs-5 d-flex align-items-center">
                <FaKey className="me-2" /> Enter OTP
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                >
                  Verify OTP
                </button>
              </div>
              {errors.otp && <p className="text-danger fs-6">{errors.otp}</p>}
            </div>
          )}

          <button type="submit" className="btn btn-success w-40 m-auto fs-6 rounded-3 mt-3" disabled={!otpVerified || loading}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}