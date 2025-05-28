import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 px-4">
        {/* Logo and Description */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-900 rounded-full"></div>
            <span className="text-xl font-bold text-blue-900">NemalaFX</span>
          </div>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipiscing elit aliquam
          </p>
          <div className="flex space-x-4 text-blue-900">
            <a href="#" className="hover:text-blue-700">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-blue-700">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-blue-700">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-blue-700">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="hover:text-blue-700">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Website Links */}
        <div>
          <h3 className="text-lg font-bold text-blue-900 mb-4">Website</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-blue-700">Products</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-700">Services</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-700">School</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-700">Resources</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-700">Updates</a></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-bold text-blue-900 mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-blue-700">About</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-700">Contact us</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-700">Careers</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-700">Culture</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-700">Blog</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-bold text-blue-900 mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-blue-700">Getting started</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-700">Help center</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-700">Server status</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-700">Report a bug</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-700">Chat support</a></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-bold text-blue-900 mb-4">Contacts us</h3>
          <p className="text-gray-600">contact@nemalafx.com</p>
          <p className="text-gray-600">(414) 687 - 5892</p>
          <p className="text-gray-600">794 Mcallister St, San Francisco, 94102</p>
        </div>
      </div>

      <div className="border-t mt-10 pt-6 text-center text-gray-600 text-sm">
        <p>&copy; 2025 NemalaFX. All Rights Reserved.</p>
        <p>
          <a href="#" className="text-blue-700 hover:underline">Terms and Conditions</a> |
          <a href="#" className="text-blue-700 hover:underline ml-2">Privacy Policy</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
