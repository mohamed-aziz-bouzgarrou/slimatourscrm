import React from 'react';
// import { Globe, Clock, Shield, Trophy } from 'lucide-react';

const TradingLandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-8">
          <span className="text-blue-600 font-bold text-xl">NemmalaFX</span>
          <div className="hidden md:flex gap-6">
            <a href="#" className="text-gray-600">Home</a>
            <a href="#" className="text-gray-600">Products</a>
            <a href="#" className="text-gray-600">Packages</a>
            <a href="#" className="text-gray-600">Services</a>
            <a href="#" className="text-gray-600">About Us</a>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-blue-600">Login</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Sign up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Nemmala FX Programming Universe</h1>
          <p className="text-gray-600 mb-8">
            Forex/Stock market solutions with a wide range of AI-Generated Support to help you take your strategy into personalized EA execution, perfectly.
          </p>
          <div className="flex items-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">★</span>
              <span>18,524 Per Downloaded</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📍</span>
              <span>100% Tested and Released</span>
            </div>
          </div>
        </div>
        <div>
          <img src="/api/placeholder/600/400" alt="Team Meeting" className="rounded-lg shadow-lg"/>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
        {[
          {
            title: "Custom Expert Advisors (EAs)",
            description: "We have a dedicated team who are expert in coding your strategy into an automated EA with proper risk management.",
            icon: "💻"
          },
          {
            title: "Custom Indicators",
            description: "Get your custom indicators coded by professionals to enhance your trading experience.",
            icon: "📊"
          },
          {
            title: "Custom Tools & Dashboard",
            description: "Specialized tools and dashboards to help you analyze the market in real-time.",
            icon: "🛠️"
          },
          {
            title: "Custom Expert Advisors (EAs)",
            description: "Professional EA development services tailored to your needs.",
            icon: "⚙️"
          }
        ].map((service, index) => (
          <div key={index} className="p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
            <button className="mt-4 text-blue-600">Know more about it →</button>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Your FIRST destination for custom trading solutions
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              {/* <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4" /> */}
              <h3 className="text-xl font-semibold mb-2">Effortless Expertise</h3>
              <p className="text-gray-600">
                Ready-made trading solutions to help you overcome the hassles of operating for the right strategy and proper execution.
              </p>
            </div>
            <div className="text-center">
              {/* <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" /> */}
              <h3 className="text-xl font-semibold mb-2">Risk-Free Excellence</h3>
              <p className="text-gray-600">
                Through our AI Validation process, we ensure the highest level of custom solution accuracy.
              </p>
            </div>
            <div className="text-center">
              {/* <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" /> */}
              <h3 className="text-xl font-semibold mb-2">Time-Effective Solutions</h3>
              <p className="text-gray-600">
                Save lots of time and stay ahead of the competition with our effective solutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Grow your Business Globally</h2>
          <p className="mb-8 text-gray-300">
            We are a team of dedicated experts, specializing in delivering comprehensive automated forex
            and stock trading solutions to clients across the globe
          </p>
          <div className="flex justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-md text-gray-800 w-64"
            />
            <button className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              Start a Discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingLandingPage;