import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSpinner, FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import { showToast } from "../utlis/toastNotifications";
import bg from '../assets/bg.jpg';
import logo from '../assets/logo.png';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    // Form validation
    const validateForm = () => {
        const newErrors = { email: "", password: "" };
        let isValid = true;

        if (!email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email";
            isValid = false;
        }

        if (!password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            console.log(process.env.REACT_APP_API_BASE_URL);

            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
                {
                    email: email.toLowerCase().trim(),
                    password,
                }
            );

            const token = response.data.data.refreshToken;
            const user = response.data.data.user;
            
            console.log(response.data.data);
            
            // Store user data
            localStorage.setItem("token", token);
            localStorage.setItem("user", user.id);
            localStorage.setItem("Role", user.role);
            localStorage.setItem("userInfo", JSON.stringify(user));

            showToast("Login successful! Welcome back.", "success");
            
            // Navigate based on role
            if (user.role === "admin") {
                navigate("/admin/SuperDash");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Login error:", error);
            
            if (error.response?.status === 401) {
                showToast("Invalid email or password. Please try again.", "error");
            } else if (error.response?.status === 429) {
                showToast("Too many login attempts. Please try again later.", "error");
            } else if (error.response?.data?.message) {
                showToast(error.response.data.message, "error");
            } else {
                showToast("Login failed. Please check your connection and try again.", "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        if (field === "email") {
            setEmail(value);
            if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
        } else {
            setPassword(value);
            if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row font-montserrat bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Left Panel - Login Form */}
            <div className="lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-md space-y-6">
                    {/* Logo and Header */}
                    <div className="text-center space-y-4">
                        <img 
                            src={logo || "/placeholder.svg"} 
                            className="w-32 sm:w-40 lg:w-48 mx-auto transition-transform hover:scale-105" 
                            alt="SlimaTours Logo" 
                        />
                        <div className="space-y-2">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                                <span className="text-[#0463ca]">Welcome to </span>
                                <span className="text-[#09B1EC]">SlimaTours</span>
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600">
                                Welcome back! Please enter your details to continue.
                            </p>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label 
                                className="block text-gray-700 text-sm font-semibold" 
                                htmlFor="email"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#09B1EC] focus:border-transparent transition-all ${
                                        errors.email 
                                            ? 'border-red-500 bg-red-50' 
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label 
                                className="block text-gray-700 text-sm font-semibold" 
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#09B1EC] focus:border-transparent transition-all ${
                                        errors.password 
                                            ? 'border-red-500 bg-red-50' 
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 hover:text-gray-700 transition-colors"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link 
                                to="/forgot-password" 
                                className="text-sm text-[#09B1EC] hover:text-[#0463ca] transition-colors"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="w-full bg-gradient-to-r from-[#0463ca] to-[#09B1EC] hover:from-[#0451a5] hover:to-[#0891d1] text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09B1EC] focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <FaSpinner className="animate-spin h-4 w-4" />
                                    <span>Signing In...</span>
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                {"Don't have an account? "}
                                <Link 
                                    to="/register" 
                                    className="text-[#09B1EC] hover:text-[#0463ca] font-semibold transition-colors"
                                >
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Panel - Background Image */}
            <div className="lg:w-1/2 min-h-[300px] lg:min-h-screen relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${bg})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0463ca]/60 to-[#09B1EC]/40"></div>
                    
                    {/* Overlay Content */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="text-center text-white space-y-6 max-w-md">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                                Your Journey Starts Here
                            </h2>
                            <p className="text-lg sm:text-xl opacity-90">
                                Discover amazing destinations and create unforgettable memories with SlimaTours
                            </p>
                            <div className="flex justify-center space-x-2">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;