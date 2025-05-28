import React from "react";

const GrowBusinessSection = () => {
  return (
    <section className="flex flex-col items-center text-center py-12 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg">
      <h2 className="text-3xl font-bold mb-4">Grow your Business Globally</h2>
      <p className="text-lg mb-8 max-w-2xl">
        We are a team of seasoned traders, developers, and financial experts driven by a shared vision of fostering success in the forex arena. Our expertise spans algorithmic trading.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none"
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Sign up to Newsletter
        </button>
      </div>
    </section>
  );
};

export default GrowBusinessSection;
