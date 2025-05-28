import React from 'react';
import Footer from '../Home/Footer';
import Navbar from './Navbar';
import Hero from '../assets/hv.png'
export default function Home() {
  return (
    <div>
      {/* Header */}
  <Navbar/>
{/* Hero Section */}
<section className="bg-gradient-to-r from-blue-50 to-blue-100 py-20 text-center">
  <div className="container mx-auto">
    <h1 className="text-5xl font-bold text-gray-800 leading-tight">
      Elevate Your Trading Business
    </h1>
    <p className="text-lg text-gray-600 mt-4">
      Handcrafted EA & Risk Solutions Frameworks That Fit Your Needs.
    </p>
    <ul className="mt-6 space-y-2 text-gray-600">
      <li>✔ Automate your entire trading process</li>
      <li>✔ Risk & Reward optimization tools</li>
      <li>✔ 24/7 customer support</li>
    </ul>
    <div className='flex justify-center align-center'>
      <img src={Hero} he/>
    </div>
    <div className=" space-x-4">
      <button className="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700">
        Get Started Now
      </button>
      <button className="px-8 py-3 border border-blue-600 text-blue-600 text-lg font-medium rounded-lg hover:bg-blue-600 hover:text-white">
        Learn More
      </button>
    </div>
  </div>
</section>


      {/* Features Section */}
      <section className="container mx-auto py-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Support</h3>
          <p className="text-gray-600 mt-4">
            24/7 customer support for all your trading needs.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Security</h3>
          <p className="text-gray-600 mt-4">
            Ensure your data is safe with cutting-edge security.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Quality</h3>
          <p className="text-gray-600 mt-4">
            High-quality frameworks to meet your goals.
          </p>
        </div>
      </section>

      {/* Top Sellers Section */}
      <section className="container mx-auto py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Top Sellers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/400x200"
              alt="Product"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-800">Nemmalafx EA</h3>
              <p className="text-gray-600 mt-2">Description of the product...</p>
              <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Buy Now
              </button>
            </div>
          </div>
          {/* Add more product cards here if needed */}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800">Who We Are</h2>
          <p className="text-gray-600 mt-4">
            Nemmalafx offers cutting-edge trading solutions tailored to your business needs.
          </p>
        </div>
      </section>
{/* Why Choose Nemmalafx Section */}
<section className="bg-gray-100 py-16">
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
    {/* Left Column - Text */}
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Nemmalafx</h2>
      <ul className="list-disc list-inside text-gray-600 space-y-4">
        <li>User-friendly tools that empower you to expand and scale your trading business.</li>
        <li>Transparent pricing with no hidden fees.</li>
        <li>Tailored EA frameworks designed to maximize your profits.</li>
        <li>Dedicated customer support to ensure your success every step of the way.</li>
      </ul>
      <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
        Explore Our Services
      </button>
    </div>

    {/* Right Column - Image */}
    <div>
      <img
        src="https://via.placeholder.com/500x400"
        alt="Why Choose Us"
        className="rounded-lg shadow-lg w-full object-cover"
      />
    </div>
  </div>
</section>
{/* Our Custom Services Section */}
<section className="bg-gray-900 text-white py-16">
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
    {/* Left Column - Text */}
    <div>
      <h2 className="text-2xl font-bold mb-4">Our Custom Services</h2>
      <p className="text-gray-400 mb-4">
        Leverage our trading platforms with Nemmalafx's fully customizable EA frameworks, risk
        strategies, and tools to scale your trading business globally.
      </p>
      <ul className="list-disc list-inside text-gray-400 space-y-4">
        <li>Service Example #1: Bespoke EA tailored to your trading style.</li>
        <li>Service Example #2: Risk management tools to safeguard your investments.</li>
        <li>Service Example #3: Strategy optimization for maximum profitability.</li>
      </ul>
      <div className="mt-6 space-x-4">
        <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          Get a Custom Solution
        </button>
        <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white">
          Chat with Us
        </button>
      </div>
    </div>

    {/* Right Column - Image */}
    <div>
      <img
        src="https://via.placeholder.com/500x400"
        alt="Custom Services"
        className="rounded-lg shadow-lg w-full object-cover"
      />
    </div>
  </div>
</section>

      {/* FAQ Section */}
      <section className="container mx-auto py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-4">
          <div>
            <h3 className="font-bold text-gray-800">What is Nemmalafx?</h3>
            <p className="text-gray-600">
              Nemmalafx provides custom trading tools and frameworks.
            </p>
          </div>
          {/* Add more FAQ items here */}
        </div>
      </section>
      {/* Get Custom Service Section */}
<section className="bg-gray-900 text-white py-16">
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
    {/* Left Column - Text */}
    <div>
      <h2 className="text-3xl font-bold mb-4">Get a Custom Service</h2>
      <p className="text-gray-400 mb-4">
        Scale your trading business with Nemmalafx’s fully customizable EA frameworks, risk strategies, and innovative tools tailored to meet your specific needs. Whether you’re an individual trader or a business owner, we’re here to help.
      </p>
      <ul className="list-disc list-inside text-gray-400 space-y-4">
        <li>Custom-built trading strategies and tools.</li>
        <li>Risk and reward optimization frameworks.</li>
        <li>Real-time support for implementation and success.</li>
      </ul>
      <div className="mt-6 space-x-4">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Request a Custom Solution
        </button>
        <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white">
          Chat with Us
        </button>
      </div>
    </div>

    {/* Right Column - Image */}
    <div>
      <img
        src="https://via.placeholder.com/500x400"
        alt="Custom Service"
        className="rounded-lg shadow-lg w-full object-cover"
      />
    </div>
  </div>
</section>

<Footer/>
    </div>
  );
}
