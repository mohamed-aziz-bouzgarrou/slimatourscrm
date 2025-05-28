import React, { useEffect, useState } from "react";
import axios from "axios";
import SidBar from "./SidBar";

const CourseBookings = () => {
  const [courseBookings, setCourseBookings] = useState([]);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  // Fetch course bookings
  useEffect(() => {
    const fetchCourseBookings = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/coursbooking/getall", {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        });
        console.log(response)
        setCourseBookings(response.data);
      } catch (error) {
        console.error("Error fetching course bookings:", error);
      }
    };
    fetchCourseBookings();
  }, [token]);

  // Update booking status
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.put(
        "http://localhost:3000/api/coursbooking/status",
        {
          bookingId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        }
      );

      setCourseBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  // Filter course bookings
  const filteredCourseBookings =
    filter === "all"
      ? courseBookings
      : courseBookings.filter((booking) => booking.status === filter);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <SidBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Course Bookings</h1>
          <select
            className="p-2 border rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="accepted">Accepted</option>
            <option value="pending">Pending</option>
          </select>
        </header>

        {/* Course Bookings Table */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="text-left p-4 font-semibold">User</th>
                  <th className="text-left p-4 font-semibold">Course</th>
                  <th className="text-left p-4 font-semibold">Price</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourseBookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-4 text-gray-800">{booking.user}</td>
                    <td className="p-4 text-gray-800">
                      {booking.course.title} <br />
                      <span className="text-sm text-gray-600">{booking.course.category}</span>
                    </td>
                    <td className="p-4 text-gray-800">${booking.course.price}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          booking.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        className="p-2 border rounded"
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CourseBookings;
