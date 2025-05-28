import React, { useState } from 'react';
import { GoHome } from "react-icons/go";
import { IoPeopleSharp } from "react-icons/io5";
import { MdOutlineCardTravel } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import { CiCircleList } from "react-icons/ci";
import logo from '../assets/logo.png'
import { FaRegCreditCard } from "react-icons/fa6";

import { Link, useNavigate } from 'react-router-dom';
import { IoIosGitPullRequest } from "react-icons/io";
import { VscListOrdered } from "react-icons/vsc";
import { LiaBlogSolid } from "react-icons/lia";

export default function AdminSidBar() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    setUser(null); // Reset user state
    navigate('/login');
  };

  const toggleDropdown = (section) => {
    if (section === 'products') {
      setIsProductsOpen(!isProductsOpen);
    } else if (section === 'courses') {
      setIsCoursesOpen(!isCoursesOpen);
    }
  };

  return (
    <aside className="w-64 bg-white bg-opacity-60 backdrop-blur-lg text-gray-800 border-r border-gray-200 p-6 flex flex-col justify-between fixed h-screen top-0 left-0 shadow-lg">
      <div>
        <img src={logo} className="w-32 mb-4" alt="slimaTour Logo" />

        <nav>
          <ul className="space-y-5">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center text-gray-700 text-base hover:text-sky-500 transition duration-200"
              >
                <GoHome className="mr-3 text-lg" /> Accueil
              </Link>
            </li>
     
            <li>
              <Link
                to="/admin/PurchaseHistoryBot"
                className="flex items-center text-gray-700 text-base hover:text-sky-500 transition duration-200"
              >
                <IoPeopleSharp className="mr-3 text-lg" /> Ajouter Client
              </Link>
            </li>
            <li>
              <Link
                to="/admin/blog"
                className="flex items-center text-gray-700 text-base hover:text-sky-500 transition duration-200"
              >
                <MdManageAccounts className="mr-3 text-lg" /> Omra Management
              </Link>
            </li>
            <li>
              <Link
                to="/admin/request"
                className="flex items-center text-gray-700 text-base hover:text-sky-500 transition duration-200"
              >
                <CiCircleList className="mr-3 text-lg" /> List Kembyel
              </Link>
            </li>
            <li>
              <Link
                to="/admin/credit"
                className="flex items-center text-gray-700 text-base hover:text-sky-500 transition duration-200"
              >
                <FaRegCreditCard  className="mr-3 text-lg" /> List credit
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <footer className="flex flex-col items-center mt-auto">
        <button
          className="w-full bg-sky-600 text-white py-2 mt-4 rounded-lg hover:bg-sky-700 transition duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </footer>
    </aside>
  );
}
