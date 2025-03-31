import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { selectUser, updateUserDetails } from "../redux/userReducer";
import { notificationActions } from "../redux/notificationReducer";
import apiClient from "../api/api";

function UpdatePasswordSection({ user }) {
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    if (!validatePassword(newPassword)) {
      setPasswordError("Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }

    try {
      dispatch(notificationActions.setNotification({ message: "Updating password...", status: "loading" }));
      await apiClient.post('/user/reset-password', {
        email: user.email,
        password: newPassword
      });
      dispatch(notificationActions.setNotification({ message: "Password updated successfully", status: "success" }));
    } catch (e) {
      dispatch(notificationActions.setNotification({ message: "Failed to update password", status: "error" }));
    }

    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  return (
    <div className="card border-0 mt-3" style={{ maxWidth: "600px", width: "100%" }}>
      <h3 className="text-center mb-3 special-font">Reset Your Password</h3>
      <form className="d-flex flex-column align-items-center" onSubmit={handlePasswordSubmit}>
        <div className="mb-3" style={{ width: "80%" }}>
          <label className="text-dark fs-5 d-flex align-items-center">
            <FaLock className="me-2" /> New Password
          </label>
          <div className="input-group">
            <input type={showPassword ? "text" : "password"} className="form-control custom-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="mb-3 " style={{ width: "80%" }}>
          <label className="text-dark fs-5 d-flex align-items-center">
            <FaLock className="me-2" /> Confirm Password
          </label>
          <div className="input-group">
            <input type={showConfirmPassword ? "text" : "password"} className="form-control custom-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <span className="input-group-text" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: 'pointer' }}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {passwordError && <p className="text-danger fs-6">{passwordError}</p>}
        </div>
        <button type="submit" className="btn btn-success w-40 m-auto text-white fs-6 rounded-3 mt-3">Update Password</button>
      </form>
    </div>
  );
}

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);

  const resetForm = () => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUserData = { firstName, lastName, email: user.email };

    try {
      await dispatch(updateUserDetails(updatedUserData)).unwrap();
      dispatch(notificationActions.setNotification({ message: "Profile updated successfully", status: "success" }));
      setIsEditing(false); // Only set isEditing to false after successful update
    } catch (err) {
      dispatch(notificationActions.setNotification({ message: "Error while updating profile", status: "error" }));
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setIsEditing(true);
  }

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  const toggleIsUpdatePassword = () => {
    setIsUpdatePassword(!isUpdatePassword);
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center pt-4">
      <div className="card border-0" style={{ maxWidth: "600px", width: "100%" }}>
        {isEditing ? <h3 className="text-center mb-3 special-font">Updating My Details</h3> : <h3 className="text-center mb-3 special-font">My Profile</h3>}
        <form className="d-flex flex-column" onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="first-name" className="text-dark fs-5 d-flex align-items-center">
                <FaUser className="me-2" /> First Name
              </label>
              <input id="first-name" type="text" className="form-control" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={!isEditing} required />
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="last-name" className="text-dark fs-5 d-flex align-items-center">
                <FaUser className="me-2" /> Last Name
              </label>
              <input id="last-name" type="text" className="form-control" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={!isEditing} required />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="email" className="text-dark fs-5 d-flex align-items-center">
                <FaEnvelope className="me-2" /> Email Address
              </label>
              <input id="email" type="email" className="form-control" placeholder="Enter email" value={user.email} disabled required />
            </div>
          </div>
          <div className="d-flex justify-content-between">
            {isEditing ? (
              <>
                <button type="submit" className="btn btn-success">Update</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-primary" onClick={handleEdit}>Edit</button>
                <button type="button" className="btn btn-light btn-outline-primary" onClick={toggleIsUpdatePassword}>Update Password</button>
              </>
            )}
          </div>
        </form>
      </div>
      <br />
      {isUpdatePassword && <UpdatePasswordSection user={user} />}
    </div>
  );
}