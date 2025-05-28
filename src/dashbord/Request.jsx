import React, { useState, useEffect } from "react";
import SidBar from "./SidBar"; // Ensure correct import name
import axios from "axios";

const Kembyel = () => {
  const [kembyels, setKembyels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newKembyelData, setNewKembyelData] = useState({
    name: "",
    phoneNumber: "",
    cin: "",
    payments: [{ amount: "", paymentDate: new Date().toISOString().split("T")[0], status: "unpaid" }],
    type: "physique", // Default type
    user: localStorage.getItem("user"), // Include the user ID from localStorage
  });
  const [editKembyelId, setEditKembyelId] = useState(null);
  const [searchCin, setSearchCin] = useState("");
  const [sortByDate, setSortByDate] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [selectedKembyel, setSelectedKembyel] = useState(null); // For details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchKembyels = async () => {
      try {
        const userId = localStorage.getItem("user"); // Get the user ID from localStorage
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/kembyel/single/${userId}`
        );
        setKembyels(response.data);
      } catch (error) {
        console.error("Error fetching Kembyel records for the user:", error);
      }
    };
    fetchKembyels();
  }, []);


  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewKembyelData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes for the payments array
  const handlePaymentChange = (index, field, value) => {
    const updatedPayments = [...newKembyelData.payments];
    updatedPayments[index][field] = value;
    setNewKembyelData((prev) => ({ ...prev, payments: updatedPayments }));
  };

  // Add a new payment field
  const addPaymentField = () => {
    setNewKembyelData((prev) => ({
      ...prev,
      payments: [
        ...prev.payments,
        { amount: "", paymentDate: new Date().toISOString().split("T")[0], status: "unpaid" },
      ],
    }));
  };

  // Remove a payment field
  const removePaymentField = (index) => {
    const updatedPayments = newKembyelData.payments.filter((_, i) => i !== index);
    setNewKembyelData((prev) => ({ ...prev, payments: updatedPayments }));
  };

  // Create or Update a Kembyel record
  const handleSubmit = async () => {
    try {
      const payload = {
        ...newKembyelData,
        payments: newKembyelData.payments.map((payment) => ({
          amount: parseFloat(payment.amount),
          paymentDate: payment.paymentDate,
          status: payment.status,
        })),
      };

      if (editKembyelId) {
        // Update existing record
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/kembyel/${editKembyelId}`, payload);
      } else {
        // Create new record
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/kembyel`, payload);
      }

      // Refresh the list
      const userId = localStorage.getItem("user"); // Get the user ID from localStorage
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/kembyel/single/${userId}`
        );      setKembyels(response.data);
      setShowModal(false);
      setNewKembyelData({
        name: "",
        phoneNumber: "",
        cin: "",
        payments: [{ amount: "", paymentDate: new Date().toISOString().split("T")[0], status: "unpaid" }],
        type: "physique",
        user: localStorage.getItem("user"),
      });
      setEditKembyelId(null);
    } catch (error) {
      console.error("Error saving Kembyel record:", error);
    }
  };

  // Delete a Kembyel record
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/kembyel/${id}`);
      const userId = localStorage.getItem("user"); // Get the user ID from localStorage
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/kembyel/single/${userId}`
        );      setKembyels(response.data);
    } catch (error) {
      console.error("Error deleting Kembyel record:", error);
    }
  };

  // Edit a Kembyel record
  const handleEdit = (kembyel) => {
    setNewKembyelData({
      name: kembyel.name,
      phoneNumber: kembyel.phoneNumber,
      cin: kembyel.cin,
      payments: kembyel.payments.map((payment) => ({
        amount: payment.amount.toString(),
        paymentDate: payment.paymentDate.split("T")[0],
        status: payment.status,
      })),
      type: kembyel.type,
      user: kembyel.user,
    });
    setEditKembyelId(kembyel._id);
    setShowModal(true);
  };

  // Toggle paid status for a specific payment
  const togglePaymentStatus = async (kembyelId, paymentIndex) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/kembyel/kembyel/${kembyelId}/payment/${paymentIndex}`,
        { status: "paid" }
      );
  
      // Update the local state to reflect the change
      setKembyels((prevKembyels) =>
        prevKembyels.map((kembyel) =>
          kembyel._id === kembyelId
            ? { ...kembyel, payments: kembyel.payments.map((payment, index) => 
                index === paymentIndex ? { ...payment, status: "paid" } : payment) }
            : kembyel
        )
      );
    } catch (error) {
      console.error("Error toggling payment status:", error);
    }
  };

  // Filter records by CIN
  const filteredKembyels = kembyels.filter((kembyel) =>
    kembyel.cin.toLowerCase().includes(searchCin.toLowerCase())
  );

  // Sort records by date
  const sortedKembyels = filteredKembyels.sort((a, b) => {
    const dateA = new Date(a.payments[0]?.paymentDate || "");
    const dateB = new Date(b.payments[0]?.paymentDate || "");
    return sortByDate === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedKembyels.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Show details modal
  const handleShowDetails = (kembyel) => {
    setSelectedKembyel(kembyel);
    setShowDetailsModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-0 w-64 bg-white border-r border-gray-200 p-5">

      <SidBar />
</div>
      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Liste Traite </h1>

{/* Recherche et Tri */}  
<div className="mb-4 flex items-center gap-4">
  <input
    type="text"
    placeholder="Rechercher par CIN"
    value={searchCin}
    onChange={(e) => setSearchCin(e.target.value)}
    className="border border-gray-300 rounded-lg px-3 py-2 w-64"
  />
  <select
    value={sortByDate}
    onChange={(e) => setSortByDate(e.target.value)}
    className="border border-gray-300 rounded-lg px-3 py-2"
  >
    <option value="asc">Trier par Date (Croissant)</option>
    <option value="desc">Trier par Date (Décroissant)</option>
  </select>
</div>


        {/* Add New Record Button */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Ajouter une nouvelle traite
        </button>

        {/* Display Records in Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {currentRecords.map((kembyel) => (
    <div key={kembyel._id} className="bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-xl font-bold">{kembyel.name}</h2>
      <p>Numéro de téléphone : {kembyel.phoneNumber}</p>
      <p>CIN : {kembyel.cin}</p>
      <p>Type : {kembyel.type}</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => handleShowDetails(kembyel)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Voir les détails
        </button>
        <button
          onClick={() => handleEdit(kembyel)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Modifier
        </button>
        <button
          onClick={() => handleDelete(kembyel._id)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Supprimer
        </button>
      </div>
    </div>
  ))}
</div>


        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(sortedKembyels.length / recordsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-4 py-2 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

{/* Modal for Add/Edit Record */}
{showModal && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 h-3/4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">
        {editKembyelId ? "Modifier l'enregistrement de Kembyel" : "Ajouter un nouvel enregistrement de Kembyel"}
      </h2>
      <div>
        <label>Nom :</label>
        <input
          type="text"
          name="name"
          value={newKembyelData.name}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
        />
      </div>
      <div>
        <label>Numéro de téléphone :</label>
        <input
          type="text"
          name="phoneNumber"
          value={newKembyelData.phoneNumber}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
        />
      </div>
      <div>
        <label>CIN :</label>
        <input
          type="text"
          name="cin"
          value={newKembyelData.cin}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
        />
      </div>
      <div>
        <label>Type :</label>
        <select
          name="type"
          value={newKembyelData.type}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
        >
          <option value="physique">Physique</option>
          <option value="bank">Banque</option>
        </select>
      </div>
      <div>
        <h3 className="font-bold">Paiements :</h3>
        {newKembyelData.payments.map((payment, index) => (
          <div key={index} className="mb-2">
            <div>
              <label>Montant :</label>
              <input
                type="number"
                value={payment.amount}
                onChange={(e) => handlePaymentChange(index, "amount", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
              />
            </div>
            <div>
              <label>Date de paiement :</label>
              <input
                type="date"
                value={payment.paymentDate}
                onChange={(e) => handlePaymentChange(index, "paymentDate", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
              />
            </div>
            <div>
              <label>Statut :</label>
              <select
                value={payment.status}
                onChange={(e) => handlePaymentChange(index, "status", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
              >
                <option value="unpaid">Non payé</option>
                <option value="paid">Payé</option>
              </select>
            </div>
            {index > 0 && (
              <button
                onClick={() => removePaymentField(index)}
                className="bg-red-600 text-white px-4 py-2 rounded ml-2"
              >
                Supprimer
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addPaymentField}
          className="bg-green-600 text-white px-4 py-2 rounded mb-2"
        >
          Ajouter un paiement
        </button>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => {
            setShowModal(false);
            setNewKembyelData({
              name: "",
              phoneNumber: "",
              cin: "",
              payments: [{ amount: "", paymentDate: new Date().toISOString().split("T")[0], status: "unpaid" }],
              type: "physique",
              user: localStorage.getItem("user"),
            });
            setEditKembyelId(null);
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editKembyelId ? "Mettre à jour" : "Créer"}
        </button>
      </div>
    </div>
  </div>
)}

{/* Modal for Payment Details */}
{showDetailsModal && selectedKembyel && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 h-3/4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Détails du Paiement</h2>
      <div>
        <h3 className="font-bold">Nom : {selectedKembyel.name}</h3>
        <p>Numéro de téléphone : {selectedKembyel.phoneNumber}</p>
        <p>CIN : {selectedKembyel.cin}</p>
        <p>Type : {selectedKembyel.type}</p>
        <h3 className="font-bold">Paiements :</h3>
        {selectedKembyel.payments.map((payment, index) => (
          <div key={index} className="mb-2">
            <p>Montant : {payment.amount}</p>
            <p>Date de paiement : {new Date(payment.paymentDate).toLocaleDateString()}</p>
            <p>Statut : {payment.status}</p>
            <button
              onClick={async () => {
                await togglePaymentStatus(selectedKembyel._id, index);
                // Mettre à jour selectedKembyel dans l'état pour refléter le nouveau statut de paiement
                setSelectedKembyel((prev) => ({
                  ...prev,
                  payments: prev.payments.map((p, i) =>
                    i === index ? { ...p, status: payment.status === "paid" ? "unpaid" : "paid" } : p
                  ),
                }));
              }}
              className={`bg-${payment.status === "paid" ? "green" : "red"}-600 text-white px-4 py-2 rounded`}
            >
              {payment.status === "paid" ? "Marquer comme Non Payé" : "Marquer comme Payé"}
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setShowDetailsModal(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
)}



      </div>
    </div>
  );
};

export default Kembyel;