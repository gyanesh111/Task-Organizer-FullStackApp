import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../static/Animations/Animation - 1741935745058.json"; // Import the JSON file
import { FaGithub, FaLinkedin, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { MdWorkOutline } from "react-icons/md"; // Portfolio Icon

export default function Homepage() {
  const navigate = useNavigate();

  // Social Links Array (for scalability)
  const socialLinks = [
    { icon: <FaGithub />, url: "https://github.com/vishwanathkhuli", bg: "#333" }, // GitHub Dark
    { icon: <FaLinkedin />, url: "https://www.linkedin.com/in/vishwanath-khuli-068ab526b/", bg: "#0077B5" }, // LinkedIn Blue
    { icon: <FaEnvelope />, url: "mailto:vishwanathkhuli347@gmail.com", bg: "#D44638" }, // Email Red
    { icon: <MdWorkOutline />, url: "https://my-port-polio-vishwanath-khuli.vercel.app/", bg: "blue" }, // Portfolio Orange
    { icon: <FaPhoneAlt />, url: "tel:+919019393599", bg: "rgb(0, 123, 94)" }, // Contact Green
  ];

  return (
    <div className="container-fluid d-flex align-items-center justify-content-between main" style={{ height: "calc(100vh - 80px)" }}>
      {/* Left Side */}
      <div className="left-side" style={{ maxWidth: "50%" }}>
        <h1 className="heading-fonts fw-bold" style={{ fontSize: "3rem", color: "#007B5E" }}>
          Organize your work and life, finally.
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#555" }}>
          Simplify life for both you and your team with the world’s #1 task manager and to-do list app.
        </p>

        {/* Button and Social Links */}
        <div className="d-flex align-items-center gap-3 mt-3 social-logo-container">
          {/* Get Started Button */}
          <button
            className="btn text-white"
            style={{
              backgroundColor: "#007B5E",
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/dashboard")}
          >
            Get Started
          </button>

          {/* Social Links */}
          <div className="d-flex gap-2">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center justify-content-center shadow"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: link.bg,
                  textDecoration: "none",
                  lineHeight: "0",
                  aspectRatio: "1/1",
                }}
              >
                {React.cloneElement(link.icon, { style: { fontSize: "22px", color: "#fff" } })}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side with Lottie Animation */}
      <div className="right-side d-flex align-items-center justify-content-center" style={{ maxWidth: "50%", textAlign: "center" }}>
        <Lottie animationData={animationData} style={{ width: "100%", maxWidth: "400px" }} />
      </div>
    </div>
  );
}
