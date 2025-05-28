import React, { useState, useEffect } from "react";
import SidBar from "./SidBar";
import { FaSearch, FaTrash } from "react-icons/fa";
import axios from "axios";

const Blog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [umrahForm, setUmrahForm] = useState({
    title: "",
    date: "",
    capacity: "",
    price: "",
    duration: "",
  });
  const [umrahPackages, setUmrahPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Umrah packages from the API
  const fetchUmrahPackages = async () => {
    setIsLoading(true);
    setError(null); // Reset error before new fetch
    try {
      const response = await axios.get(process.env.REACT_APP_API_BASE_URL+"/omra/all");
      console.log(response.data);
      setUmrahPackages(response.data);
    } catch (error) {
      console.error("Error occurred while fetching Umrah packages:", error);
      setError("An error occurred while fetching packages.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUmrahPackages(); // Fetch packages when the component mounts
  }, []);

  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUmrahForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for creating a new Umrah package
  const handleSubmit = async () => {
    const { title, date, capacity, price, duration } = umrahForm;

    if (!title || !date || !capacity || !price || !duration) {
      alert("All fields are required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const umrahData = {
      title,
      date: new Date(date).toISOString(),
      capacity: parseInt(capacity),
      price: parseFloat(price),
      duration: parseInt(duration),
    };

    try {
      const response = await fetch(process.env.REACT_APP_API_BASE_URL+"/omra/omras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(umrahData),
      });

      if (response.ok) {
        alert("Umrah package created successfully!");
        setIsModalOpen(false);
        setUmrahForm({ title: "", date: "", capacity: "", price: "", duration: "" });
        fetchUmrahPackages(); // Refresh the packages after creating a new one
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating the Umrah package.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed inset-0 w-64 bg-white border-r border-gray-200 p-5">
        <SidBar />
      </div>
      <div className="flex-1 ml-64 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="relative w-1/3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full p-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
          </div>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Create Package
          </button>
        </header>

        {/* Display Umrah packages */}
        {isLoading && <p>Loading packages...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="grid grid-cols-3 gap-6">
          {umrahPackages
            .filter((pkg) =>
              pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              new Date(pkg.date).toLocaleDateString().includes(searchQuery)
            )
            .map((pkg) => (
              <div key={pkg._id} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800">{pkg.title}</h2>
                <p className="text-sm text-gray-600">Date: {new Date(pkg.date).toLocaleDateString()}</p>
                <p className="mt-2 text-gray-800">Capacity: {pkg.capacity}</p>
                <p className="text-gray-800">Price: {pkg.price} TND</p>
                <p className="text-gray-800">Duration: {pkg.duration} days</p>
              </div>
            ))}
        </div>

        {/* Modal for creating Umrah packages */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h2 className="text-xl font-semibold mb-4">Create New Umrah Package</h2>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Title</label>
                <input
                  name="title"
                  value={umrahForm.title}
                  onChange={handleInputChange}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter package title"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Date</label>
                <input
                  name="date"
                  value={umrahForm.date}
                  onChange={handleInputChange}
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Capacity</label>
                <input
                  name="capacity"
                  value={umrahForm.capacity}
                  onChange={handleInputChange}
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter capacity"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Price</label>
                <input
                  name="price"
                  value={umrahForm.price}
                  onChange={handleInputChange}
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter price"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Duration (days)</label>
                <input
                  name="duration"
                  value={umrahForm.duration}
                  onChange={handleInputChange}
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter duration"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!umrahForm.title || !umrahForm.date || !umrahForm.capacity || !umrahForm.price || !umrahForm.duration}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save Package
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
