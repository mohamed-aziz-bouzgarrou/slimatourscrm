import React, { useState, useEffect } from "react";
import SidBar from "./SidBar";
import { FaSearch, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlusCircle, FaTrashAlt, FaEye } from 'react-icons/fa'; // Import icons

const PurchaseHistory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    cin: "",
    name: "",
    phoneNumber: "",
    address: "",
    omraDate: {start: "",end: ""},
    typeOfService: "",
    totalPrice: "",
    addedBy: "", // Employee ID
    user: localStorage.getItem("user"), // User ID (logged-in user)
  });
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [isCustomerDetailsModalOpen, setIsCustomerDetailsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  // Get the logged-in user ID from localStorage
const userId=localStorage.getItem("user");

  useEffect(() => {
    if (!userId) {
      toast.error("User not logged in.");
      return;
    }

    // Fetch employees from the backend
    axios.get(process.env.REACT_APP_API_BASE_URL+"/users/")
      .then((response) => {
        setEmployees(response.data.data.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });

    // Fetch customers for the logged-in user
    fetchCustomers();
  }, [userId]);

  const handlePrintInvoice = () => {
    const printContent = document.getElementById('invoiceContent');
    const newWindow = window.open('', '', 'height=500, width=800');
    newWindow.document.write(printContent.innerHTML);
    newWindow.document.close();
    newWindow.print();
  };

  const handleViewCustomerDetails = async (customerId) => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_BASE_URL+`/customer/customers/${customerId}`);
      if (response.status === 200) {
        const customerData = response.data;
        const { payments, ...customerInfo } = customerData;

        // Calculate remaining balance for each payment
        const updatedPayments = payments.map(payment => ({
          ...payment,
          remainingAmount: payment.totalAmount - payment.amountPaid,
        }));

        setCustomerDetails({
          ...customerInfo,
          payments: updatedPayments,
        });
        setIsCustomerDetailsModalOpen(true);
      } else {
        toast.error('Failed to fetch customer details.');
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      toast.error('An error occurred while fetching customer details.');
    }
  };

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMethod: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5);

  // Fetch customers for the logged-in user
  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(process.env.REACT_APP_API_BASE_URL+`/customer/user/${userId}`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("An error occurred while fetching customers.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.cin.includes(searchQuery) || // Search by CIN
      customer.name.toLowerCase().includes(searchLower) || // Search by name
      customer.phoneNumber.includes(searchQuery) || // Search by phone number
      new Date(customer.omraDate.start).toLocaleDateString().includes(searchQuery) // Search by Omra start date
    );
  });

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle opening the modal
  const handleOpenModal = () => setIsModalOpen(true);

  // Handle closing the modal
  const handleCloseModal = () => setIsModalOpen(false);

  // Handle input change for customer form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle date change for omraDate
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({
      ...prev,
      omraDate: { ...prev.omraDate, [name]: value },
    }));
  };

  // Handle form submission for creating a new customer
  const handleSubmit = async () => {
    const { cin, name, phoneNumber, address, omraDate, typeOfService, totalPrice, addedBy ,user} = customerForm;
console.log(userId)
    if (!cin || !name || !phoneNumber || !address || !omraDate.start || !omraDate.end || !typeOfService || !totalPrice || !addedBy) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(process.env.REACT_APP_API_BASE_URL+"/customer/customers", {
        ...customerForm,
        
      });
      console.log(userId)
      toast.success("Customer created successfully!");
      setIsModalOpen(false);
      setCustomerForm({
        cin: "",
        name: "",
        phoneNumber: "",
        address: "",
        omraDate: { start: "", end: "" },
        typeOfService: "",
        totalPrice: "",
        addedBy: "",
        user:localStorage.getItem("user"),

      });

      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the customer.");
    }
  };

  // Handle opening the payment modal
  const handleOpenPaymentModal = (customerId) => {
    setSelectedCustomerId(customerId);
    setIsPaymentModalOpen(true);
  };

  // Handle closing the payment modal
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentForm({ amount: "", paymentMethod: "" });
  };

  // Handle payment form input change
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    const { amount, paymentMethod } = paymentForm;

    if (!amount || !paymentMethod) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await axios.put(
        process.env.REACT_APP_API_BASE_URL+`/customer/customers/${selectedCustomerId}/payment`,
        paymentForm
      );
      toast.success("Payment added successfully!");
      setIsPaymentModalOpen(false);
      setPaymentForm({ amount: "", paymentMethod: "" });
      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the payment.");
    }
  };

  // Handle deleting a customer
  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await axios.delete(process.env.REACT_APP_API_BASE_URL+`/customer/customers/${customerId}`);
      if (response.status === 200) {
        setCustomers((prevCustomers) => prevCustomers.filter(customer => customer._id !== customerId));
        toast.success('Customer deleted successfully!');
      } else {
        toast.error('Failed to delete customer.');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('An error occurred while deleting the customer.');
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
              placeholder="Search by CIN, name, or date..."
              className="w-full p-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
          </div>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
Ajouter client
          </button>
        </header>

        {/* Display Customers */}
        {isLoading && <p>Loading customers...</p>}
        {/* {error && <p className="text-red-600">{error}</p>} */}
        <div className="grid grid-cols-3 gap-6">
  {currentCustomers.map((customer) => (
    <div key={customer._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <h2 className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
        {customer.name}
      </h2>
      <p className="text-sm text-gray-500">CIN : {customer.cin}</p>
      {/* <p className="text-sm text-gray-500">Date : {new Date(customer.omraDate.start).toLocaleDateString()} - {new Date(customer.omraDate.end).toLocaleDateString()}</p> */}
      <p className="mt-2 text-gray-800 font-medium">Prix Total : {customer.totalPrice} TND</p>
      <p className="text-gray-800">Montant Payé : {customer.paidAmount} TND</p>
      <p className="text-gray-800 mb-4">Montant Restant : {customer.remainingAmount} TND</p>

      <div className="flex gap-4">
        <button
          onClick={() => handleOpenPaymentModal(customer._id)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors duration-300"
        >
          <FaPlusCircle /> Ajouter un Paiement
        </button>

        <button
          onClick={() => handleDeleteCustomer(customer._id)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors duration-300"
        >
          <FaTrashAlt /> Supprimer
        </button>

        <button
          onClick={() => handleViewCustomerDetails(customer._id)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors duration-300"
        >
          <FaEye /> Voir
        </button>
      </div>
    </div>
  ))}
</div>


        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          {Array.from({ length: Math.ceil(filteredCustomers.length / customersPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

   {/* Modal for creating a new customer */}
   {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-md w-96 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Ajouter un Nouveau Client</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600 mb-2">CIN</label>
          <input
            name="cin"
            value={customerForm.cin}
            onChange={handleInputChange}
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Entrer le CIN"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-2">Nom</label>
          <input
            name="name"
            value={customerForm.name}
            onChange={handleInputChange}
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Entrer le nom"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-2">Numéro de Téléphone</label>
          <input
            name="phoneNumber"
            value={customerForm.phoneNumber}
            onChange={handleInputChange}
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Entrer le numéro de téléphone"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-2">Adresse</label>
          <input
            name="address"
            value={customerForm.address}
            onChange={handleInputChange}
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Entrer l'adresse"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-2">Date de Début</label>
          <input
            name="start"
            value={customerForm.omraDate.start}
            onChange={handleDateChange}
            type="date"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-2">Date de Fin</label>
          <input
            name="end"
            value={customerForm.omraDate.end}
            onChange={handleDateChange}
            type="date"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-gray-600 mb-2">Type de Service</label>
          <select
            name="typeOfService"
            value={customerForm.typeOfService}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Sélectionner le type de service</option>
            <option value="organised_transfer">Voyage organisé</option>
            <option value="ticket">Billet</option>
            <option value="hotel">Hôtel</option>
            <option value="full_package">Omra</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-gray-600 mb-2">Prix Total</label>
          <input
            name="totalPrice"
            value={customerForm.totalPrice}
            onChange={handleInputChange}
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Entrer le prix total"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-gray-600 mb-2">Ajouté Par (Employé)</label>
          <select
            name="addedBy"
            value={customerForm.addedBy}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Sélectionner un employé</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.username}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleCloseModal}
          className="px-4 py-2 bg-gray-300 rounded mr-2"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={!customerForm.cin || !customerForm.name || !customerForm.phoneNumber || !customerForm.address || !customerForm.omraDate.start || !customerForm.omraDate.end || !customerForm.typeOfService || !customerForm.totalPrice || !customerForm.addedBy}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Enregistrer le Client
        </button>
      </div>
    </div>
  </div>
)}


   {/* Modal Détails du Client */}
{isCustomerDetailsModalOpen && customerDetails && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-96 relative">
      <button
        onClick={() => setIsCustomerDetailsModalOpen(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        X
      </button>
      <h2 className="text-xl font-semibold mb-4">Détails du Client</h2>
      <div className="space-y-4 mb-6">
        <p><strong>CIN :</strong> {customerDetails.cin}</p>
        <p><strong>Nom :</strong> {customerDetails.name}</p>
        <p><strong>Numéro de Téléphone :</strong> {customerDetails.phoneNumber}</p>
        <p><strong>Adresse :</strong> {customerDetails.address}</p>
        <p><strong>Date Omra :</strong> {new Date(customerDetails.omraDate.start).toLocaleDateString()} - {new Date(customerDetails.omraDate.end).toLocaleDateString()}</p>
        <p><strong>Type de Service :</strong> {customerDetails.typeOfService}</p>
        <p><strong>Prix Total :</strong> {customerDetails.totalPrice} TND</p>
        <p><strong>Montant Payé :</strong> {customerDetails.paidAmount} TND</p>
        <p><strong>Montant Restant :</strong> {customerDetails.remainingAmount} TND</p>
      </div>
      <div id="invoiceContent">
        <h3 className="text-lg font-semibold mb-2">Paiements</h3>
        <div className="space-y-4">
          {customerDetails.payments && customerDetails.payments.length > 0 ? (
            customerDetails.payments.map((payment, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <p><strong>Méthode de Paiement :</strong> {payment.paymentMethod}</p>
                <p><strong>Montant Payé :</strong> {payment.amount} TND</p>
                <p><strong>Date :</strong> {new Date(payment.date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>Aucun paiement disponible pour ce client.</p>
          )}
        </div>
      </div>
      <button
        onClick={handlePrintInvoice}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Imprimer la Facture
      </button>
    </div>
  </div>
)}


        {/* Modal for adding a payment */}
        {isPaymentModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-xl font-semibold mb-4">Ajouter un Paiement</h2>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Montant</label>
        <input
          name="amount"
          value={paymentForm.amount}
          onChange={handlePaymentInputChange}
          type="number"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Saisir le montant"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Méthode de Paiement</label>
        <select
          name="paymentMethod"
          value={paymentForm.paymentMethod}
          onChange={handlePaymentInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Sélectionner une méthode de paiement</option>
          <option value="check">Chèque</option>
          <option value="espace">Espèces</option>
          <option value="virement">Virement</option>
          <option value="kembyela">Traite</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleClosePaymentModal}
          className="px-4 py-2 bg-gray-300 rounded mr-2"
        >
          Annuler
        </button>
        <button
          onClick={handlePaymentSubmit}
          disabled={!paymentForm.amount || !paymentForm.paymentMethod}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Ajouter le Paiement
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default PurchaseHistory;