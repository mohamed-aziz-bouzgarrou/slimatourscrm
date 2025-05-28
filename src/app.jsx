
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./user/Login";

import PurchaseHistory from "./dashbord/PurshaseHistory";
import Request from "./dashbord/Request";
import Dashboard from "./dashbord/Dash";

import ProductSection from './Home/ProductSection'
import PayPersonalInfo from "./Home/PayPersonalInfo";
import TradingLandingPage from "./Home/TradingLandingPage";
import ListCours from "./dashbord/ListCours";
import UpdateCourse from "./dashbord/UpdateCourse";
import ListBots from "./dashbord/ListBots";
import UpdateBot from "./dashbord/UpdateBot";
import Home from "./dashbord/Home";
import CoursesList from "./Home/ListCours";
import CourseDetails from "./Home/CoursDetails";
import MyCourses from "./Home/Mycours";
import MycoursDetails from "./Home/MycoursDetails";
import MyBots from "./Home/MyBots";
import BlogListPage from "./Home/ClientBlog";
import BlogDetailPage from "./Home/BlogDetailPage";
import MyCustomizedBots from "./Home/MyCustomizedBots";
import CourseBookingManager from "./dashbord/CourseBookingManager";
import ChatSocket from "./Home/ChatSocket";
import Credit from "./dashbord/Credit";

import SupDashboard from "./dashbord/SuperAdminDash";
import Blog from "./dashbord/blog"
import Client from "./Home/admin/Client";
import CreditAdmin from "./Home/admin/CreditAdmin";
import KmebyleAdmin from "./Home/admin/KmebyleAdmin";
import OmraAdmin from "./Home/admin/OmraAdmin";
import Depence from "./Home/admin/Depence";
import EmployerDepence from "./dashbord/EmployerDepence";
import CustomerManagement from "./dashbord/CustomerManagement";
import BookingManagement from "./dashbord/BookingManagement";
import KembyelManagement from "./dashbord/KembyelManagement";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" replace />;
};


function App() {
  return (

    <Router>
      
      <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
        />
  <Routes>
                <Route path="/" element={<Dashboard />} />

                <Route path="/Create" element={<BlogDetailPage />} />
                <Route path="/client" element={<CustomerManagement />} />
                <Route path="/booking" element={<ProtectedRoute element={<BookingManagement />} />} />
                <Route path="/kembyel" element={<ProtectedRoute element={<KembyelManagement />} />} />
                <Route path="/depence" element={<EmployerDepence />} />
                <Route path="/credit" element={<Credit />} />
                <Route path="/admin/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/admin/depence" element={<ProtectedRoute element={<Depence />} />} />

                <Route path="/login" element={<Login />} />
                <Route path="/admin/SuperDash" element={< SupDashboard/>} />
                <Route path="/admin/client" element={< Client/>} />
                <Route path="/admin/credit" element={< CreditAdmin/>} />
                <Route path="/admin/kembyel" element={< KmebyleAdmin/>} />
                <Route path="/admin/omra" element={< OmraAdmin/>} />

            </Routes>

      </Router>

  );
}

export default App;
