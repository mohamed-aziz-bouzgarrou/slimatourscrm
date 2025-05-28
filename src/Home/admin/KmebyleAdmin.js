import React, { useState, useEffect } from "react";
import AdminSidbar from "./AdminSidbar";
import axios from "axios";
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
  FaFilter,
  FaBuilding
} from "react-icons/fa";

const KmebyleAdmin = () => {
  const [traites, setTraites] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingTraite, setEditingTraite] = useState(null);
  const [selectedTraite, setSelectedTraite] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [traiteForm, setTraiteForm] = useState({
    customer: "",
    note: "",
    type: "physique",
    user: "",
    payments: [
      {
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        status: "unpaid",
      },
    ],
  });

  // Filter and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(9);
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Fetch all traites
  const fetchTraites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/kembyel`);
      console.log("Traites fetched:", response.data);
      
      // Handle different possible response structures
      let traitesData = [];
      if (Array.isArray(response.data)) {
        traitesData = response.data;
      } else if (response.data.kembyels && Array.isArray(response.data.kembyels)) {
        traitesData = response.data.kembyels;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        traitesData = response.data.data;
      } else {
        console.log("Unexpected response structure:", response.data);
        traitesData = [];
      }
      
      setTraites(traitesData);
    } catch (error) {
      console.error("Error fetching traites:", error);
      setError("Échec de la récupération des traites. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/customer`);
      console.log("Customers fetched:", response.data);
      setCustomers(response.data.customers || response.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users`);
      console.log("Users fetched:", response.data);
      const usersData = response.data.data?.data || response.data.data || response.data || [];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchTraites();
    fetchCustomers();
    fetchUsers();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTraite(null);
    setTraiteForm({
      customer: "",
      note: "",
      type: "physique",
      user: "",
      payments: [
        {
          amount: "",
          paymentDate: new Date().toISOString().split("T")[0],
          status: "unpaid",
        },
      ],
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditingTraite(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTraiteForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (index, field, value) => {
    const updatedPayments = [...traiteForm.payments];
    updatedPayments[index][field] = value;
    setTraiteForm((prev) => ({ ...prev, payments: updatedPayments }));
  };

  const addPaymentField = () => {
    setTraiteForm((prev) => ({
      ...prev,
      payments: [
        ...prev.payments,
        {
          amount: "",
          paymentDate: new Date().toISOString().split("T")[0],
          status: "unpaid",
        },
      ],
    }));
  };

  const removePaymentField = (index) => {
    if (traiteForm.payments.length > 1) {
      const updatedPayments = traiteForm.payments.filter((_, i) => i !== index);
      setTraiteForm((prev) => ({ ...prev, payments: updatedPayments }));
    }
  };

  const validateForm = () => {
    if (!traiteForm.customer) {
      alert("Veuillez sélectionner un client");
      return false;
    }
    if (!traiteForm.user) {
      alert("Veuillez sélectionner un utilisateur");
      return false;
    }
    if (traiteForm.payments.some((payment) => !payment.amount || payment.amount <= 0)) {
      alert("Tous les montants de paiement doivent être supérieurs à 0");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      customer: traiteForm.customer,
      note: traiteForm.note,
      type: traiteForm.type,
      user: traiteForm.user,
      payments: traiteForm.payments.map((payment) => ({
        amount: Number.parseFloat(payment.amount),
        paymentDate: payment.paymentDate,
        status: payment.status,
      })),
    };

    try {
      if (editingTraite) {
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/kembyel/${editingTraite._id}`, payload);
        alert("Traite mise à jour avec succès!");
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/kembyel`, payload);
        alert("Traite créée avec succès!");
      }

      handleCloseModal();
      fetchTraites();
    } catch (error) {
      console.error("Error saving traite:", error);
      const errorMessage = error.response?.data?.message || "Échec de l'enregistrement de la traite";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (traite) => {
    setEditingTraite(traite);
    setTraiteForm({
      customer: traite.customer?._id || "",
      note: traite.note || "",
      type: traite.type,
      user: traite.user?._id || traite.user || "",
      payments: traite.payments.map((payment) => ({
        amount: payment.amount.toString(),
        paymentDate: payment.paymentDate.split("T")[0],
        status: payment.status,
      })),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette traite?")) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/kembyel/${id}`);
      alert("Traite supprimée avec succès!");
      fetchTraites();
    } catch (error) {
      console.error("Error deleting traite:", error);
      const errorMessage = error.response?.data?.message || "Échec de la suppression de la traite";
      alert(errorMessage);
    }
  };

  const handleShowDetails = (traite) => {
    setSelectedTraite(traite);
    setIsDetailsModalOpen(true);
  };

  const togglePaymentStatus = async (traiteId, paymentIndex) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/kembyel/${traiteId}/payment/${paymentIndex}`,
        { status: "paid" }
      );

      // Update local state
      setTraites((prevTraites) =>
        prevTraites.map((traite) =>
          traite._id === traiteId
            ? {
                ...traite,
                payments: traite.payments.map((payment, index) =>
                  index === paymentIndex ? { ...payment, status: "paid" } : payment
                ),
              }
            : traite
        )
      );

      // Update selected traite if details modal is open
      if (selectedTraite && selectedTraite._id === traiteId) {
        setSelectedTraite((prev) => ({
          ...prev,
          payments: prev.payments.map((payment, index) =>
            index === paymentIndex ? { ...payment, status: "paid" } : payment
          ),
        }));
      }

      alert("Statut de paiement mis à jour avec succès!");
    } catch (error) {
      console.error("Error toggling payment status:", error);
      alert("Échec de la mise à jour du statut de paiement");
    }
  };

  // Filter traites
  const filteredTraites = traites.filter((traite) => {
    // Filter by user
    if (selectedUser !== "all" && traite.user !== selectedUser && traite.user?._id !== selectedUser) {
      return false;
    }
    
    // Filter by type
    if (selectedType !== "all" && traite.type !== selectedType) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const customerName = traite.customer?.name?.toLowerCase() || "";
      const customerCin = traite.customer?.cin?.toLowerCase() || "";
      const customerPhone = traite.customer?.phoneNumber || "";
      const note = traite.note?.toLowerCase() || "";
      
      return (
        customerName.includes(searchQuery.toLowerCase()) ||
        customerCin.includes(searchQuery.toLowerCase()) ||
        customerPhone.includes(searchQuery) ||
        note.includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });

  // Sort traites
  const sortedTraites = [...filteredTraites].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "name":
        aValue = a.customer?.name?.toLowerCase() || "";
        bValue = b.customer?.name?.toLowerCase() || "";
        break;
      case "date":
        aValue = new Date(a.payments?.[0]?.paymentDate || "");
        bValue = new Date(b.payments?.[0]?.paymentDate || "");
        break;
      case "amount":
        aValue = a.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
        bValue = b.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
        break;
      case "user":
        const userA = users.find(u => u._id === a.user || u._id === a.user?._id);
        const userB = users.find(u => u._id === b.user || u._id === b.user?._id);
        aValue = userA ? `${userA.firstName} ${userA.lastName}`.toLowerCase() : "";
        bValue = userB ? `${userB.firstName} ${userB.lastName}`.toLowerCase() : "";
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedTraites.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(sortedTraites.length / recordsPerPage);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="text-gray-400" />;
    return sortOrder === "asc" ? <FaSortUp className="text-blue-600" /> : <FaSortDown className="text-blue-600" />;
  };

  const getStatusColor = (status) => {
    return status === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getTypeLabel = (type) => {
    return type === "physique" ? "Physique" : "Banque";
  };

  const getTotalAmount = (payments) => {
    return payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  };

  const getPaidAmount = (payments) => {
    return payments?.filter((payment) => payment.status === "paid").reduce((sum, payment) => sum + payment.amount, 0) || 0;
  };

  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Utilisateur inconnu";
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalAmount = filteredTraites.reduce((sum, traite) => sum + getTotalAmount(traite.payments), 0);
    const totalPaid = filteredTraites.reduce((sum, traite) => sum + getPaidAmount(traite.payments), 0);
    const totalUnpaid = totalAmount - totalPaid;
    const totalTraites = filteredTraites.length;
    const totalPayments = filteredTraites.reduce((sum, traite) => sum + (traite.payments?.length || 0), 0);
    
    // Group by user
    const userStats = {};
    filteredTraites.forEach(traite => {
      const userId = traite.user?._id || traite.user;
      if (!userId) return;
      
      if (!userStats[userId]) {
        userStats[userId] = {
          count: 0,
          amount: 0,
          paid: 0,
          unpaid: 0
        };
      }
      
      userStats[userId].count++;
      userStats[userId].amount += getTotalAmount(traite.payments);
      userStats[userId].paid += getPaidAmount(traite.payments);
      userStats[userId].unpaid += getTotalAmount(traite.payments) - getPaidAmount(traite.payments);
    });
    
    return {
      totalAmount,
      totalPaid,
      totalUnpaid,
      totalTraites,
      totalPayments,
      userStats
    };
  };
  
  const stats = calculateStats();

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Administration des Traites</h1>
            <p className="text-gray-600">Gérez toutes les traites de tous les utilisateurs</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
              <h3 className="text-sm text-gray-500 mb-1">Total des Traites</h3>
              <p className="text-2xl font-bold">{stats.totalTraites}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
              <h3 className="text-sm text-gray-500 mb-1">Montant Total</h3>
              <p className="text-2xl font-bold">{stats.totalAmount.toFixed(2)} TND</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-emerald-500">
              <h3 className="text-sm text-gray-500 mb-1">Montant Payé</h3>
              <p className="text-2xl font-bold">{stats.totalPaid.toFixed(2)} TND</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
              <h3 className="text-sm text-gray-500 mb-1">Montant Impayé</h3>
              <p className="text-2xl font-bold">{stats.totalUnpaid.toFixed(2)} TND</p>
            </div>
          </div>

          {/* Search, Filter and Create Section */}
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
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3">
              <FaBuilding className="text-gray-500" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="p-3 bg-transparent focus:outline-none"
              >
                <option value="all">Tous les types</option>
                <option value="physique">Physique</option>
                <option value="bank">Banque</option>
              </select>
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

              <button
                onClick={() => handleSort("user")}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium">Utilisateur</span>
                {getSortIcon("user")}
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
              <button onClick={fetchTraites} className="mt-2 text-red-700 hover:text-red-800 font-medium">
                Réessayer
              </button>
            </div>
          )}

          {/* Traites Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentRecords.length > 0 ? (
                currentRecords.map((traite) => (
                  <div
                    key={traite._id}
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
                            <h3 className="text-lg font-semibold text-gray-900">{traite.customer?.name || "N/A"}</h3>
                            <p className="text-sm text-gray-500">{getTypeLabel(traite.type)}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {traite.payments?.length || 0} paiement(s)
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaIdCard className="text-blue-500 flex-shrink-0" />
                          <span className="text-sm">{traite.customer?.cin || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaPhone className="text-green-500 flex-shrink-0" />
                          <span className="text-sm">{traite.customer?.phoneNumber || "N/A"}</span>
                        </div>
                        {traite.note && (
                          <div className="flex items-start gap-2 text-gray-600">
                            <FaStickyNote className="text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span className="text-xs line-clamp-2">{traite.note}</span>
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="border-t border-gray-100 pt-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaUser className="text-purple-500 flex-shrink-0" />
                          <div>
                            <span className="text-xs text-gray-500">Ajouté par:</span>
                            <p className="text-sm font-medium">
                              {getUserName(traite.user?._id || traite.user)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Total:</span>
                          <span className="font-semibold text-gray-900">{getTotalAmount(traite.payments)} TND</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Payé:</span>
                          <span className="font-semibold text-green-600">{getPaidAmount(traite.payments)} TND</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Restant:</span>
                          <span className="font-semibold text-red-600">
                            {getTotalAmount(traite.payments) - getPaidAmount(traite.payments)} TND
                          </span>
                        </div>
                      </div>

                      {/* Payment Status Indicators */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {traite.payments?.map((payment, index) => (
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
                          onClick={() => handleShowDetails(traite)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          <FaEye className="text-xs" />
                          Voir
                        </button>
                        <button
                          onClick={() => handleEdit(traite)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          <FaEdit className="text-xs" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(traite._id)}
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
                    {searchQuery || selectedUser !== "all" || selectedType !== "all"
                      ? "Essayez d'ajuster vos critères de recherche ou de filtre"
                      : "Commencez par créer votre première traite"}
                  </p>
                  {!searchQuery && selectedUser === "all" && selectedType === "all" && (
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

          {/* User Statistics */}
          {Object.keys(stats.userStats).length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Statistiques par Utilisateur</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre de Traites
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant Payé
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant Impayé
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(stats.userStats).map(([userId, data]) => (
                      <tr key={userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {getUserName(userId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{data.count}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {data.amount.toFixed(2)} TND
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-600">
                            {data.paid.toFixed(2)} TND
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-red-600">
                            {data.unpaid.toFixed(2)} TND
                          </div>
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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingTraite ? "Modifier la Traite" : "Nouvelle Traite"}
                </h2>
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
                      name="customer"
                      value={traiteForm.customer}
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

                  {/* User Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Utilisateur *</label>
                    <select
                      name="user"
                      value={traiteForm.user}
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
                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      name="type"
                      value={traiteForm.type}
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
                        value={traiteForm.note}
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
                    {traiteForm.payments.map((payment, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-md font-medium text-gray-800">Paiement {index + 1}</h4>
                          {traiteForm.payments.length > 1 && (
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
                    disabled={isSubmitting || !traiteForm.customer || !traiteForm.user}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {editingTraite ? "Mise à jour..." : "Création..."}
                      </>
                    ) : editingTraite ? (
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
      {isDetailsModalOpen && selectedTraite && (
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
                      <p className="font-medium">{selectedTraite.customer?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium">{getTypeLabel(selectedTraite.type)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CIN</p>
                      <p className="font-medium">{selectedTraite.customer?.cin || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Téléphone</p>
                      <p className="font-medium">{selectedTraite.customer?.phoneNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ajouté par</p>
                      <p className="font-medium">
                        {getUserName(selectedTraite.user?._id || selectedTraite.user)}
                      </p>
                    </div>
                    {selectedTraite.note && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Note</p>
                        <p className="font-medium">{selectedTraite.note}</p>
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
                      <p className="text-xl font-bold text-gray-900">{getTotalAmount(selectedTraite.payments)} TND</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Payé</p>
                      <p className="text-xl font-bold text-green-600">{getPaidAmount(selectedTraite.payments)} TND</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Restant</p>
                      <p className="text-xl font-bold text-red-600">
                        {getTotalAmount(selectedTraite.payments) - getPaidAmount(selectedTraite.payments)} TND
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payments List */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Liste des Paiements ({selectedTraite.payments?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {selectedTraite.payments?.map((payment, index) => (
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
                              onClick={() => togglePaymentStatus(selectedTraite._id, index)}
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
                      setIsDetailsModalOpen(false);
                      handleEdit(selectedTraite);
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
  );
};

export default KmebyleAdmin;