"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import moment from "moment"
import SidBar from "./SidBar"
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaSpinner,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
} from "react-icons/fa"
import { showToast } from "../utlis/toastNotifications"

export default function EmployerDepence() {
  const [dependences, setDependences] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState("month")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalAmount: "",
    status: "espece", // Default status
  })

  const userId = localStorage.getItem("user")

  const fetchDependences = async () => {
    if (!userId) {
      showToast("User not authenticated. Please log in.", "error")
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/depence/user/${userId}`)
      console.log("Dependences fetched:", response.data)

      let dependenceData = []
      if (Array.isArray(response.data)) {
        dependenceData = response.data
      } else if (response.data.dependences && Array.isArray(response.data.dependences)) {
        dependenceData = response.data.dependences
      } else if (response.data.data && Array.isArray(response.data.data)) {
        dependenceData = response.data.data
      } else {
        console.log("Unexpected response structure:", response.data)
        dependenceData = []
      }

      setDependences(dependenceData)
    } catch (error) {
      console.error("Error fetching dependences:", error)
      setError("Failed to fetch expenses. Please try again.")
      showToast("Failed to fetch expenses", "error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDependences()
  }, [userId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalAmount" ? (value === "" ? "" : Number(value)) : value,
    }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      totalAmount: "",
      status: "espece",
    })
    setIsEditing(false)
    setEditingId(null)
  }

  const handleOpenCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const handleOpenEditModal = (dependence) => {
    setFormData({
      title: dependence.title,
      description: dependence.description,
      totalAmount: dependence.totalAmount,
      status: dependence.status || "espece", // Fallback for undefined status
    })
    setIsEditing(true)
    setEditingId(dependence._id)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    resetForm()
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      showToast("Title is required", "error")
      return
    }
    if (!formData.description.trim()) {
      showToast("Description is required", "error")
      return
    }
    if (!formData.totalAmount || formData.totalAmount <= 0) {
      showToast("Amount must be greater than 0", "error")
      return
    }
    if (!formData.status) {
      showToast("Status is required", "error")
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditing) {
        const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/depence/${editingId}`, {
          ...formData,
          user: userId,
        })
        setDependences((prev) => prev.map((dep) => (dep._id === editingId ? response.data : dep)))
        showToast("Expense updated successfully!", "success")
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/depence/${userId}`, formData)
        setDependences((prev) => [...prev, response.data])
        showToast("Expense added successfully!", "success")
      }

      handleCloseModal()
    } catch (error) {
      console.error("Error saving dependence:", error)
      const errorMessage = error.response?.data?.message || "Failed to save expense"
      showToast(errorMessage, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/depence/${id}`)
      setDependences((prev) => prev.filter((dep) => dep._id !== id))
      showToast("Expense deleted successfully!", "success")
    } catch (error) {
      console.error("Error deleting dependence:", error)
      const errorMessage = error.response?.data?.message || "Failed to delete expense"
      showToast(errorMessage, "error")
    }
  }

  const startOfWeek = moment().startOf("week")
  const endOfWeek = moment().endOf("week")
  const startOfMonth = moment().startOf("month")
  const endOfMonth = moment().endOf("month")

  const filteredDependences = dependences
    .filter((dep) => {
      if (searchQuery) {
        return (
          dep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (dep.status || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      return true
    })
    .filter((dep) => {
      if (filter === "week") {
        return moment(dep.createdAt).isBetween(startOfWeek, endOfWeek, null, "[]")
      } else if (filter === "month") {
        return moment(dep.createdAt).isBetween(startOfMonth, endOfMonth, null, "[]")
      }
      return true
    })

  const totalFilteredAmount = filteredDependences.reduce((sum, dep) => sum + (dep.totalAmount || 0), 0)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <SidBar />
      </div>

      <div className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gestion des Dépenses</h1>
            <p className="text-gray-600">Gérez vos dépenses efficacement</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre, description ou statut..."
                className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3">
              <FaFilter className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-3 bg-transparent focus:outline-none"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois-ci</option>
                <option value="all">Tous</option>
              </select>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
            >
              <FaPlus className="text-sm" />
              <span className="font-medium">Nouvelle Dépense</span>
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium opacity-90">Total des Dépenses</h2>
                <p className="text-3xl font-bold mt-2">{totalFilteredAmount.toFixed(2)} TND</p>
                <p className="text-sm mt-2 opacity-80">
                  {filter === "week"
                    ? `${startOfWeek.format("DD/MM")} - ${endOfWeek.format("DD/MM/YYYY")}`
                    : filter === "month"
                      ? `${startOfMonth.format("MMMM YYYY")}`
                      : "Toutes les périodes"}
                </p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <FaMoneyBillWave className="text-3xl text-white" />
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-3xl text-blue-600" />
              <span className="ml-3 text-gray-600">Chargement des dépenses...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button onClick={fetchDependences} className="mt-2 text-red-700 hover:text-red-800 font-medium">
                Réessayer
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {filteredDependences.length > 0 ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Titre
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Montant
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Statut
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDependences.map((dep) => {
                          const status = dep.status || "Inconnu" // Fallback for undefined status
                          return (
                            <tr key={dep._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{dep.title}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-500 line-clamp-2">{dep.description}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-green-600">
                                  {(dep.totalAmount || 0).toFixed(2)} TND
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    status === 'cheque' ? 'bg-blue-100 text-blue-800' :
                                    status === 'virement' ? 'bg-green-100 text-green-800' :
                                    status === 'espece' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <FaCalendarAlt className="text-blue-500" />
                                    {moment(dep.createdAt).format("DD/MM/YYYY")}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEditModal(dep)}
                                    className="text-blue-600 hover:text-blue-900 bg-blue-100 p-2 rounded-full"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(dep._id)}
                                    className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-full"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                  <FaMoneyBillWave className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune dépense trouvée</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || filter !== "all"
                      ? "Essayez d'ajuster vos critères de recherche ou de filtre"
                      : "Commencez par ajouter votre première dépense"}
                  </p>
                  {!searchQuery && filter === "all" && (
                    <button
                      onClick={handleOpenCreateModal}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaPlus />
                      Ajouter une Dépense
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? "Modifier la Dépense" : "Nouvelle Dépense"}
                </h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Titre de la dépense"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Description détaillée"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant (TND) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      disabled={isSubmitting}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">TND</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionner un statut</option>
                    <option value="cheque">Chèque</option>
                    <option value="virement">Virement</option>
                    <option value="espece">Espèce</option>
                  </select>
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
                    disabled={isSubmitting || !formData.title || !formData.description || !formData.totalAmount || !formData.status}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {isEditing ? "Mise à jour..." : "Création..."}
                      </>
                    ) : isEditing ? (
                      "Mettre à Jour"
                    ) : (
                      "Créer la Dépense"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}