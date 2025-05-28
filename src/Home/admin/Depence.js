import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import AdminSidbar from "./AdminSidbar";
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
  FaUser,
  FaUsers
} from "react-icons/fa";

export default function Depence() {
  const [dependences, setDependences] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState("all"); // "all" or user ID

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalAmount: "",
    user: localStorage.getItem("user")
  });

  // Fetch users for dropdown
  const fetchUsers = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_BASE_URL + "/users/");
      const usersData = response.data.data?.data || response.data.data || [];
      setUsers(usersData);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    }
  };

  // Fetch all dependences
  const fetchDependences = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(process.env.REACT_APP_API_BASE_URL + "/depence/");
      
      // Handle different possible response structures
      let dependenceData = [];
      if (Array.isArray(response.data)) {
        dependenceData = response.data;
      } else if (response.data.dependences && Array.isArray(response.data.dependences)) {
        dependenceData = response.data.dependences;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        dependenceData = response.data.data;
      } else {
        console.log("Structure de réponse inattendue:", response.data);
        dependenceData = [];
      }
      
      setDependences(dependenceData);
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      setError("Échec de la récupération des dépenses. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDependences();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalAmount" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      totalAmount: "",
      user: localStorage.getItem("user")
    });
    setIsEditing(false);
    setEditingId(null);
  };

  // Open modal for creating new dependence
  const handleOpenCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Open modal for editing dependence
  const handleOpenEditModal = (dependence) => {
    setFormData({
      title: dependence.title,
      description: dependence.description,
      totalAmount: dependence.totalAmount,
      user: dependence.user?._id || dependence.user
    });
    setIsEditing(true);
    setEditingId(dependence._id);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Create or update dependence
  const handleSubmit = async () => {
    // Validate form
    if (!formData.title.trim()) {
      alert("Le titre est requis");
      return;
    }
    if (!formData.description.trim()) {
      alert("La description est requise");
      return;
    }
    if (!formData.totalAmount || formData.totalAmount <= 0) {
      alert("Le montant doit être supérieur à 0");
      return;
    }
    if (!formData.user) {
      alert("Veuillez sélectionner un utilisateur");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        // Update existing dependence
        const response = await axios.put(
          process.env.REACT_APP_API_BASE_URL + `/depence/${editingId}`, 
          formData
        );
        setDependences((prev) => prev.map((dep) => (dep._id === editingId ? response.data : dep)));
        alert("Dépense mise à jour avec succès!");
      } else {
        // Create new dependence
        const response = await axios.post(
          process.env.REACT_APP_API_BASE_URL + `/depence/${formData.user}`, 
          formData
        );
        setDependences((prev) => [...prev, response.data]);
        alert("Dépense ajoutée avec succès!");
      }

      handleCloseModal();
      fetchDependences(); // Refresh the list
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la dépense:", error);
      const errorMessage = error.response?.data?.message || "Échec de l'enregistrement de la dépense";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a dependence
  const handleDeleteDependence = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette dépense?")) {
      return;
    }

    try {
      await axios.delete(process.env.REACT_APP_API_BASE_URL + `/depence/${id}`);
      setDependences((prev) => prev.filter((dep) => dep._id !== id));
      alert("Dépense supprimée avec succès!");
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
      const errorMessage = error.response?.data?.message || "Échec de la suppression de la dépense";
      alert(errorMessage);
    }
  };

  // Define time periods for filtering
  const startOfWeek = moment().startOf("week");
  const endOfWeek = moment().endOf("week");
  const startOfMonth = moment().startOf("month");
  const endOfMonth = moment().endOf("month");

  // Filter dependences based on search query, user and time period
  const filteredDependences = dependences
    .filter((dep) => {
      // User filter
      if (selectedUser !== "all") {
        return dep.user?._id === selectedUser || dep.user === selectedUser;
      }
      return true;
    })
    .filter((dep) => {
      // Search filter
      if (searchQuery) {
        return (
          dep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dep.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    })
    .filter((dep) => {
      // Time period filter
      if (filter === "week") {
        return moment(dep.createdAt).isBetween(startOfWeek, endOfWeek, null, "[]");
      } else if (filter === "month") {
        return moment(dep.createdAt).isBetween(startOfMonth, endOfMonth, null, "[]");
      }
      return true; // "all" filter
    });

  // Calculate total amount for the filtered period
  const totalFilteredAmount = filteredDependences.reduce((sum, dep) => sum + (dep.totalAmount || 0), 0);

  // Group expenses by user
  const expensesByUser = filteredDependences.reduce((acc, dep) => {
    const userId = dep.user?._id || dep.user;
    if (!acc[userId]) {
      acc[userId] = {
        total: 0,
        count: 0,
        user: users.find(u => u._id === userId) || { city: "Inconnu" }
      };
    }
    acc[userId].total += (dep.totalAmount || 0);
    acc[userId].count += 1;
    return acc;
  }, {});

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gestion des Dépenses</h1>
            <p className="text-gray-600">Gérez les dépenses de tous les utilisateurs</p>
          </div>

          {/* Search, Filter and Create Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre ou description..."
                className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3">
              <FaUser className="text-gray-500" />
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="p-3 bg-transparent focus:outline-none"
              >
                <option value="all">Tous les utilisateurs</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} ({user.city})
                  </option>
                ))}
              </select>
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
                <option value="all">Toutes les périodes</option>
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

          {/* Total Amount Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Total Amount Card */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
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

            {/* User Count Card */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium opacity-90">Utilisateurs avec Dépenses</h2>
                  <p className="text-3xl font-bold mt-2">{Object.keys(expensesByUser).length}</p>
                  <p className="text-sm mt-2 opacity-80">
                    {selectedUser === "all" ? "Tous les utilisateurs" : "Utilisateur sélectionné"}
                  </p>
                </div>
                <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <FaUsers className="text-3xl text-white" />
                </div>
              </div>
            </div>

            {/* Average Expense Card */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium opacity-90">Moyenne par Dépense</h2>
                  <p className="text-3xl font-bold mt-2">
                    {filteredDependences.length > 0 
                      ? (totalFilteredAmount / filteredDependences.length).toFixed(2) 
                      : "0.00"} TND
                  </p>
                  <p className="text-sm mt-2 opacity-80">
                    Basé sur {filteredDependences.length} dépense(s)
                  </p>
                </div>
                <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <FaCalendarAlt className="text-3xl text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-3xl text-blue-600" />
              <span className="ml-3 text-gray-600">Chargement des dépenses...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button onClick={fetchDependences} className="mt-2 text-red-700 hover:text-red-800 font-medium">
                Réessayer
              </button>
            </div>
          )}

          {/* Dependences Table */}
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
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Utilisateur
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
                          const userId = dep.user?._id || dep.user;
                          const user = users.find(u => u._id === userId);
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
                                  <div className="flex items-center gap-1">
                                    <FaCalendarAlt className="text-blue-500" />
                                    {moment(dep.createdAt).format("DD/MM/YYYY")}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {user ? (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                      {user.firstName} {user.lastName} ({user.city})
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                      Utilisateur inconnu
                                    </span>
                                  )}
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
                                    onClick={() => handleDeleteDependence(dep._id)}
                                    className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-full"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
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
                    {searchQuery || filter !== "all" || selectedUser !== "all"
                      ? "Essayez d'ajuster vos critères de recherche ou de filtre"
                      : "Commencez par ajouter votre première dépense"}
                  </p>
                  {!searchQuery && filter === "all" && selectedUser === "all" && (
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

          {/* User Expenses Summary */}
          {selectedUser === "all" && Object.keys(expensesByUser).length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Résumé des Dépenses par Utilisateur</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ville
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre de Dépenses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % du Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(expensesByUser).map(([userId, data]) => {
                      const user = users.find(u => u._id === userId);
                      const percentage = (data.total / totalFilteredAmount * 100).toFixed(1);
                      
                      return (
                        <tr key={userId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user ? `${user.firstName} ${user.lastName}` : "Utilisateur inconnu"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user?.city || "Inconnue"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{data.count}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-green-600">
                              {data.total.toFixed(2)} TND
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{percentage}%</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Utilisateur *</label>
                  <select
                    name="user"
                    value={formData.user || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionner un utilisateur</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.city})
                      </option>
                    ))}
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
                    disabled={isSubmitting || !formData.title || !formData.description || !formData.totalAmount || !formData.user}
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
  );
}