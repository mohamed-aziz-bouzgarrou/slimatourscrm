"use client"

import { useState, useEffect } from "react"
import AdminSidbar from "./AdminSidbar"
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
  FaUser,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa"
import axios from "axios"

const OmraAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [viewingBooking, setViewingBooking] = useState(null)
  const [selectedBookingId, setSelectedBookingId] = useState(null)

  const [bookingForm, setBookingForm] = useState({
    customerId: "",
    userId: "",
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
  const [users, setUsers] = useState([])
  const [traites, setTraites] = useState([])
  const [filteredTraites, setFilteredTraites] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingTraites, setIsLoadingTraites] = useState(false)
  const [error, setError] = useState(null)

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState("all")
  const [selectedService, setSelectedService] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage] = useState(9)

  // Fetch all bookings (admin view - no user filtering)
  const fetchBookings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/omrabooking`)
      console.log("All bookings fetched:", response.data)
      setBookings(response.data.bookings || response.data || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setError("Échec de la récupération des réservations. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/customer`)
      console.log("Customers fetched:", response.data)
      setCustomers(response.data.customers || response.data || [])
    } catch (error) {
      console.error("Error fetching customers:", error)
    }
  }

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users`)
      console.log("Users fetched:", response.data)
      const usersData = response.data.data?.data || response.data.data || response.data || []
      setUsers(usersData)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  // Fetch traites
  const fetchTraites = async () => {
    setIsLoadingTraites(true)
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/kembyel`)
      console.log("Traites fetched:", response.data)
      setTraites(response.data.kembyels || response.data || [])
    } catch (error) {
      console.error("Error fetching traites:", error)
    } finally {
      setIsLoadingTraites(false)
    }
  }

  // Filter traites based on customer ID
  const filterTraitesByCustomer = async (customerId) => {
    console.log("Filtering traites for customer:", customerId)

    if (!customerId) {
      console.log("No customer ID provided")
      setFilteredTraites([])
      return
    }

    setIsLoadingTraites(true)
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/kembyel/customer/${customerId}`)
      console.log("Customer traites fetched:", response.data)

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

      const availableTraites = customerTraites.filter((traite) => {
        const hasUnpaidPayments =
          traite.payments &&
          Array.isArray(traite.payments) &&
          traite.payments.some((payment) => payment.status === "unpaid")
        return hasUnpaidPayments
      })

      console.log("Available traites for customer:", availableTraites)
      setFilteredTraites(availableTraites)
    } catch (error) {
      console.error("Error fetching customer traites:", error)
      setFilteredTraites([])
    } finally {
      setIsLoadingTraites(false)
    }
  }

  useEffect(() => {
    fetchBookings()
    fetchCustomers()
    fetchUsers()
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
      userId: "",
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
    const { customerId, userId, typeOfService, totalPrice } = bookingForm
    if (!customerId) {
      alert("Veuillez sélectionner un client")
      return false
    }
    if (!userId) {
      alert("Veuillez sélectionner un utilisateur")
      return false
    }
    if (!typeOfService) {
      alert("Veuillez sélectionner un type de service")
      return false
    }
    if (!totalPrice || totalPrice <= 0) {
      alert("Veuillez entrer un prix total valide")
      return false
    }

    if (bookingForm.initialPayment.method === "traite" && bookingForm.initialPayment.amount) {
      if (!bookingForm.initialPayment.traiteId) {
        alert("Veuillez sélectionner une traite pour ce paiement")
        return false
      }
    }

    return true
  }

  // Validate payment form
  const validatePaymentForm = () => {
    if (!paymentForm.amount || !paymentForm.method) {
      alert("Veuillez remplir tous les champs de paiement requis")
      return false
    }

    if (paymentForm.method === "traite" && !paymentForm.traiteId) {
      alert("Veuillez sélectionner une traite pour ce paiement")
      return false
    }

    return true
  }

  // Handle booking creation
  const handleSubmit = async () => {
    if (!validateBookingForm()) return

    setIsSubmitting(true)

    const bookingData = {
      customerId: bookingForm.customerId,
      userId: bookingForm.userId,
      typeOfService: bookingForm.typeOfService,
      totalPrice: Number.parseFloat(bookingForm.totalPrice),
      note: bookingForm.note,
    }

    if (bookingForm.initialPayment.amount) {
      const paymentData = {
        amount: Number.parseFloat(bookingForm.initialPayment.amount),
        method: bookingForm.initialPayment.method,
        note: bookingForm.initialPayment.note,
      }

      if (bookingForm.initialPayment.method === "traite") {
        paymentData.traiteId = bookingForm.initialPayment.traiteId
      }

      bookingData.payments = [paymentData]
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/omrabooking`, bookingData)
      alert("Réservation créée avec succès!")
      handleCloseModal()
      fetchBookings()
      fetchTraites()
    } catch (error) {
      console.error("Error creating booking:", error)
      const errorMessage = error.response?.data?.message || "Échec de la création de la réservation"
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle adding payment to existing booking
  const handleAddPayment = async () => {
    if (!validatePaymentForm()) return

    setIsSubmitting(true)

    const paymentData = {
      amount: Number.parseFloat(paymentForm.amount),
      method: paymentForm.method,
      note: paymentForm.note,
    }

    if (paymentForm.method === "traite") {
      paymentData.traiteId = paymentForm.traiteId
    }

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/omrabooking/${selectedBookingId}/payment`,
        paymentData,
      )
      alert("Paiement ajouté avec succès!")
      handleClosePaymentModal()
      fetchBookings()
      fetchTraites()
    } catch (error) {
      console.error("Error adding payment:", error)
      const errorMessage = error.response?.data?.message || "Échec de l'ajout du paiement"
      alert(errorMessage)
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
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation?")) {
      return
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/omrabooking/${bookingId}`)
      alert("Réservation supprimée avec succès!")
      fetchBookings()
    } catch (error) {
      console.error("Error deleting booking:", error)
      const errorMessage = error.response?.data?.message || "Échec de la suppression de la réservation"
      alert(errorMessage)
    }
  }

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    // Filter by user
    if (selectedUser !== "all" && booking.userId !== selectedUser && booking.userId?._id !== selectedUser) {
      return false
    }

    // Filter by service type
    if (selectedService !== "all" && booking.typeOfService !== selectedService) {
      return false
    }

    // Filter by payment status
    if (selectedStatus !== "all" && booking.paymentStatus !== selectedStatus) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      return (
        booking.customerId?.name?.toLowerCase().includes(searchLower) ||
        booking.customerId?.cin?.toLowerCase().includes(searchLower) ||
        booking.customerId?.phoneNumber?.includes(searchQuery) ||
        booking.typeOfService?.toLowerCase().includes(searchLower) ||
        booking.paymentStatus?.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let aValue, bValue

    switch (sortBy) {
      case "customer":
        aValue = a.customerId?.name?.toLowerCase() || ""
        bValue = b.customerId?.name?.toLowerCase() || ""
        break
      case "date":
        aValue = new Date(a.createdAt || "")
        bValue = new Date(b.createdAt || "")
        break
      case "amount":
        aValue = a.totalPrice || 0
        bValue = b.totalPrice || 0
        break
      case "user":
        const userA = users.find((u) => u._id === a.userId || u._id === a.userId?._id)
        const userB = users.find((u) => u._id === b.userId || u._id === b.userId?._id)
        aValue = userA ? `${userA.firstName} ${userA.lastName}`.toLowerCase() : ""
        bValue = userB ? `${userB.firstName} ${userB.lastName}`.toLowerCase() : ""
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  // Pagination
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(sortedBookings.length / bookingsPerPage)

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="text-gray-400" />
    return sortOrder === "asc" ? <FaSortUp className="text-blue-600" /> : <FaSortDown className="text-blue-600" />
  }

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

  const getUserName = (userId) => {
    const user = users.find((u) => u._id === userId)
    return user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Utilisateur inconnu"
  }

  // Calculate statistics
  const calculateStats = () => {
    const totalAmount = filteredBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)
    const totalPaid = filteredBookings.reduce((sum, booking) => sum + (booking.totalPayments || 0), 0)
    const totalUnpaid = totalAmount - totalPaid
    const totalBookings = filteredBookings.length

    // Group by status
    const statusStats = {
      paid: filteredBookings.filter((b) => b.paymentStatus === "paid").length,
      partial: filteredBookings.filter((b) => b.paymentStatus === "partial").length,
      unpaid: filteredBookings.filter((b) => b.paymentStatus === "unpaid").length,
    }

    // Group by user
    const userStats = {}
    filteredBookings.forEach((booking) => {
      const userId = booking.userId?._id || booking.userId
      if (!userId) return

      if (!userStats[userId]) {
        userStats[userId] = {
          count: 0,
          amount: 0,
          paid: 0,
          unpaid: 0,
        }
      }

      userStats[userId].count++
      userStats[userId].amount += booking.totalPrice || 0
      userStats[userId].paid += booking.totalPayments || 0
      userStats[userId].unpaid += booking.remainingPayment || 0
    })

    return {
      totalAmount,
      totalPaid,
      totalUnpaid,
      totalBookings,
      statusStats,
      userStats,
    }
  }

  const stats = calculateStats()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <AdminSidbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Administration des Réservations</h1>
            <p className="text-gray-600">Gérez toutes les réservations de tous les utilisateurs</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
              <h3 className="text-sm text-gray-500 mb-1">Total des Réservations</h3>
              <p className="text-xl sm:text-2xl font-bold">{stats.totalBookings}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
              <h3 className="text-sm text-gray-500 mb-1">Montant Total</h3>
              <p className="text-xl sm:text-2xl font-bold">{stats.totalAmount.toFixed(2)} TND</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-emerald-500">
              <h3 className="text-sm text-gray-500 mb-1">Montant Payé</h3>
              <p className="text-xl sm:text-2xl font-bold">{stats.totalPaid.toFixed(2)} TND</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
              <h3 className="text-sm text-gray-500 mb-1">Montant Restant</h3>
              <p className="text-xl sm:text-2xl font-bold">{stats.totalUnpaid.toFixed(2)} TND</p>
            </div>
          </div>

          {/* Status Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm text-gray-500 mb-1">Réservations Payées</h3>
              <p className="text-xl font-bold text-green-600">{stats.statusStats.paid}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm text-gray-500 mb-1">Paiements Partiels</h3>
              <p className="text-xl font-bold text-yellow-600">{stats.statusStats.partial}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm text-gray-500 mb-1">Non Payées</h3>
              <p className="text-xl font-bold text-red-600">{stats.statusStats.unpaid}</p>
            </div>
          </div>

          {/* Search, Filter and Create Section - Improved Responsive Layout */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par client, CIN, téléphone, service..."
                className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 min-w-0 flex-1">
                <FaUser className="text-gray-500 flex-shrink-0" />
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="p-3 bg-transparent focus:outline-none w-full min-w-0"
                >
                  <option value="all">Tous les utilisateurs</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 min-w-0 flex-1">
                <FaServicestack className="text-gray-500 flex-shrink-0" />
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="p-3 bg-transparent focus:outline-none w-full min-w-0"
                >
                  <option value="all">Tous les services</option>
                  <option value="trips">Voyage</option>
                  <option value="ticket">Billet</option>
                  <option value="hotel">Hôtel</option>
                  <option value="omra">Omra</option>
                  <option value="transfer">Transfert</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 min-w-0 flex-1">
                <FaFilter className="text-gray-500 flex-shrink-0" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="p-3 bg-transparent focus:outline-none w-full min-w-0"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="paid">Payé</option>
                  <option value="partial">Partiel</option>
                  <option value="unpaid">Non payé</option>
                </select>
              </div>
            </div>

            {/* Sort Buttons and Create Button */}
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex flex-wrap gap-2 flex-1">
                <button
                  onClick={() => handleSort("customer")}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <span className="font-medium">Client</span>
                  {getSortIcon("customer")}
                </button>

                <button
                  onClick={() => handleSort("date")}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <span className="font-medium">Date</span>
                  {getSortIcon("date")}
                </button>

                <button
                  onClick={() => handleSort("amount")}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <span className="font-medium">Montant</span>
                  {getSortIcon("amount")}
                </button>

                <button
                  onClick={() => handleSort("user")}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <span className="font-medium">Utilisateur</span>
                  {getSortIcon("user")}
                </button>
              </div>

              <button
                onClick={handleOpenModal}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg whitespace-nowrap"
              >
                <FaPlus className="text-sm" />
                <span className="font-medium">Nouvelle Réservation</span>
              </button>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {currentBookings.length > 0 ? (
                currentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 sm:p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaServicestack className="text-white text-sm sm:text-lg" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                              {booking.customerId?.name || "Client inconnu"}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                              {getServiceTypeLabel(booking.typeOfService)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(booking.paymentStatus)}`}
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
                          <span className="text-sm truncate">{booking.customerId?.cin || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaPhone className="text-green-500 flex-shrink-0" />
                          <span className="text-sm truncate">{booking.customerId?.phoneNumber || "N/A"}</span>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="border-t border-gray-100 pt-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaUser className="text-purple-500 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs text-gray-500">Ajouté par:</span>
                            <p className="text-sm font-medium truncate">
                              {getUserName(booking.userId?._id || booking.userId)}
                            </p>
                          </div>
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
                          <span className="hidden sm:inline">Voir</span>
                        </button>
                        <button
                          onClick={() => handleOpenPaymentModal(booking._id)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                        >
                          <FaMoneyBillWave className="text-xs" />
                          <span className="hidden sm:inline">Payer</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          <FaTrash className="text-xs" />
                          <span className="hidden sm:inline">Suppr.</span>
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
                    {searchQuery || selectedUser !== "all" || selectedService !== "all" || selectedStatus !== "all"
                      ? "Essayez d'ajuster vos critères de recherche ou de filtre"
                      : "Commencez par créer votre première réservation"}
                  </p>
                  {!searchQuery && selectedUser === "all" && selectedService === "all" && selectedStatus === "all" && (
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
              <div className="flex gap-2 flex-wrap">
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

          {/* User Statistics - Improved Responsive Table */}
          {Object.keys(stats.userStats).length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Statistiques par Utilisateur</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réservations
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payé
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restant
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(stats.userStats).map(([userId, data]) => (
                      <tr key={userId} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{getUserName(userId)}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{data.count}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{data.amount.toFixed(2)} TND</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-600">{data.paid.toFixed(2)} TND</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-red-600">{data.unpaid.toFixed(2)} TND</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Nouvelle Réservation</h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  {/* User Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Utilisateur *</label>
                    <select
                      name="userId"
                      value={bookingForm.userId}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    >
                      <option value="">Sélectionner un utilisateur</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.firstName} {user.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
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

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
                      isSubmitting ||
                      !bookingForm.customerId ||
                      !bookingForm.userId ||
                      !bookingForm.typeOfService ||
                      !bookingForm.totalPrice
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
            <div className="p-4 sm:p-6">
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

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Détails de la Réservation</h2>
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

                {/* User Info */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Informations Utilisateur</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Ajouté par</p>
                      <p className="font-medium">{getUserName(viewingBooking.userId?._id || viewingBooking.userId)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date de création</p>
                      <p className="font-medium">{new Date(viewingBooking.createdAt).toLocaleDateString("fr-FR")}</p>
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

                <div className="flex flex-col sm:flex-row gap-3">
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

export default OmraAdmin
