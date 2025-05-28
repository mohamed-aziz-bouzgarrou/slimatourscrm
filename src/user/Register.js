import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    country: "",
    city: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const navigate = useNavigate(); // Using useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      setSuccessMessage("Registration successful!");
      setError(null);

      // Show toast notification for success
      toast.success("Registration successful!");

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/confirm-account");  // Adjust the path as needed
      }, 3000);

    } catch (err) {
      setError(err.message);
      setSuccessMessage(null);
      toast.error(err.message);  // Show toast notification for error
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full font-montserrat bg-gray-50">
      {/* Left Pane */}
      <div className="md:w-1/2 flex flex-col items-center justify-center bg-white p-8 shadow-lg relative">
        <div className="w-24 h-24 mb-4">
          <img
            src="https://example.com/profile.jpg"
            alt="Profile Picture"
            className="rounded-full w-full h-full object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-gray-800">
          Create your <span className="text-second">Account</span>
        </h1>
        <p className="text-xs text-gray-500 mb-6">
          Fill in the details to create your account.
        </p>

        {/* Form */}
        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
          {/* Input Fields */}
          {[
            { label: "Username", name: "username", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" },
            { label: "Phone Number", name: "phoneNumber", type: "text" },
            { label: "Country", name: "country", type: "text" },
            { label: "City", name: "city", type: "text" },
            { label: "Password", name: "password", type: "password" },
          ].map((field) => (
            <div key={field.name} className="mb-4">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor={field.name}
              >
                {field.label}
              </label>
              <input
                className="shadow-sm border rounded w-full py-2 px-3 border-gray-300"
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.label}
              />
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-second hover:bg-second text-white text-sm py-2 px-6 rounded-lg"
          >
            Register
          </button>
        </form>

        {/* Success or Error Messages */}
        {successMessage && (
          <p className="text-green-500 text-sm mt-4">{successMessage}</p>
        )}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>

      {/* Right Pane */}
      <div
        className="md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('path-to-bg.png')" }}
      >
        <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
          <div className="text-center text-white p-8">
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-lg mb-4">Already have an account?</p>
            <a href="/login">
              <button className="bg-second hover:bg-second text-white text-sm py-2 px-6 rounded-lg">
                Login
              </button>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RegisterForm;
