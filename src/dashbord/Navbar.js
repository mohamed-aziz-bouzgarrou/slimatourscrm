import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import user icon
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'
export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to handle dropdown visibility

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/auth/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData); // Example: { name: 'John Doe' }
          } else {
            console.error('Failed to fetch user profile');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUser();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    setUser(null); // Reset user state
    setDropdownOpen(false); // Close dropdown
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
  };

  return (
    <div>
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="text-xl font-bold"><img src={logo} style={{height:"50px"}}/></div>
          <nav className="flex space-x-6 items-center">
  <Link  to={"/"} className="text-secondary hover:text-secondary-dark transition-colors duration-200">Home</Link>
  <Link  to={"/ProductSection"}className="text-secondary hover:text-secondary-dark transition-colors duration-200">Products</Link>
  <Link to={"/blogs"} className="text-secondary hover:text-secondary-dark transition-colors duration-200">Blog</Link>
  <Link  to={""} className="text-secondary hover:text-secondary-dark transition-colors duration-200">Services</Link>
  <Link  to={"/customercours"} className="text-secondary hover:text-secondary-dark transition-colors duration-200">School</Link>
  <Link  to={""} className="text-secondary hover:text-secondary-dark transition-colors duration-200">About Us</Link>
</nav>
          <div className="space-x-4 relative">
            {user ? (
              <div>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <FaUserCircle className="mr-2 text-lg" /> {/* User icon */}
                  <span className="mr-2">{user.name}</span>
                  <svg
                    className={`w-4 h-4 transform ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                    <Link
                      to={'/Mycours'}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Courses
                    </Link>
                    <Link
                      to={'/MyBots'}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Bots
                    </Link>
                    <Link
                      to={'/MycustomeBots'}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Personalized Bots
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                                  <Link to={'/login'}>

                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white">
                  Login
                </button>
                </Link>

                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Explore
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
