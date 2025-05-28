"use client"

import { useState, useEffect } from "react"
import SidBar from "./SidBar"
import {
  FaSearch,
  FaTrash,
  FaPlus,
  FaPhone,
  FaIdCard,
  FaTimes,
  FaSpinner,
  FaEye,
  FaMoneyBillWave,
  FaCreditCard,
  FaServicestack,
  FaPrint,
  FaFileInvoice,
} from "react-icons/fa"
import axios from "axios"
import { showToast } from "../utlis/toastNotifications"

const BookingManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [viewingBooking, setViewingBooking] = useState(null)
  const [selectedBookingId, setSelectedBookingId] = useState(null)

  const [bookingForm, setBookingForm] = useState({
    customerId: "",
    typeOfService: "",
    totalPrice: "",
    note: "",
    initialPayment: {
      amount: "",
      method: "",
      note: "",
      traiteId: "",
    },
  })

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "",
    note: "",
    traiteId: "",
  })

  const [bookings, setBookings] = useState([])
  const [customers, setCustomers] = useState([])
  const [traites, setTraites] = useState([])
  const [filteredTraites, setFilteredTraites] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingTraites, setIsLoadingTraites] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage] = useState(6)

  // Get user ID from localStorage
  const userId = localStorage.getItem("user")

  // Fetch traites from the API using the correct endpoint
  const fetchTraites = async () => {
    setIsLoadingTraites(true)
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/kembyel`)
      console.log("Traites fetched:", response.data)
      setTraites(response.data.kembyels || response.data || [])
    } catch (error) {
      console.error("Error fetching traites:", error)
      showToast("Failed to fetch traites", "error")
    } finally {
      setIsLoadingTraites(false)
    }
  }

  // Filter traites based on customer ID using the correct endpoint
  const filterTraitesByCustomer = async (customerId) => {
    console.log("Filtering traites for customer:", customerId)

    if (!customerId) {
      console.log("No customer ID provided")
      setFilteredTraites([])
      return
    }

    setIsLoadingTraites(true)
    try {
      // Use the correct endpoint to fetch kembyels by customer ID
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/kembyel/customer/${customerId}`)
      console.log("Customer traites fetched:", response.data)

      // Handle different possible response structures
      let customerTraites = []
      if (Array.isArray(response.data)) {
        customerTraites = response.data
      } else if (response.data.kembyels && Array.isArray(response.data.kembyels)) {
        customerTraites = response.data.kembyels
      } else if (response.data.data && Array.isArray(response.data.data)) {
        customerTraites = response.data.data
      } else {
        console.log("Unexpected response structure:", response.data)
        customerTraites = []
      }

      console.log("Processed customer traites:", customerTraites)

      // Filter for available traites (unpaid payments)
      const availableTraites = customerTraites.filter((traite) => {
        // Check if traite has any unpaid payments
        const hasUnpaidPayments =
          traite.payments &&
          Array.isArray(traite.payments) &&
          traite.payments.some((payment) => payment.status === "unpaid")
        console.log(`Traite ${traite._id} has unpaid payments:`, hasUnpaidPayments)
        return hasUnpaidPayments
      })

      console.log("Available traites for customer:", availableTraites)
      setFilteredTraites(availableTraites)
    } catch (error) {
      console.error("Error fetching customer traites:", error)
      showToast("Failed to fetch customer traites", "error")
      setFilteredTraites([])
    } finally {
      setIsLoadingTraites(false)
    }
  }

  // Fetch bookings from the API
  const fetchBookings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/omrabooking`)
      console.log("Bookings fetched:", response.data)
      setBookings(response.data.bookings || response.data || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setError("Failed to fetch bookings. Please try again.")
      showToast("Failed to fetch bookings", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch customers from the API
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/customer`)
      console.log("Customers fetched:", response.data)
      setCustomers(response.data.customers || response.data || [])
    } catch (error) {
      console.error("Error fetching customers:", error)
      showToast("Failed to fetch customers", "error")
    }
  }

  useEffect(() => {
    fetchBookings()
    fetchCustomers()
    fetchTraites()
  }, [])

  // Filter traites when customer changes in booking form
  useEffect(() => {
    if (bookingForm.customerId) {
      filterTraitesByCustomer(bookingForm.customerId)
    }
  }, [bookingForm.customerId])

  // Filter traites when payment modal opens
  useEffect(() => {
    if (isPaymentModalOpen && selectedBookingId) {
      const booking = bookings.find((b) => b._id === selectedBookingId)
      if (booking && booking.customerId) {
        filterTraitesByCustomer(booking.customerId._id || booking.customerId)
      }
    }
  }, [isPaymentModalOpen, selectedBookingId, bookings])

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBooking(null)
    setBookingForm({
      customerId: "",
      typeOfService: "",
      totalPrice: "",
      note: "",
      initialPayment: {
        amount: "",
        method: "",
        note: "",
        traiteId: "",
      },
    })
  }

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setPaymentForm({
      amount: "",
      method: "",
      note: "",
      traiteId: "",
    })
    setFilteredTraites([])
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setEditingBooking(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("initialPayment.")) {
      const paymentField = name.split(".")[1]
      setBookingForm((prev) => ({
        ...prev,
        initialPayment: {
          ...prev.initialPayment,
          [paymentField]: value,
        },
      }))
    } else {
      setBookingForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target
    setPaymentForm((prev) => ({ ...prev, [name]: value }))
  }

  // Validate booking form
  const validateBookingForm = () => {
    const { customerId, typeOfService, totalPrice } = bookingForm
    if (!customerId) {
      showToast("Please select a customer", "error")
      return false
    }
    if (!typeOfService) {
      showToast("Please select a service type", "error")
      return false
    }
    if (!totalPrice || totalPrice <= 0) {
      showToast("Please enter a valid total price", "error")
      return false
    }

    // Validate traite selection if payment method is traite
    if (bookingForm.initialPayment.method === "traite" && bookingForm.initialPayment.amount) {
      if (!bookingForm.initialPayment.traiteId) {
        showToast("Please select a traite for this payment", "error")
        return false
      }
    }

    return true
  }

  // Validate payment form
  const validatePaymentForm = () => {
    if (!paymentForm.amount || !paymentForm.method) {
      showToast("Please fill in all required payment fields", "error")
      return false
    }

    // Validate traite selection if payment method is traite
    if (paymentForm.method === "traite" && !paymentForm.traiteId) {
      showToast("Please select a traite for this payment", "error")
      return false
    }

    return true
  }

  // Handle booking creation
  const handleSubmit = async () => {
    if (!validateBookingForm()) return

    if (!userId) {
      showToast("User not authenticated. Please log in.", "error")
      return
    }

    setIsSubmitting(true)

    const bookingData = {
      customerId: bookingForm.customerId,
      userId: userId,
      typeOfService: bookingForm.typeOfService,
      totalPrice: Number.parseFloat(bookingForm.totalPrice),
      note: bookingForm.note,
    }

    // Add initial payment if provided
    if (bookingForm.initialPayment.amount) {
      const paymentData = {
        amount: Number.parseFloat(bookingForm.initialPayment.amount),
        method: bookingForm.initialPayment.method,
        note: bookingForm.initialPayment.note,
      }

      // Add traiteId if payment method is traite
      if (bookingForm.initialPayment.method === "traite") {
        paymentData.traiteId = bookingForm.initialPayment.traiteId
      }

      bookingData.payments = [paymentData]
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/omrabooking`, bookingData)
      showToast("Booking created successfully!", "success")
      handleCloseModal()
      fetchBookings()
      fetchTraites() // Refresh traites in case one was used
    } catch (error) {
      console.error("Error creating booking:", error)
      const errorMessage = error.response?.data?.message || "Failed to create booking"
      showToast(errorMessage, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle adding payment to existing booking (FIXED: Using PATCH method)
  const handleAddPayment = async () => {
    if (!validatePaymentForm()) return

    setIsSubmitting(true)

    const paymentData = {
      amount: Number.parseFloat(paymentForm.amount),
      method: paymentForm.method,
      note: paymentForm.note,
    }

    // Add traiteId if payment method is traite
    if (paymentForm.method === "traite") {
      paymentData.traiteId = paymentForm.traiteId
    }

    try {
      // FIXED: Using PATCH method instead of POST
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/omrabooking/${selectedBookingId}/payment`,
        paymentData,
      )
      showToast("Payment added successfully!", "success")
      handleClosePaymentModal()
      fetchBookings()
      fetchTraites() // Refresh traites in case one was used
    } catch (error) {
      console.error("Error adding payment:", error)
      const errorMessage = error.response?.data?.message || "Failed to add payment"
      showToast(errorMessage, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewBooking = (booking) => {
    setViewingBooking(booking)
    setIsViewModalOpen(true)
  }

  const handleOpenPaymentModal = (bookingId) => {
    setSelectedBookingId(bookingId)
    setIsPaymentModalOpen(true)
  }

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/omrabooking/${bookingId}`)
      showToast("Booking deleted successfully!", "success")
      fetchBookings()
    } catch (error) {
      console.error("Error deleting booking:", error)
      const errorMessage = error.response?.data?.message || "Failed to delete booking"
      showToast(errorMessage, "error")
    }
  }

  // Filter bookings based on search query
  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      booking.customerId?.name?.toLowerCase().includes(searchLower) ||
      booking.customerId?.cin?.toLowerCase().includes(searchLower) ||
      booking.customerId?.phoneNumber?.includes(searchQuery) ||
      booking.typeOfService?.toLowerCase().includes(searchLower) ||
      booking.paymentStatus?.toLowerCase().includes(searchLower)
    )
  })

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)

  const getServiceTypeLabel = (type) => {
    const types = {
      trips: "Voyage",
      ticket: "Billet",
      hotel: "Hôtel",
      omra: "Omra",
      transfer: "Transfert",
    }
    return types[type] || type
  }

  const getPaymentMethodLabel = (method) => {
    const methods = {
      cheque: "Chèque",
      virement: "Virement",
      espece: "Espèces",
      traite: "Traite",
    }
    return methods[method] || method
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      case "unpaid":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gestion des Réservations</h1>
            <p className="text-gray-600">Gérez vos réservations et paiements efficacement</p>
          </div>

          {/* Search and Create Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par client, CIN, téléphone, service..."
                className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
            >
              <FaPlus className="text-sm" />
              <span className="font-medium">Nouvelle Réservation</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-3xl text-blue-600" />
              <span className="ml-3 text-gray-600">Chargement des réservations...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button onClick={fetchBookings} className="mt-2 text-red-700 hover:text-red-800 font-medium">
                Réessayer
              </button>
            </div>
          )}

          {/* Bookings Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBookings.length > 0 ? (
                currentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <FaServicestack className="text-white text-lg" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.customerId?.name || "Client inconnu"}
                            </h3>
                            <p className="text-sm text-gray-500">{getServiceTypeLabel(booking.typeOfService)}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}
                        >
                          {booking.paymentStatus === "paid"
                            ? "Payé"
                            : booking.paymentStatus === "partial"
                              ? "Partiel"
                              : "Non payé"}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaIdCard className="text-blue-500 flex-shrink-0" />
                          <span className="text-sm">{booking.customerId?.cin || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaPhone className="text-green-500 flex-shrink-0" />
                          <span className="text-sm">{booking.customerId?.phoneNumber || "N/A"}</span>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Prix Total:</span>
                          <span className="font-semibold text-gray-900">{booking.totalPrice} TND</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Payé:</span>
                          <span className="font-semibold text-green-600">{booking.totalPayments || 0} TND</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Restant:</span>
                          <span className="font-semibold text-red-600">{booking.remainingPayment || 0} TND</span>
                        </div>
                      </div>

                      {/* Payment Count */}
                      <div className="flex items-center gap-2 mb-4">
                        <FaCreditCard className="text-purple-500" />
                        <span className="text-sm text-gray-600">{booking.paymentCount || 0} paiement(s)</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          <FaEye className="text-xs" />
                          Voir
                        </button>
                        <button
                          onClick={() => handleOpenPaymentModal(booking._id)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                        >
                          <FaMoneyBillWave className="text-xs" />
                          Payer
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          <FaTrash className="text-xs" />
                          Suppr.
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <FaServicestack className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune réservation trouvée</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery
                      ? "Essayez d'ajuster vos critères de recherche"
                      : "Commencez par créer votre première réservation"}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={handleOpenModal}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaPlus />
                      Créer une Réservation
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Nouvelle Réservation</h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {/* Customer Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                  <select
                    name="customerId"
                    value={bookingForm.customerId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionner un client</option>
                    {customers.map((customer) => (
                      <option key={customer._id} value={customer._id}>
                        {customer.name} - {customer.phoneNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de Service *</label>
                    <select
                      name="typeOfService"
                      value={bookingForm.typeOfService}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    >
                      <option value="">Sélectionner un service</option>
                      <option value="trips">Voyage</option>
                      <option value="ticket">Billet</option>
                      <option value="hotel">Hôtel</option>
                      <option value="omra">Omra</option>
                      <option value="transfer">Transfert</option>
                    </select>
                  </div>

                  {/* Total Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix Total (TND) *</label>
                    <input
                      name="totalPrice"
                      value={bookingForm.totalPrice}
                      onChange={handleInputChange}
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                  <textarea
                    name="note"
                    value={bookingForm.note}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Notes additionnelles..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Initial Payment Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Paiement Initial (Optionnel)</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Montant (TND)</label>
                      <input
                        name="initialPayment.amount"
                        value={bookingForm.initialPayment.amount}
                        onChange={handleInputChange}
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Méthode de Paiement</label>
                      <select
                        name="initialPayment.method"
                        value={bookingForm.initialPayment.method}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isSubmitting}
                      >
                        <option value="">Sélectionner une méthode</option>
                        <option value="cheque">Chèque</option>
                        <option value="virement">Virement</option>
                        <option value="espece">Espèces</option>
                        <option value="traite">Traite</option>
                      </select>
                    </div>
                  </div>

                  {/* Traite Selection for Initial Payment */}
                  {bookingForm.initialPayment.method === "traite" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner une Traite *</label>
                      {isLoadingTraites ? (
                        <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg">
                          <FaSpinner className="animate-spin text-blue-600" />
                          <span className="text-gray-600">Chargement des traites...</span>
                        </div>
                      ) : (
                        <select
                          name="initialPayment.traiteId"
                          value={bookingForm.initialPayment.traiteId}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isSubmitting}
                        >
                          <option value="">Sélectionner une traite</option>
                          {filteredTraites.map((traite) => (
                            <option key={traite._id} value={traite._id}>
                              {traite.name} - Total: {traite.payments.reduce((sum, p) => sum + p.amount, 0)} TND -
                              Unpaid:{" "}
                              {traite.payments
                                .filter((p) => p.status === "unpaid")
                                .reduce((sum, p) => sum + p.amount, 0)}{" "}
                              TND
                            </option>
                          ))}
                        </select>
                      )}
                      {filteredTraites.length === 0 && !isLoadingTraites && bookingForm.customerId && (
                        <p className="text-sm text-gray-500 mt-1">Aucune traite disponible pour ce client</p>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note du Paiement</label>
                    <input
                      name="initialPayment.note"
                      value={bookingForm.initialPayment.note}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Note pour ce paiement..."
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
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmit}
                    type="button"
                    disabled={
                      isSubmitting || !bookingForm.customerId || !bookingForm.typeOfService || !bookingForm.totalPrice
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Création...
                      </>
                    ) : (
                      "Créer la Réservation"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Ajouter un Paiement</h2>
                <button
                  onClick={handleClosePaymentModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant (TND) *</label>
                  <input
                    name="amount"
                    value={paymentForm.amount}
                    onChange={handlePaymentInputChange}
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Méthode de Paiement *</label>
                  <select
                    name="method"
                    value={paymentForm.method}
                    onChange={handlePaymentInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionner une méthode</option>
                    <option value="cheque">Chèque</option>
                    <option value="virement">Virement</option>
                    <option value="espece">Espèces</option>
                    <option value="traite">Traite</option>
                  </select>
                </div>

                {/* Traite Selection for Payment */}
                {paymentForm.method === "traite" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner une Traite *</label>
                    {isLoadingTraites ? (
                      <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg">
                        <FaSpinner className="animate-spin text-blue-600" />
                        <span className="text-gray-600">Chargement des traites...</span>
                      </div>
                    ) : (
                      <select
                        name="traiteId"
                        value={paymentForm.traiteId}
                        onChange={handlePaymentInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isSubmitting}
                      >
                        <option value="">Sélectionner une traite</option>
                        {filteredTraites.map((traite) => (
                          <option key={traite._id} value={traite._id}>
                            {traite.name} - Total: {traite.payments.reduce((sum, p) => sum + p.amount, 0)} TND - Unpaid:{" "}
                            {traite.payments.filter((p) => p.status === "unpaid").reduce((sum, p) => sum + p.amount, 0)}{" "}
                            TND
                          </option>
                        ))}
                      </select>
                    )}
                    {filteredTraites.length === 0 && !isLoadingTraites && (
                      <p className="text-sm text-gray-500 mt-1">Aucune traite disponible pour ce client</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                  <input
                    name="note"
                    value={paymentForm.note}
                    onChange={handlePaymentInputChange}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Note pour ce paiement..."
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleClosePaymentModal}
                    type="button"
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    disabled={isSubmitting}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddPayment}
                    type="button"
                    disabled={
                      isSubmitting ||
                      !paymentForm.amount ||
                      !paymentForm.method ||
                      (paymentForm.method === "traite" && !paymentForm.traiteId)
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Ajout...
                      </>
                    ) : (
                      "Ajouter le Paiement"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Booking Modal */}
      {isViewModalOpen && viewingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Détails de la Réservation</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Informations Client</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nom</p>
                      <p className="font-medium">{viewingBooking.customerId?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CIN</p>
                      <p className="font-medium">{viewingBooking.customerId?.cin || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Téléphone</p>
                      <p className="font-medium">{viewingBooking.customerId?.phoneNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Adresse</p>
                      <p className="font-medium">{viewingBooking.customerId?.address || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Détails de la Réservation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Service</p>
                      <p className="font-medium">{getServiceTypeLabel(viewingBooking.typeOfService)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Statut</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewingBooking.paymentStatus)}`}
                      >
                        {viewingBooking.paymentStatus === "paid"
                          ? "Payé"
                          : viewingBooking.paymentStatus === "partial"
                            ? "Partiel"
                            : "Non payé"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Prix Total</p>
                      <p className="font-medium text-lg">{viewingBooking.totalPrice} TND</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Montant Restant</p>
                      <p className="font-medium text-lg text-red-600">{viewingBooking.remainingPayment || 0} TND</p>
                    </div>
                  </div>
                  {viewingBooking.note && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Note</p>
                      <p className="font-medium">{viewingBooking.note}</p>
                    </div>
                  )}
                </div>

                {/* Payments History */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Historique des Paiements ({viewingBooking.paymentCount || 0})
                  </h3>
                  {viewingBooking.payments && viewingBooking.payments.length > 0 ? (
                    <div className="space-y-3">
                      {viewingBooking.payments.map((payment, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{payment.amount} TND</p>
                              <p className="text-sm text-gray-600">
                                {getPaymentMethodLabel(payment.method)}
                                {payment.method === "traite" && payment.traiteId && (
                                  <span className="ml-1">
                                    <FaFileInvoice className="inline text-xs" />
                                  </span>
                                )}
                              </p>
                              {payment.note && <p className="text-sm text-gray-500 mt-1">{payment.note}</p>}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                {new Date(payment.paymentDate).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun paiement enregistré</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false)
                      handleOpenPaymentModal(viewingBooking._id)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <FaMoneyBillWave />
                    Ajouter un Paiement
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <FaPrint />
                    Imprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingManagement
