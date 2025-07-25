import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ formData, handleInputChange, handleSubmit }) => (
  <>
    <h3>Login</h3>
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </label>
      <label> {/* Removed <br />, using CSS for spacing */}
        Password:
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </label>
      <button type="submit">Login</button>
    </form>
  </>
);

const RegisterForm = ({ formData, handleInputChange, handleSubmit }) => (
  <>
    <h3>Register</h3>
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </label>
      <label> {/* Removed <br />, using CSS for spacing */}
        Email:
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </label>
      <label> {/* Removed <br />, using CSS for spacing */}
        Password:
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </label>
      <button type="submit">Register</button>
    </form>
  </>
);

export default function Login({ onLogin }) { // onLogin prop from App.jsx
  const [loginMode, setLoginMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChangeView = () => {
    setLoginMode(loginMode === "login" ? "register" : "login");
    setFormData({ name: "", email: "", password: "" });
    setMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      loginMode === "login"
        ? "http://localhost:5000/auth/login"
        : "http://localhost:5000/auth/signup";

    const payload =
      loginMode === "login"
        ? {
            email: formData.email,
            password: formData.password
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password
          };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(result.message || "Success!");
        console.log("User ID:", result.userId);
        // Call onLogin from App.jsx with userId, userName, and email
        if (onLogin) {
          onLogin(result.userId, result.name, result.email); // Pass email here
          navigate('/'); // Navigate to the home page after successful login/signup
        }
      } else {
        setMessage(result.error || "Something went wrong");
      }
    } catch (error) {
      setMessage("Server error");
      console.error("Error:", error);
    }
  };

  return (
    // Changed inline style to a className to centralize styling in CSS
    <div className="auth-container">
      <h2>Welcome to Feedback Tracker</h2> {/* More descriptive heading */}

      {loginMode === "login" ? (
        <LoginForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <RegisterForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      )}

      {/* Dynamically apply 'error' class based on message content */}
      {message && <p className={`status-message ${message.includes('Failed') || message.includes('Something went wrong') || message.includes('Server error') ? 'error' : ''}`}>{message}</p>}

      {/* Button for switching between Login/Register */}
      <button onClick={handleChangeView}>
        {loginMode === "login"
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </button>
    </div>
  );
}