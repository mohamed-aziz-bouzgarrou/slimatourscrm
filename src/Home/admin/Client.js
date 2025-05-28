import React, { useState, useEffect } from "react";
import SidBar from "./AdminSidbar";
import { 
  FaSearch, 
  FaTrash, 
  FaEdit, 
  FaPlus, 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaIdCard,
  FaTimes,
  FaSpinner,
  FaEye
} from "react-icons/fa";
import axios from "axios";
import { showToast } from "../../utlis/toastNotifications";

const Client = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    cin: "",
    name: "",
    phoneNumber: "",
    address: "",
  });
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get user ID from localStorage
  const userId = localStorage.getItem("user");

  // Fetch customers from the API
  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/customer`);
      console.log("Customers fetched:", response.data);
      setCustomers(response.data.customers || response.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to fetch customers. Please try again.");
      showToast("Failed to fetch customers", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    setCustomerForm({
      cin: "",
      name: "",
      phoneNumber: "",
      address: "",
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditingCustomer(null);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      cin: customer.cin,
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
    });
    setIsModalOpen(true);
  };

  const handleViewCustomer = (customer) => {
    setViewingCustomer(customer);
    setIsViewModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validateForm = () => {
    const { cin, name, phoneNumber, address } = customerForm;
    if (!cin.trim()) {
      showToast("CIN is required", "error");
      return false;
    }
    if (!name.trim()) {
      showToast("Name is required", "error");
      return false;
    }
    if (!phoneNumber.trim()) {
      showToast("Phone number is required", "error");
      return false;
    }
    if (!address.trim()) {
      showToast("Address is required", "error");
      return false;
    }
    return true;
  };

  // Handle form submission for creating/updating customer
  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!userId) {
      showToast("User not authenticated. Please log in.", "error");
      return;
    }

    setIsSubmitting(true);

    const customerData = {
      cin: customerForm.cin.trim(),
      name: customerForm.name.trim(),
      phoneNumber: customerForm.phoneNumber.trim(),
      address: customerForm.address.trim(),
      user: userId,
    };

    try {
      let response;
      if (editingCustomer) {
        // Update existing customer
        response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/customer/${editingCustomer._id}`,
          customerData
        );
        showToast("Customer updated successfully!", "success");
      } else {
        // Create new customer
        response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/customer`,
          customerData
        );
        showToast("Customer created successfully!", "success");
      }

      handleCloseModal();
      fetchCustomers(); // Refresh the customers list
    } catch (error) {
      console.error("Error saving customer:", error);
      const errorMessage = error.response?.data?.message || "Failed to save customer";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle customer deletion
  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/customer/${customerId}`);
      showToast("Customer deleted successfully!", "success");
      fetchCustomers(); // Refresh the customers list
    } catch (error) {
      console.error("Error deleting customer:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete customer";
      showToast(errorMessage, "error");
    }
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.cin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phoneNumber?.includes(searchQuery) ||
    customer.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <SidBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Customer Management
            </h1>
            <p className="text-gray-600">Manage your customers efficiently</p>
          </div>

          {/* Search and Create Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers by name, CIN, phone, or address..."
                className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
            >
              <FaPlus className="text-sm" />
              <span className="font-medium">Add Customer</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-3xl text-blue-600" />
              <span className="ml-3 text-gray-600">Loading customers...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchCustomers}
                className="mt-2 text-red-700 hover:text-red-800 font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Customers Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <FaUser className="text-white text-lg" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {customer.name}
                            </h3>
                            <p className="text-sm text-gray-500">Customer</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaIdCard className="text-blue-500 flex-shrink-0" />
                          <span className="text-sm truncate">{customer.cin}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaPhone className="text-green-500 flex-shrink-0" />
                          <span className="text-sm truncate">{customer.phoneNumber}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-600">
                          <FaMapMarkerAlt className="text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm line-clamp-2">{customer.address}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <FaEye className="text-sm" />
                          <span className="text-sm font-medium">View</span>
                        </button>
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <FaEdit className="text-sm" />
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <FaTrash className="text-sm" />
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <FaUser className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No customers found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first customer"}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={handleOpenModal}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaPlus />
                      Add Your First Customer
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCustomer ? "Edit Customer" : "Add New Customer"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CIN *
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      name="cin"
                      value={customerForm.cin}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter CIN"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      name="name"
                      value={customerForm.name}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      name="phoneNumber"
                      value={customerForm.phoneNumber}
                      onChange={handleInputChange}
                      type="tel"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      name="address"
                      value={customerForm.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Enter full address"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCloseModal}
                    type="button"
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    type="button"
                    disabled={isSubmitting || !customerForm.cin || !customerForm.name || !customerForm.phoneNumber || !customerForm.address}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {editingCustomer ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      editingCustomer ? "Update Customer" : "Create Customer"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Customer Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaUser className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{viewingCustomer.name}</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaIdCard className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">CIN</p>
                      <p className="font-medium text-gray-900">{viewingCustomer.cin}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaPhone className="text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">{viewingCustomer.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="text-red-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">{viewingCustomer.address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleEditCustomer(viewingCustomer);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <FaEdit />
                    Edit Customer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Client;