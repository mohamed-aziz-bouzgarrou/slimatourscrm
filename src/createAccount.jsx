import React from 'react';

const createAccount = () => {
  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen">
      <header className="flex items-center justify-between w-full p-5 bg-white shadow">
        <div className="flex items-center">
          <img
            src="C:/Users/HP/Desktop/projet dev/Capture d'écran 2024-10-17 222507.png"
            alt="Logo"
            className="h-12 mr-3"
          />
          <h1 className="text-xl font-bold">NemalaFX</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="text-gray-700 hover:text-blue-500">Home</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-500">Products</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-500">Strategies</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-500">Services</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-500">School</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-500">About Us</a></li>
          </ul>
        </nav>
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => window.location.href = '/login'}
          >
            Log In
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => window.location.href = '/signup'}
          >
            Sign Up
          </button>
        </div>
      </header>

      <main className="w-full max-w-4xl p-6 bg-white rounded-lg shadow mt-10 flex">
        {/* Form Section */}
        <div className="w-1/2 pr-6">
          <h2 className="text-2xl font-bold">Create account</h2>
          <form action="/login" method="POST" className="mt-4">
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="full-name"
              name="full_name"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />

            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-4">E-mail</label>
            <input
              type="text"
              id="email"
              name="email"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />

            <input
              type="submit"
              value="Continue"
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            />

            <p className="mt-4 text-center">
              Already have an account? <a href="/login" className="text-blue-500 hover:underline">Sign In</a>
            </p>
          </form>

          {/* Continue with social login */}
          <p className="text-center mt-6">Or continue with</p>
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
              onClick={() => (window.location.href = '/auth/facebook')}
            >
              Facebook
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
              onClick={() => (window.location.href = '/auth/google')}
            >
              Google
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-1/2">
          <img
            src="C:\Users\HP\Desktop\projet dev\images\img1.png"
            alt="Image Description"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </main>
    </div>
  );
};

export default createAccount;
