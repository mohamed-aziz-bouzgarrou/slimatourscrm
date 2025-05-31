"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AdminSidbar from "../Home/admin/AdminSidbar"
import { FaSearch, FaTrash, FaUserPlus, FaUsers } from "react-icons/fa"

const BlogDetailPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    country: "",
    city: "",
    password: "",
  })

  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("add") // "add" or "list"

  const navigate = useNavigate()

  // Fetch employees data
  useEffect(() => {
    if (activeTab === "list") {
      fetchEmployees()
    }
  }, [activeTab])

  const fetchEmployees = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch employees")
      }

      const data = await response.json()
      setEmployees(data.data.data || [])
    } catch (err) {
      toast.error(err.message)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registration failed")
      }

      const data = await response.json()
      setSuccessMessage("Registration successful!")
      setError(null)

      toast.success("Registration successful!")

      // Reset form after success
      setFormData({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        country: "",
        city: "",
        password: "",
      })

      // Refresh employee list if we're showing it
      if (activeTab === "list") {
        fetchEmployees()
      }
    } catch (err) {
      setError(err.message)
      setSuccessMessage(null)
      toast.error(err.message)
    }
  }

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé?")) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to delete employee")
        }

        toast.success("Employee deleted successfully")
        fetchEmployees() // Refresh the list
      } catch (err) {
        toast.error(err.message)
      }
    }
  }

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.city?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed inset-0 w-64 bg-white border-r border-gray-200 p-5">
        <AdminSidbar />
      </div>
      <div className="flex-1 ml-64 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Tabs Navigation */}
          <div className="flex mb-6 bg-white rounded-lg shadow overflow-hidden">
            <button
              onClick={() => setActiveTab("add")}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 transition-colors ${
                activeTab === "add"
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaUserPlus />
              <span>Ajouter un Employé</span>
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 transition-colors ${
                activeTab === "list"
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaUsers />
              <span>Liste des Employés</span>
            </button>
          </div>

          {activeTab === "add" && (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Ajouter un Nouvel Employé</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Username", name: "username", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "First Name", name: "firstName", type: "text" },
                    { label: "Last Name", name: "lastName", type: "text" },
                    { label: "Phone Number", name: "phoneNumber", type: "text" },
                    { label: "Ville", name: "country", type: "text" },
                    { label: "Agence", name: "city", type: "text" },
                    { label: "Password", name: "password", type: "password" },
                  ].map((field) => (
                    <div key={field.name} className="mb-4">
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={field.name}>
                        {field.label}
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.label}
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                >
                  Enregistrer
                </button>
              </form>
            </div>
          )}

          {activeTab === "list" && (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Liste des Employés</h2>
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredEmployees.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Prénom
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Nom
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Agence
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredEmployees.map((employee) => (
                        <tr key={employee._id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">{employee.firstName}</td>
                          <td className="py-3 px-4 text-gray-800">{employee.lastName}</td>
                          <td className="py-3 px-4 text-gray-800">{employee.email}</td>
                          <td className="py-3 px-4 text-gray-800">{employee.city}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleDeleteEmployee(employee._id)}
                              disabled={isLoading}
                              className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Supprimer"
                            >
                              <FaTrash className="text-sm" />
                              <span>Supprimer</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-5xl text-gray-300 mb-4">
                    <FaUsers className="mx-auto" />
                  </div>
                  <p className="text-gray-500">
                    {searchTerm ? "Aucun employé ne correspond à votre recherche" : "Aucun employé trouvé"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default BlogDetailPage