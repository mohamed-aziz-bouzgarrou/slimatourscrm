"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import moment from "moment"
import SidBar from "./SidBar"

export default function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterType, setFilterType] = useState("all")
  const [filterDate, setFilterDate] = useState(moment().format("YYYY-MM-DD"))
  const userId = localStorage.getItem("user")

  useEffect(() => {
    if (!userId) {
      console.error("ID utilisateur manquant. Assurez-vous que l'utilisateur est connecté.")
      setError("ID utilisateur manquant. Veuillez vous reconnecter.")
      setLoading(false)
      return
    }

    const fetchDashboardStats = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/home/user/${userId}`, {
          params: {
            filterType: filterType !== "all" ? filterType : undefined,
            date: filterType !== "all" ? filterDate : undefined,
          },
        })

        console.log("Réponse des statistiques du tableau de bord:", response.data)

        if (response.data.success) {
          const apiData = response.data.data

          const totalRevenueCollected =
            (apiData.omraBookings?.totalAmount || 0) - (apiData.omraBookings?.totalCredit || 0)

          const mappedStats = {
            userName: apiData.userName,
            userCity: apiData.userCity,
            totalCustomers: apiData.omraBookings?.count || 0,
            totalRevenueExpected: apiData.omraBookings?.totalAmount || 0,
            totalRevenueCollected: totalRevenueCollected,
            totalOutstandingBalance: apiData.omraBookings?.totalCredit || 0,
            netProfit: apiData.netProfit || 0,
            bankNetProfit: apiData.bankNetProfit || 0,
            cashNetProfit: apiData.cashNetProfit || 0,
            bookingTypes: apiData.omraBookings?.byType || {},
            paymentCounts: apiData.payments?.counts || {},
            paymentAmounts: apiData.payments?.amounts || {},
            traiteStats: {
              totalTraitePayments: apiData.kembyela?.totalAmount || 0,
              totalTraiteCount: apiData.kembyela?.count || 0,
              totalPaidTraite: Math.floor((apiData.kembyela?.count || 0) * 0.7),
              totalUnpaidTraite: Math.ceil((apiData.kembyela?.count || 0) * 0.3),
            },
            totalDependences: apiData.dependences?.totalAmount || 0,
            dependencesByStatus: apiData.dependences?.byStatus || {},
            totalCredit: apiData.omraBookings?.totalCredit || 0,
            rawApiData: apiData,
          }

          setDashboardStats(mappedStats)
        } else {
          setError("Échec de la récupération des statistiques du tableau de bord")
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques du tableau de bord:", error)
        setError(`Erreur lors de la récupération des statistiques: ${error.response?.data?.message || error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [userId, filterType, filterDate])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const handleFilterChange = (e) => {
    setFilterType(e.target.value)
  }

  const handleDateChange = (e) => {
    setFilterDate(e.target.value)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <aside className="w-64 bg-white border-r border-gray-200 p-5">
          <SidBar />
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <aside className="w-64 bg-white border-r border-gray-200 p-5">
          <SidBar />
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong className="font-bold">Erreur!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Réessayer
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-5">
        <SidBar />
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl text-gray-800">Tableau de Bord</h1>
            {dashboardStats?.userName && (
              <p className="text-sm text-gray-600">
                Bienvenue, {dashboardStats.userName} ({dashboardStats.userCity})
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Filtrer par:</label>
              <select
                value={filterType}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous</option>
                <option value="day">Jour</option>
                <option value="week">Semaine</option>
                <option value="month">Mois</option>
                <option value="year">Année</option>
              </select>
            </div>
            {filterType !== "all" && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Date:</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={handleDateChange}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="text-sm text-gray-500">Dernière mise à jour: {moment().format("DD/MM/YYYY HH:mm")}</div>
          </div>
        </header>

        {/* Main Statistics Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Réservations",
              value: dashboardStats?.totalCustomers || 0,
              color: "bg-blue-500",
              icon: "👥",
            },
            {
              label: "Revenu Total Prévu",
              value: formatCurrency(dashboardStats?.totalRevenueExpected || 0),
              color: "bg-green-500",
              icon: "💰",
            },
            {
              label: "Revenu Total Collecté",
              value: formatCurrency(dashboardStats?.totalRevenueCollected || 0),
              color: "bg-emerald-500",
              icon: "✅",
            },
            {
              label: "Solde Total Impayé",
              value: formatCurrency(dashboardStats?.totalOutstandingBalance || 0),
              color: "bg-red-500",
              icon: "⚠️",
            },
            {
              label: "Profit Net Global",
              value: formatCurrency(dashboardStats?.netProfit || 0),
              color: dashboardStats?.netProfit >= 0 ? "bg-green-700" : "bg-red-700",
              icon: dashboardStats?.netProfit >= 0 ? "📈" : "📉",
              tooltip: "Revenu Total - Total Dépenses",
            },
            {
              label: "Profit Net Banque",
              value: formatCurrency(dashboardStats?.bankNetProfit || 0),
              color: dashboardStats?.bankNetProfit >= 0 ? "bg-blue-600" : "bg-red-600",
              icon: "🏦",
              tooltip: "Paiements Chèque/Virement - Dépenses Chèque/Virement",
            },
            {
              label: "Profit Net Caisse",
              value: formatCurrency(dashboardStats?.cashNetProfit || 0),
              color: dashboardStats?.cashNetProfit >= 0 ? "bg-yellow-600" : "bg-red-600",
              icon: "💵",
              tooltip: "Paiements Espèce - Dépenses Espèce",
            },
            {
              label: "Total Dépenses",
              value: formatCurrency(dashboardStats?.totalDependences || 0),
              color: "bg-red-600",
              icon: "💸",
            },
            {
              label: "Total Crédit",
              value: formatCurrency(dashboardStats?.totalCredit || 0),
              color: "bg-purple-500",
              icon: "💳",
            },
            {
              label: "Total Paiements Traite",
              value: formatCurrency(dashboardStats?.traiteStats?.totalTraitePayments || 0),
              color: "bg-indigo-500",
              icon: "💰",
            },
            {
              label: "Nombre de Traites",
              value: dashboardStats?.traiteStats?.totalTraiteCount || 0,
              color: "bg-cyan-500",
              icon: "📊",
            },
            {
              label: "Traites Payées (Est.)",
              value: dashboardStats?.traiteStats?.totalPaidTraite || 0,
              color: "bg-green-600",
              icon: "✔️",
            },
            {
              label: "Traites Impayées (Est.)",
              value: dashboardStats?.traiteStats?.totalUnpaidTraite || 0,
              color: "bg-orange-500",
              icon: "⏳",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-500 font-medium">{stat.label}</h3>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              {stat.tooltip && <p className="text-xs text-gray-500 mt-1">{stat.tooltip}</p>}
              <div className={`h-1 ${stat.color} rounded-full mt-2 opacity-20`}></div>
            </div>
          ))}
        </section>

        {/* Booking Types Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Types de Réservations</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(dashboardStats?.bookingTypes || {}).map(([type, count]) => (
                <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
                  <div className="text-sm text-gray-600 capitalize">{type}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Méthodes de Paiement</h2>
            <div className="space-y-3">
              {Object.entries(dashboardStats?.paymentCounts || {}).map(([method, count]) => (
                <div key={method} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{method}:</span>
                  <div className="text-right">
                    <span className="font-semibold">{count} paiements</span>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(dashboardStats?.paymentAmounts?.[method] || 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Financial Summary and Expenses */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Résumé Financier</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Revenus Collectés:</span>
                <span className="font-semibold">{formatCurrency(dashboardStats?.totalRevenueCollected || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dépenses Totales:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(dashboardStats?.totalDependences || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Crédit:</span>
                <span className="font-semibold text-purple-600">
                  {formatCurrency(dashboardStats?.totalCredit || 0)}
                </span>
              </div>
              <hr />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-800 font-semibold">Profit Net Global:</span>
                  <span className={`font-bold ${dashboardStats?.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(dashboardStats?.netProfit || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800 font-semibold">Profit Net Banque:</span>
                  <span
                    className={`font-bold ${dashboardStats?.bankNetProfit >= 0 ? "text-blue-600" : "text-red-600"}`}
                  >
                    {formatCurrency(dashboardStats?.bankNetProfit || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800 font-semibold">Profit Net Caisse:</span>
                  <span
                    className={`font-bold ${dashboardStats?.cashNetProfit >= 0 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {formatCurrency(dashboardStats?.cashNetProfit || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Dépenses par Type</h2>
            <div className="space-y-3">
              {Object.entries(dashboardStats?.dependencesByStatus || {}).map(([status, data]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{status}:</span>
                  <div className="text-right">
                    <span className="font-semibold">{data.count || 0} dépenses</span>
                    <div className="text-sm text-red-600">{formatCurrency(data.totalAmount || 0)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Traite Statistics */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistiques des Traites</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {dashboardStats?.traiteStats?.totalTraiteCount || 0}
              </div>
              <div className="text-sm text-gray-600">Total Traites</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(dashboardStats?.traiteStats?.totalTraitePayments || 0)}
              </div>
              <div className="text-sm text-gray-600">Montant Total</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                {dashboardStats?.traiteStats?.totalPaidTraite || 0}
              </div>
              <div className="text-sm text-gray-600">Payées (Est.)</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {dashboardStats?.traiteStats?.totalUnpaidTraite || 0}
              </div>
              <div className="text-sm text-gray-600">Impayées (Est.)</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
