import React, { useState, useEffect } from "react";
import SidBar from "./SidBar";
import axios from "axios";
import moment from "moment";

export default function Credit() {
  const [credits, setCredits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("week"); // Filter state
  const [newCreditData, setNewCreditData] = useState({
    name: "",
    amount: "",
    userId: localStorage.getItem("user"),
  });

  // Fetch credits from backend
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const userId = localStorage.getItem("user");
        const response = await axios.get(process.env.REACT_APP_API_BASE_URL + `/credit/user/${userId}`);
        setCredits(response.data);
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    };

    fetchCredits();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setNewCreditData({ ...newCreditData, [e.target.name]: e.target.value });
  };

  // Create a new credit record
  const handleCreateCredit = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_BASE_URL + "/credit/", newCreditData);
      setCredits([...credits, response.data]);
      setShowModal(false);
      setNewCreditData({ name: "", amount: "", userId: localStorage.getItem("user") });
    } catch (error) {
      console.error("Error creating credit:", error);
    }
  };

  // Delete a credit record
  const handleDeleteCredit = async (id) => {
    try {
      await axios.delete(process.env.REACT_APP_API_BASE_URL + `credit/${id}`);
      setCredits(credits.filter((credit) => credit._id !== id));
    } catch (error) {
      console.error("Error deleting credit:", error);
    }
  };

  // Define time periods for filtering
  const startOfWeek = moment().startOf("week");
  const endOfWeek = moment().endOf("week");
  const startOfMonth = moment().startOf("month");
  const endOfMonth = moment().endOf("month");

  // Filter credits based on the selected period
  let filteredCredits = credits;
  if (filter === "week") {
    filteredCredits = credits.filter((credit) =>
      moment(credit.createdAt).isBetween(startOfWeek, endOfWeek, null, "[]")
    );
  } else if (filter === "month") {
    filteredCredits = credits.filter((credit) =>
      moment(credit.createdAt).isBetween(startOfMonth, endOfMonth, null, "[]")
    );
  }

  // Calculate total amount for the filtered period
  const totalFilteredCredit = filteredCredits.reduce((sum, credit) => sum + credit.amount, 0);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-0 w-64 bg-white border-r border-gray-200 p-5">
        <SidBar />
      </div>

      {/* Main Content */}
      <div className="ml-64 p-5 w-full">
        <h2 className="text-2xl font-semibold mb-4">Gestion des Crédits</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={() => setShowModal(true)}
        >
          Ajouter un Crédit
        </button>

        {/* Total Credit for the Filtered Period */}
        <div className="flex items-center space-x-4 bg-green-100 p-4 rounded-lg mb-4 shadow-md border border-green-300">
          <p className="text-lg font-semibold text-green-800">
            Crédit Total : <span className="text-green-600">{totalFilteredCredit} TND</span>
          </p>
          <select
            className="p-2 border border-green-400 rounded-md shadow-sm transition duration-300 ease-in-out focus:ring focus:ring-green-300"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois-ci</option>
            <option value="all">Tous</option>
          </select>
        </div>

        {/* Liste des Crédits */}
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Nom</th>
              <th className="py-2 px-4 border">Montant</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCredits.map((credit) => (
              <tr key={credit._id} className="text-center">
                <td className="py-2 px-4 border">{credit.name}</td>
                <td className="py-2 px-4 border">{credit.amount} tnd</td>
                <td className="py-2 px-4 border">{moment(credit.createdAt).format("YYYY-MM-DD")}</td>
                <td className="py-2 px-4 border">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteCredit(credit._id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal pour Ajouter un Crédit */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white p-5 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-3">Ajouter un Crédit</h3>
              <input
                type="text"
                name="name"
                value={newCreditData.name}
                onChange={handleChange}
                placeholder="Nom"
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="number"
                name="amount"
                value={newCreditData.amount}
                onChange={handleChange}
                placeholder="Montant"
                className="w-full border p-2 rounded mb-2"
              />
              <div className="flex justify-end">
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded mr-2"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={handleCreateCredit}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}