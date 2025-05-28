import React, { useState } from "react";
import Footer from "./Footer";

const PayPersonalInfo = () => {
  const [activeTab, setActiveTab] = useState("personalInfo");

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <div className="text-xl font-bold text-blue-900">NemalaFX</div>
        <nav className="flex space-x-6 items-center">
  <a href="#" className="text-secondary hover:text-secondary-dark transition-colors duration-200">Home</a>
  <a href="#" className="text-secondary hover:text-secondary-dark transition-colors duration-200">Products</a>
  <a href="#" className="text-secondary hover:text-secondary-dark transition-colors duration-200">Strategies</a>
  <a href="#" className="text-secondary hover:text-secondary-dark transition-colors duration-200">Services</a>
  <a href="#" className="text-secondary hover:text-secondary-dark transition-colors duration-200">School</a>
  <a href="#" className="text-secondary hover:text-secondary-dark transition-colors duration-200">About Us</a>
</nav>

        <div className="space-x-4">
          <button className="text-blue-700">Log In</button>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-md">Sign Up</button>
        </div>
      </header>

      <main className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          {/* Onglets */}
          <div className="flex space-x-6 mb-8">
            <button
              onClick={() => setActiveTab("personalInfo")}
              className={`py-2 px-4 rounded-md ${
                activeTab === "personalInfo" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab("paymentMethod")}
              className={`py-2 px-4 rounded-md ${
                activeTab === "paymentMethod" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              Payment Method
            </button>
          </div>

          {/* Contenu Dynamique */}
          {activeTab === "personalInfo" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email Address *</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                <label className="block text-sm font-medium">Phone Number *</label>
                <div className="flex items-center">
  <select className="px-3 py-2 bg-gray-100 border rounded-l-md" defaultValue="+1">
    <option value="+1">🇺🇸 +1</option>
    <option value="+33">🇫🇷 +33</option>
    <option value="+44">🇬🇧 +44</option>
    <option value="+49">🇩🇪 +49</option>
    <option value="+61">🇦🇺 +61</option>
    <option value="+34">🇪🇸 +34</option>
    <option value="+39">🇮🇹 +39</option>
    <option value="+55">🇧🇷 +55</option>
    <option value="+91">🇮🇳 +91</option>
    <option value="+81">🇯🇵 +81</option>
    <option value="+52">🇲🇽 +52</option>
    <option value="+7">🇷🇺 +7</option>
    <option value="+32">🇧🇪 +32</option>
    <option value="+27">🇿🇦 +27</option>
    <option value="+82">🇰🇷 +82</option>
    <option value="+1">🇨🇦 +1</option>
    <option value="+20">🇪🇬 +20</option>
    <option value="+971">🇦🇪 +971</option>
    <option value="+34">🇪🇸 +34</option>
    <option value="+66">🇹🇭 +66</option>
    <option value="+216">🇹🇳 +216</option> {/* Tunisia */}
  </select>
  <input
    type="text"
    placeholder="Enter phone number"
    className="w-full p-2 border rounded-r-md"
  />
</div>

                </div>
                <div className="flex gap-4">
                <div className="flex-1">
  <label className="block text-sm font-medium">Country *</label>
  <select className="w-full p-2 border rounded-md">
    <option>Choose country</option>
    <option>USA</option>
    <option>France</option>
    <option>United Kingdom</option>
    <option>Germany</option>
    <option>Canada</option>
    <option>Australia</option>
    <option>Brazil</option>
    <option>India</option>
    <option>China</option>
    <option>Japan</option>
    <option>Mexico</option>
    <option>Italy</option>
    <option>Spain</option>
    <option>South Korea</option>
    <option>South Africa</option>
    <option>Russia</option>
    <option>Argentina</option>
    <option>Egypt</option>
    <option>Saudi Arabia</option>
    <option>Turkey</option>
    <option>UAE</option>
    
  </select>
</div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium">City</label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">ZIP Code</label>
                  <input
                    type="text"
                    placeholder="Enter ZIP code"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="h-4 w-4" />
                  <label className="text-sm">I agree to the Terms and Conditions</label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white py-2 rounded-md"
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {activeTab === "paymentMethod" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
  <div className="space-y-4">
    <div>
      <button className="w-full text-left flex items-center justify-between p-2 border rounded-md">
        Google Pay
        <span>&#8250;</span>
      </button>
    </div>
    <div>
      <button className="w-full text-left flex items-center justify-between p-2 border rounded-md">
        Debit Card
        <span>&#8250;</span>
      </button>
    </div>
    <div className="pl-4">
      <div className="flex items-center gap-2 mb-2">
        <input type="radio" id="card1" name="card" className="w-4 h-4" />
        <label htmlFor="card1" className="flex items-center gap-2">
          <img src="./Home/iconesPay/p1.png" alt="MasterCard Icon" className="w-6 h-6" />
          Axim Bank **** **** **** 4578
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input type="radio" id="card2" name="card" className="w-4 h-4" />
        <label htmlFor="card2" className="flex items-center gap-2">
          <img src="./Home/iconesPay/p2.jpg" alt="Visa Icon" className="w-6 h-6" />
          HDFC Bank **** **** **** 4521
        </label>
      </div>
      <button className="mt-4 w-full text-left flex items-center p-2 border rounded-md">
        + Add New Cards
      </button>
    </div>
    <button className="mt-4 w-full text-left flex items-center p-2 border rounded-md">
      + Choose another Method
    </button>
  </div>
</div>

          
          
          )}
        </div>

        {/* Order Summary Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="flex items-center space-x-4 mb-4">
            <img
              src="https://via.placeholder.com/80"
              alt="Product"
              className="w-16 h-16 rounded-md"
            />
            <div>
              <h3 className="font-medium">HeikenAshi EA</h3>
              <p className="text-sm text-gray-600">Expert Adviser</p>
              <p className="text-sm text-gray-600">Version 2.2.1</p>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Coupons</label>
            <input
              type="text"
              placeholder="Enter code"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Order</span>
              <span>$89.99</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Fees</span>
              <span>$2.00</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>$91.99</span>
            </div>
          </div>
          <button className="w-full bg-blue-700 text-white py-2 mt-4 rounded-md">
            Pay Now
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PayPersonalInfo;
