import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import SidBar from "./SidBar";

export default function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState(moment().format("YYYY-MM-DD"));
  const userId = localStorage.getItem("user");

  useEffect(() => {
    if (!userId) {
      console.error("ID utilisateur manquant. Assurez-vous que l'utilisateur est connecté.");
      setError("ID utilisateur manquant. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/home/user/${userId}`, {
          params: {
            filterType: filterType !== "all" ? filterType : undefined,
            date: filterType !== "all" ? filterDate : undefined
          }
        });
        
        console.log("Réponse des statistiques du tableau de bord:", response.data);
        
        if (response.data.success) {
          const apiData = response.data.data;
          
          const totalRevenueCollected = (apiData.omraBookings?.totalAmount || 0) - (apiData.omraBookings?.totalCredit || 0);
          const totalDependences = apiData.dependences?.totalAmount || 0;
          const netProfit = totalRevenueCollected - totalDependences;
          
          const mappedStats = {
            userName: apiData.userName,
            userCity: apiData.userCity,
            totalCustomers: apiData.omraBookings?.count || 0,
            totalRevenueExpected: apiData.omraBookings?.totalAmount || 0,
            totalRevenueCollected: totalRevenueCollected,
            totalOutstandingBalance: apiData.omraBookings?.totalCredit || 0,
            netProfit: netProfit,
            traiteStats: {
              totalTraitePayments: apiData.kembyela?.totalAmount || 0,
              totalTraiteCount: apiData.kembyela?.count || 0,
              totalPaidTraite: Math.floor((apiData.kembyela?.count || 0) * 0.7),
              totalUnpaidTraite: Math.ceil((apiData.kembyela?.count || 0) * 0.3),
            },
            totalDependences: totalDependences,
            totalCredit: apiData.omraBookings?.totalCredit || 0,
            rawApiData: apiData
          };
          
          setDashboardStats(mappedStats);
        } else {
          setError("Échec de la récupération des statistiques du tableau de bord");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques du tableau de bord:", error);
        setError(`Erreur lors de la récupération des statistiques: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [userId, filterType, filterDate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

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
    );
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
    );
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
            <div className="text-sm text-gray-500">
              Dernière mise à jour: {moment().format('DD/MM/YYYY HH:mm')}
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {[
            { 
              label: "Total Réservations", 
              value: dashboardStats?.totalCustomers || 0,
              color: "bg-blue-500",
              icon: "👥"
            },
            { 
              label: "Revenu Total Prévu", 
              value: formatCurrency(dashboardStats?.totalRevenueExpected || 0),
              color: "bg-green-500",
              icon: "💰"
            },
            { 
              label: "Revenu Total Collecté", 
              value: formatCurrency(dashboardStats?.totalRevenueCollected || 0),
              color: "bg-emerald-500",
              icon: "✅"
            },
            { 
              label: "Solde Total Impayé", 
              value: formatCurrency(dashboardStats?.totalOutstandingBalance || 0),
              color: "bg-red-500",
              icon: "⚠️"
            },
            { 
              label: "Total Crédit", 
              value: formatCurrency(dashboardStats?.totalCredit || 0),
              color: "bg-purple-500",
              icon: "💳"
            },
            { 
              label: "Total Paiements Traite", 
              value: formatCurrency(dashboardStats?.traiteStats?.totalTraitePayments || 0),
              color: "bg-indigo-500",
              icon: "💰"
            },
            { 
              label: "Nombre de Traites", 
              value: dashboardStats?.traiteStats?.totalTraiteCount || 0,
              color: "bg-cyan-500",
              icon: "📊"
            },
            { 
              label: "Traites Payées (Est.)", 
              value: dashboardStats?.traiteStats?.totalPaidTraite || 0,
              color: "bg-green-600",
              icon: "✔️"
            },
            { 
              label: "Traites Impayées (Est.)", 
              value: dashboardStats?.traiteStats?.totalUnpaidTraite || 0,
              color: "bg-orange-500",
              icon: "⏳"
            },
            { 
              label: "Total Dépenses", 
              value: formatCurrency(dashboardStats?.totalDependences || 0),
              color: "bg-red-600",
              icon: "💸"
            },
            { 
              label: "Profit Net", 
              value: formatCurrency(dashboardStats?.netProfit || 0),
              color: dashboardStats?.netProfit >= 0 ? "bg-green-700" : "bg-red-700",
              icon: dashboardStats?.netProfit >= 0 ? "📈" : "📉",
              tooltip: "Calculé comme: Revenu Total Collecté - Total Dépenses"
            }
          ].map((stat, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-500 font-medium">{stat.label}</h3>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              {stat.tooltip && (
                <p className="text-xs text-gray-500 mt-1">{stat.tooltip}</p>
              )}
              <div className={`h-1 ${stat.color} rounded-full mt-2 opacity-20`}></div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Résumé Financier</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Revenus Collectés:</span>
                <span className="font-semibold">{formatCurrency(dashboardStats?.totalRevenueCollected || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dépenses Totales:</span>
                <span className="font-semibold text-red-600">{formatCurrency(dashboardStats?.totalDependences || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Crédit:</span>
                <span className="font-semibold text-purple-600">{formatCurrency(dashboardStats?.totalCredit || 0)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg">
                <span className="text-gray-800 font-semibold">Profit Net (Collecté - Dépenses):</span>
                <span className={`font-bold ${dashboardStats?.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(dashboardStats?.netProfit || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistiques des Traites</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Traites:</span>
                <span className="font-semibold">{dashboardStats?.traiteStats?.totalTraiteCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant Total:</span>
                <span className="font-semibold">{formatCurrency(dashboardStats?.traiteStats?.totalTraitePayments || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payées (Estimation):</span>
                <span className="font-semibold text-green-600">{dashboardStats?.traiteStats?.totalPaidTraite || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impayées (Estimation):</span>
                <span className="font-semibold text-orange-600">{dashboardStats?.traiteStats?.totalUnpaidTraite || 0}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}