import React, { useState } from "react"; 

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
 <br />
 <label>
 Password:
 <input
 name="password"
 type="password"
 value={formData.password}
 onChange={handleInputChange}
 required
 />
 </label>
 <br />
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
 <br />
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
 <br />
 <label>
 Password:
 <input
 name="password"
 type="password"
 value={formData.password}
 onChange={handleInputChange}
 required
 />
 </label>
 <br />
 <button type="submit">Register</button>
 </form>
 </>
);


export default function Login() {
 const [loginMode, setLoginMode] = useState("login");
 const [formData, setFormData] = useState({
 name: "",
 email: "",
 password: ""
 });
 const [message, setMessage] = useState("");


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
 } else {
 setMessage(result.error || "Something went wrong");
 }
 } catch (error) {
 setMessage("Server error");
 console.error("Error:", error);
 }
 };


 return (
 <div style={{ padding: "20px", maxWidth: "400px" }}>
 <h1>Welcome to our app</h1>


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


 <p style={{ color: "green" }}>{message}</p>


 <button onClick={handleChangeView}>
 {loginMode === "login"
 ? "Don't have an account? Register"
 : "Already have an account? Login"}
 </button>
 </div>
 );
}