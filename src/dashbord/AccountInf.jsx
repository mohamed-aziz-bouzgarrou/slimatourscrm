import React, { useState } from "react";
import SidBar from "./SidBar";

const AccountInf = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white fixed inset-0">
        <SidBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-y-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-gray-800">Account</h1>
        </header>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Information Form */}
            <section className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="p-3 border border-gray-300 rounded-lg text-sm" />
                <input type="text" placeholder="Last Name" className="p-3 border border-gray-300 rounded-lg text-sm" />
                <input type="tel" placeholder="Phone Number" className="p-3 border border-gray-300 rounded-lg text-sm" />
                <input type="email" placeholder="Email" className="p-3 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <select className="p-3 border border-gray-300 rounded-lg text-sm">
                  <option value="">Select Country</option>
                  <option value="usa">USA</option>
                  <option value="france">France</option>
                </select>
                <input type="text" placeholder="City" className="p-3 border border-gray-300 rounded-lg text-sm" />
              </div>
              <input type="text" placeholder="Street Address" className="w-full p-3 border border-gray-300 rounded-lg text-sm mt-4" />
              <button className="bg-blue-600 text-white py-2 px-6 rounded-lg mt-4">Save Changes</button>
            </section>

            {/* Profile Card (Smaller Size) */}
            <section className="bg-gray-100 p-2 rounded-lg shadow-md">
              <div className="text-center">
                <img src="https://via.placeholder.com/80" alt="User" className="w-20 h-20 rounded-full mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-800">Jhon Doe</p>
                <span className="bg-yellow-400 text-white py-1 px-4 rounded-full text-sm">Premium</span>
                <p className="text-sm text-gray-600 mt-4">PNG or JPG no bigger than 1000px wide and tall.</p>
                <button className="bg-blue-600 text-white py-2 px-6 rounded-lg mt-4">Upload</button>
              </div>
            </section>
          </div>
        )}

        {activeTab === "security" && (
          <section className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h2>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm text-gray-600">Current Password</label>
              <input type="password" id="currentPassword" placeholder="Type Your Current Password" className="w-full p-3 border border-gray-300 rounded-lg text-sm mt-2" />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm text-gray-600">New Password</label>
              <input type="password" id="newPassword" placeholder="Type Your New Password" className="w-full p-3 border border-gray-300 rounded-lg text-sm mt-2" />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmNewPassword" className="block text-sm text-gray-600">Confirm New Password</label>
              <input type="password" id="confirmNewPassword" placeholder="Type Your Confirm New Password" className="w-full p-3 border border-gray-300 rounded-lg text-sm mt-2" />
            </div>
            <button className="bg-blue-600 text-white py-2 px-6 rounded-lg">Save Security Settings</button>
          </section>
        )}

        <section className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Delete Account</h2>
          <p className="text-sm text-gray-600 mb-4">If you delete your account, all your data will be permanently removed. This action cannot be undone.</p>
          <button className="bg-red-600 text-white py-2 px-6 rounded-lg">Delete Account</button>
        </section>
      </div>
    </div>
  );
};

export default AccountInf;
