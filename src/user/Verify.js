import React from 'react'
import { Link } from "react-router-dom";

export default function Verify() {
  return (

<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Please Verify Your Email
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          A verification email has been sent to your email address. Please
          check your inbox and follow the instructions to verify your email.
        </p>
        <p className="text-sm text-gray-500">
          If you verified your email click here to login page 
          <Link to="/login" className="text-blue-500 hover:underline">
            Login Page
          </Link>
        </p>
      </div>

      {/* Toast Container for any messages */}
    </div>  )
}
