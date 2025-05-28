"use client"

import { useState, useEffect } from "react"
import SidBar from "./SidBar"
import {
  FaSearch,
  FaTrash,
  FaEdit,
  FaPlus,
  FaPhone,
  FaIdCard,
  FaTimes,
  FaSpinner,
  FaEye,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaFileInvoice,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCheck,
  FaPrint,
  FaStickyNote,
  FaUser,
} from "react-icons/fa"
import axios from "axios"
import { showToast } from "../utlis/toastNotifications"

const KembyelManagement = () => {
  const [kembyels, setKembyels] = useState([])
  const [customers, setCustomers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [editingKembyel, setEditingKembyel] = useState(null)
  const [selectedKembyel, setSelectedKembyel] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState({})

  // Form state
  const [kembyelForm, setKembyelForm] = useState({
    customer: "",
    note: "",
    type: "physique",
    payments: [
      {
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        status: "unpaid",
      },
    ],
  })

  // Filter and pagination state
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(6)

  const getUserId = () => {
    const user = localStorage.getItem("user")
    if (!user) return null

    try {
      // Try to parse as JSON first
      const parsedUser = JSON.parse(user)
      // If it's an object, extract the id property
      if (typeof parsedUser === "object" && parsedUser !== null) {
        return parsedUser.id || parsedUser._id || parsedUser.userId || String(parsedUser)
      }
      // If it's already a string, return it
      return String(parsedUser)
    } catch (error) {
      // If parsing fails, treat it as a plain string
      return String(user)
    }
  }

  const userId = getUserId()
const useridlocalstorage=localStorage.getItem("user");
  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      console.log(userId);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`)
      console.log(`User details fetched for ID ${userId}:`, response.data)

      // Handle the response structure based on your API
      if (response.data && response.data.status === "success" && response.data.data) {
        return response.data.data
      } else if (response.data && response.data.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      }

      return null
    } catch (error) {
      console.error(`Error fetching user details for ID ${userId}:`, error)
      return null
    }
  }

  // Fetch kembyels - Using correct endpoint /kembyel/user/:userId
  const fetchKembyels = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/kembyel/user/${userId}`)
      console.log("Kembyels fetched:", response.data)
      // Handle different possible response structures
      let kembyelData = []
      if (Array.isArray(response.data)) {
        kembyelData = response.data
      } else if (response.data.kembyels && Array.isArray(response.data.kembyels)) {
        kembyelData = response.data.kembyels
      } else if (response.data.data && Array.isArray(response.data.data)) {
        kembyelData = response.data.data
      } else {
        console.log("Unexpected response structure:", response.data)
        kembyelData = []
      }
      setKembyels(kembyelData)

      // Fetch user details for all kembyels
      const userIds = [...new Set(kembyelData.map((kembyel) => kembyel.user).filter(Boolean))]
      console.log("Unique user IDs found:", userIds)

      if (userIds.length > 0) {
        try {
          const userPromises = userIds.map(async (userId) => {
            const userData = await fetchUserDetails()
            return { userId, userData }
          })

          const userResults = await Promise.all(userPromises)
          console.log("User fetch results:", userResults)

          const usersData = {}
          userResults.forEach(({ userId, userData }) => {
            if (userData) {
              usersData[userId] = userData
            }
          })

          console.log("Final users data:", usersData)
          setUsers(usersData)
        } catch (error) {
          console.error("Error fetching user details:", error)
        }
      }
    } catch (error) {
      console.error("Error fetching kembyels:", error)
      setError("Failed to fetch traites. Please try again.")
      showToast("Failed to fetch traites", "error")
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
      showToast("Failed to fetch customers", "error")
    }
  }

  useEffect(() => {
    if (userId) {
      fetchKembyels()
      fetchCustomers()
    }
  }, [userId])

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingKembyel(null)
    setKembyelForm({
      customer: "",
      note: "",
      type: "physique",
      payments: [
        {
          amount: "",
          paymentDate: new Date().toISOString().split("T")[0],
          status: "unpaid",
        },
      ],
    })
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setEditingKembyel(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setKembyelForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentChange = (index, field, value) => {
    const updatedPayments = [...kembyelForm.payments]
    updatedPayments[index][field] = value
    setKembyelForm((prev) => ({ ...prev, payments: updatedPayments }))
  }

  const addPaymentField = () => {
    setKembyelForm((prev) => ({
      ...prev,
      payments: [
        ...prev.payments,
        {
          amount: "",
          paymentDate: new Date().toISOString().split("T")[0],
          status: "unpaid",
        },
      ],
    }))
  }

  const removePaymentField = (index) => {
    if (kembyelForm.payments.length > 1) {
      const updatedPayments = kembyelForm.payments.filter((_, i) => i !== index)
      setKembyelForm((prev) => ({ ...prev, payments: updatedPayments }))
    }
  }

  const validateForm = () => {
    if (!kembyelForm.customer) {
      showToast("Please select a customer", "error")
      return false
    }
    if (kembyelForm.payments.some((payment) => !payment.amount || payment.amount <= 0)) {
      showToast("All payment amounts must be greater than 0", "error")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    const payload = {
      customer: kembyelForm.customer,
      note: kembyelForm.note,
      type: kembyelForm.type,
      user: userId,
      payments: kembyelForm.payments.map((payment) => ({
        amount: Number.parseFloat(payment.amount),
        paymentDate: payment.paymentDate,
        status: payment.status,
      })),
    }

    try {
      if (editingKembyel) {
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/kembyel/${editingKembyel._id}`, payload)
        showToast("Traite updated successfully!", "success")
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/kembyel`, payload)
        showToast("Traite created successfully!", "success")
      }

      handleCloseModal()
      fetchKembyels()
    } catch (error) {
      console.error("Error saving kembyel:", error)
      const errorMessage = error.response?.data?.message || "Failed to save traite"
      showToast(errorMessage, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (kembyel) => {
    setEditingKembyel(kembyel)
    setKembyelForm({
      customer: kembyel.customer?._id || "",
      note: kembyel.note || "",
      type: kembyel.type,
      payments: kembyel.payments.map((payment) => ({
        amount: payment.amount.toString(),
        paymentDate: payment.paymentDate.split("T")[0],
        status: payment.status,
      })),
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this traite?")) {
      return
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/kembyel/${id}`)
      showToast("Traite deleted successfully!", "success")
      fetchKembyels()
    } catch (error) {
      console.error("Error deleting kembyel:", error)
      const errorMessage = error.response?.data?.message || "Failed to delete traite"
      showToast(errorMessage, "error")
    }
  }

  const handleShowDetails = (kembyel) => {
    setSelectedKembyel(kembyel)
    setIsDetailsModalOpen(true)
  }

  const togglePaymentStatus = async (kembyelId, paymentIndex) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/kembyel/kembyel/${kembyelId}/payment/${paymentIndex}`, {
        status: "paid",
      })

      // Update local state
      setKembyels((prevKembyels) =>
        prevKembyels.map((kembyel) =>
          kembyel._id === kembyelId
            ? {
                ...kembyel,
                payments: kembyel.payments.map((payment, index) =>
                  index === paymentIndex ? { ...payment, status: "paid" } : payment,
                ),
              }
            : kembyel,
        ),
      )

      // Update selected kembyel if details modal is open
      if (selectedKembyel && selectedKembyel._id === kembyelId) {
        setSelectedKembyel((prev) => ({
          ...prev,
          payments: prev.payments.map((payment, index) =>
            index === paymentIndex ? { ...payment, status: "paid" } : payment,
          ),
        }))
      }

      showToast("Payment status updated successfully!", "success")
    } catch (error) {
      console.error("Error toggling payment status:", error)
      showToast("Failed to update payment status", "error")
    }
  }

  // Filter and sort kembyels
  const filteredKembyels = Array.isArray(kembyels)
    ? kembyels.filter(
        (kembyel) =>
          kembyel.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kembyel.customer?.cin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kembyel.customer?.phoneNumber?.includes(searchQuery) ||
          kembyel.note?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const sortedKembyels = Array.isArray(filteredKembyels)
    ? [...filteredKembyels].sort((a, b) => {
        let aValue, bValue

        switch (sortBy) {
          case "name":
            aValue = a.customer?.name?.toLowerCase() || ""
            bValue = b.customer?.name?.toLowerCase() || ""
            break
          case "date":
            aValue = new Date(a.payments?.[0]?.paymentDate || "")
            bValue = new Date(b.payments?.[0]?.paymentDate || "")
            break
          case "amount":
            aValue = a.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0
            bValue = b.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0
            break
          default:
            return 0
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
        return 0
      })
    : []

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = sortedKembyels.slice(indexOfFirstRecord, indexOfLastRecord)
  const totalPages = Math.ceil(sortedKembyels.length / recordsPerPage)

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

  const getStatusColor = (status) => {
    return status === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getTypeLabel = (type) => {
    return type === "physique" ? "Physique" : "Banque"
  }

  const getTotalAmount = (payments) => {
    return payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0
  }

  const getPaidAmount = (payments) => {
    return (
      payments?.filter((payment) => payment.status === "paid").reduce((sum, payment) => sum + payment.amount, 0) || 0
    )
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gestion des Traites</h1>
            <p className="text-gray-600">Gérez vos traites et paiements efficacement</p>
          </div>

          {/* Search, Sort and Create Section */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, CIN, téléphone ou note..."
                className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleSort("name")}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium">Nom</span>
                {getSortIcon("name")}
              </button>

              <button
                onClick={() => handleSort("date")}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium">Date</span>
                {getSortIcon("date")}
              </button>

              <button
                onClick={() => handleSort("amount")}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium">Montant</span>
                {getSortIcon("amount")}
              </button>
            </div>

            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
            >
              <FaPlus className="text-sm" />
              <span className="font-medium">Nouvelle Traite</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-3xl text-blue-600" />
              <span className="ml-3 text-gray-600">Chargement des traites...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button onClick={fetchKembyels} className="mt-2 text-red-700 hover:text-red-800 font-medium">
                Réessayer
              </button>
            </div>
          )}

          {/* Kembyels Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentRecords.length > 0 ? (
                currentRecords.map((kembyel) => (
                  <div
                    key={kembyel._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <FaFileInvoice className="text-white text-lg" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{kembyel.customer?.name || "N/A"}</h3>
                            <p className="text-sm text-gray-500">{getTypeLabel(kembyel.type)}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {kembyel.payments?.length || 0} paiement(s)
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaIdCard className="text-blue-500 flex-shrink-0" />
                          <span className="text-sm">{kembyel.customer?.cin || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaPhone className="text-green-500 flex-shrink-0" />
                          <span className="text-sm">{kembyel.customer?.phoneNumber || "N/A"}</span>
                        </div>
                        {kembyel.note && (
                          <div className="flex items-start gap-2 text-gray-600">
                            <FaStickyNote className="text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span className="text-xs line-clamp-2">{kembyel.note}</span>
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      {/* <div className="border-t border-gray-100 pt-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaUser className="text-purple-500 flex-shrink-0" />
                          <div>
                            <span className="text-xs text-gray-500">Ajouté par:</span>
                            <p className="text-sm font-medium">
                              {kembyel.user && users[kembyel.user]
                                ? `${users[kembyel.user].firstName || ""} ${users[kembyel.user].lastName || ""}`.trim() ||
                                  "Utilisateur inconnu"
                                : "Utilisateur inconnu"}
                            </p>
                          </div>
                        </div>
                      </div> */}

                      {/* Payment Summary */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Total:</span>
                          <span className="font-semibold text-gray-900">{getTotalAmount(kembyel.payments)} TND</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Payé:</span>
                          <span className="font-semibold text-green-600">{getPaidAmount(kembyel.payments)} TND</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Restant:</span>
                          <span className="font-semibold text-red-600">
                            {getTotalAmount(kembyel.payments) - getPaidAmount(kembyel.payments)} TND
                          </span>
                        </div>
                      </div>

                      {/* Payment Status Indicators */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {kembyel.payments?.map((payment, index) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                              payment.status === "paid" ? "bg-green-500" : "bg-red-500"
                            }`}
                            title={`Payment ${index + 1}: ${payment.amount} TND - ${payment.status}`}
                          />
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleShowDetails(kembyel)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          <FaEye className="text-xs" />
                          Voir
                        </button>
                        <button
                          onClick={() => handleEdit(kembyel)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          <FaEdit className="text-xs" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(kembyel._id)}
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
                  <FaFileInvoice className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune traite trouvée</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery
                      ? "Essayez d'ajuster vos critères de recherche"
                      : "Commencez par créer votre première traite"}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={handleOpenModal}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaPlus />
                      Créer une Traite
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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingKembyel ? "Modifier la Traite" : "Nouvelle Traite"}
                </h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {/* Customer Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                  <select
                    name="customer"
                    value={kembyelForm.customer}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionner un client</option>
                    {customers.map((customer) => (
                      <option key={customer._id} value={customer._id}>
                        {customer.name} - {customer.cin} - {customer.phoneNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      name="type"
                      value={kembyelForm.type}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    >
                      <option value="physique">Physique</option>
                      <option value="bank">Banque</option>
                    </select>
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                    <div className="relative">
                      <FaStickyNote className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        name="note"
                        value={kembyelForm.note}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Note optionnelle..."
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Payments Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Paiements</h3>
                    <button
                      type="button"
                      onClick={addPaymentField}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      disabled={isSubmitting}
                    >
                      <FaPlus className="text-sm" />
                      Ajouter un Paiement
                    </button>
                  </div>

                  <div className="space-y-4">
                    {kembyelForm.payments.map((payment, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-md font-medium text-gray-800">Paiement {index + 1}</h4>
                          {kembyelForm.payments.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePaymentField(index)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                              disabled={isSubmitting}
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Montant (TND) *</label>
                            <div className="relative">
                              <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type="number"
                                value={payment.amount}
                                onChange={(e) => handlePaymentChange(index, "amount", e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                                disabled={isSubmitting}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date de Paiement *</label>
                            <div className="relative">
                              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type="date"
                                value={payment.paymentDate}
                                onChange={(e) => handlePaymentChange(index, "paymentDate", e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isSubmitting}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                            <select
                              value={payment.status}
                              onChange={(e) => handlePaymentChange(index, "status", e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              disabled={isSubmitting}
                            >
                              <option value="unpaid">Non Payé</option>
                              <option value="paid">Payé</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
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
                    disabled={isSubmitting || !kembyelForm.customer}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {editingKembyel ? "Mise à jour..." : "Création..."}
                      </>
                    ) : editingKembyel ? (
                      "Mettre à Jour"
                    ) : (
                      "Créer la Traite"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedKembyel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Détails de la Traite</h2>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Informations Générales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Client</p>
                      <p className="font-medium">{selectedKembyel.customer?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium">{getTypeLabel(selectedKembyel.type)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CIN</p>
                      <p className="font-medium">{selectedKembyel.customer?.cin || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Téléphone</p>
                      <p className="font-medium">{selectedKembyel.customer?.phoneNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ajouté par</p>
                      <p className="font-medium">
                        {selectedKembyel.user && users[selectedKembyel.user]
                          ? `${users[selectedKembyel.user].firstName || ""} ${users[selectedKembyel.user].lastName || ""}`.trim() ||
                            "Utilisateur inconnu"
                          : "Utilisateur inconnu"}
                      </p>
                    </div>
                    {selectedKembyel.note && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Note</p>
                        <p className="font-medium">{selectedKembyel.note}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Résumé des Paiements</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-xl font-bold text-gray-900">{getTotalAmount(selectedKembyel.payments)} TND</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Payé</p>
                      <p className="text-xl font-bold text-green-600">{getPaidAmount(selectedKembyel.payments)} TND</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Restant</p>
                      <p className="text-xl font-bold text-red-600">
                        {getTotalAmount(selectedKembyel.payments) - getPaidAmount(selectedKembyel.payments)} TND
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payments List */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Liste des Paiements ({selectedKembyel.payments?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {selectedKembyel.payments?.map((payment, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-lg">{payment.amount} TND</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                              >
                                {payment.status === "paid" ? "Payé" : "Non Payé"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Date: {new Date(payment.paymentDate).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          {payment.status === "unpaid" && (
                            <button
                              onClick={() => togglePaymentStatus(selectedKembyel._id, index)}
                              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              <FaCheck className="text-xs" />
                              Marquer Payé
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsDetailsModalOpen(false)
                      handleEdit(selectedKembyel)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <FaEdit />
                    Modifier
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
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

export default KembyelManagement
