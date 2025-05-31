import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import AdminSidbar from "../Home/admin/AdminSidbar";
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function SupDashboard() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [dateFilterType, setDateFilterType] = useState('all'); // 'all', 'day', 'week', 'month', 'year'
  const [filterDate, setFilterDate] = useState(moment().format('YYYY-MM-DD'));
  const [filterType, setFilterType] = useState('all'); // 'all', 'user', 'city'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/`);
        const usersData = response.data.data?.data || response.data.data || [];
        setUsers(usersData);
        const uniqueCities = [...new Set(usersData.map(user => user.city).filter(Boolean))];
        setCities(uniqueCities);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [selectedUserId, selectedCity, filterType, dateFilterType, filterDate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${process.env.REACT_APP_API_BASE_URL}/home`;
      
      if (filterType === 'user' && selectedUserId) {
        url += `/user/${selectedUserId}`;
      } else if (filterType === 'city' && selectedCity) {
        url += `/city/${encodeURIComponent(selectedCity)}`;
      } else {
        url += '/all';
      }

      const response = await axios.get(url, {
        params: {
          filterType: dateFilterType !== 'all' ? dateFilterType : undefined,
          date: dateFilterType !== 'all' ? filterDate : undefined
        }
      });
      
      if (response.data.success) {
        let statsData = response.data.data;
        
        // Calculate Total Revenue Collected and Net Profit
        const totalRevenueCollected = (statsData.overall?.omraBookings?.totalAmount || statsData.omraBookings?.totalAmount || 0) - 
                                     (statsData.overall?.omraBookings?.totalCredit || statsData.omraBookings?.totalCredit || 0);
        const totalDependences = statsData.overall?.dependences?.totalAmount || statsData.dependences?.totalAmount || 0;
        const netProfit = totalRevenueCollected - totalDependences;

        // If overall stats, process city data
        let byCity = statsData.byCity;
        if (byCity) {
          byCity = Object.fromEntries(
            Object.entries(statsData.byCity).map(([city, data]) => {
              const cityRevenueCollected = (data.omraBookings?.totalAmount || 0) - (data.omraBookings?.totalCredit || 0);
              const cityNetProfit = cityRevenueCollected - (data.dependences?.totalAmount || 0);
              return [city, {
                ...data,
                totalRevenueCollected: cityRevenueCollected,
                netProfit: cityNetProfit
              }];
            })
          );
        }

        // Structure the stats data
        const processedStats = {
          ...(statsData.overall || statsData),
          totalRevenueCollected,
          totalRevenueExpected: statsData.overall?.omraBookings?.totalAmount || statsData.omraBookings?.totalAmount || 0,
          netProfit,
          byCity,
          calculatedAt: statsData.calculatedAt
        };

        setDashboardStats(processedStats);
      } else {
        setError("Échec de la récupération des statistiques du tableau de bord");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques du tableau de bord:", error);
      setError(`Erreur: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setSelectedUserId('');
    setSelectedCity('');
    if (type === 'all') {
      fetchDashboardStats();
    }
  };

  const handleDateFilterChange = (e) => {
    setDateFilterType(e.target.value);
  };

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const safeData = (data) => {
    return {
      labels: data?.labels || [],
      datasets: data?.datasets || [],
    };
  };

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    }
  };

  const doughnutOptions = {
    ...commonChartOptions,
    cutout: '60%',
    plugins: {
      ...commonChartOptions.plugins,
      legend: {
        ...commonChartOptions.plugins.legend,
        position: 'right'
      }
    }
  };

  const barOptions = {
    ...commonChartOptions,
    aspectRatio: 2,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('fr-TN', {
              style: 'currency',
              currency: 'TND',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      },
      x: { grid: { display: false } }
    }
  };

  const createChartData = () => {
    if (!dashboardStats) return {};

    const cityData = dashboardStats.byCity ? Object.entries(dashboardStats.byCity) : [];
    const cityChartData = {
      labels: cityData.map(([city]) => city),
      datasets: [
        {
          label: "Revenus Collectés par agence",
          data: cityData.map(([, data]) => data.totalRevenueCollected || 0),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", 
            "#FF9F40", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    };

    const profitVsExpensesData = {
      labels: ["Revenus Collectés", "Revenus Prévu", "Dépenses", "Profit Net"],
      datasets: [
        {
          label: "Analyse Financière (TND)",
          data: [
            dashboardStats.totalRevenueCollected || 0,
            dashboardStats.totalRevenueExpected || 0,
            dashboardStats.dependences?.totalAmount || 0,
            dashboardStats.netProfit || 0
          ],
          backgroundColor: [
            "#36A2EB", "#4BC0C0", "#FF6384", 
            dashboardStats.netProfit >= 0 ? "#4BC0C0" : "#FF6384"
          ],
          borderWidth: 1,
          borderColor: '#fff'
        }
      ]
    };

    const traiteData = {
      labels: ["Traites Payées (Est.)", "Traites Impayées (Est.)"],
      datasets: [
        {
          label: "Statut des Traites",
          data: [
            Math.floor((dashboardStats.kembyela?.count || 0) * 0.7),
            Math.ceil((dashboardStats.kembyela?.count || 0) * 0.3)
          ],
          backgroundColor: ["#4BC0C0", "#FF6384"],
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    };

    return { cityChartData, profitVsExpensesData, traiteData };
  };

  const { cityChartData, profitVsExpensesData, traiteData } = createChartData();

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <aside className="w-64 bg-white border-r border-gray-200 p-5">
          <AdminSidbar />
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

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-5">
        <AdminSidbar />
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl text-gray-800">Tableau de Bord Superviseur</h1>
            <p className="text-sm text-gray-600">
              Dernière mise à jour: {moment().format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de Vue</label>
              <select
                value={filterType}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Toutes les Statistiques</option>
                <option value="user">Par Utilisateur</option>
                <option value="city">Par agence</option>
              </select>
            </div>

            {filterType === 'user' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner un Utilisateur</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choisir un utilisateur</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.firstName} {user.lastName} ({user.city})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {filterType === 'city' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner une agence</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choisir une agence</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par Période</label>
              <select
                value={dateFilterType}
                onChange={handleDateFilterChange}
                className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous</option>
                <option value="day">Jour</option>
                <option value="week">Semaine</option>
                <option value="month">Mois</option>
                <option value="year">Année</option>
              </select>
            </div>

            {dateFilterType !== 'all' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={handleDateChange}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={fetchDashboardStats}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Actualiser les Données
            </button>
          </div>
        </section>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong className="font-bold">Erreur!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {dashboardStats && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: "Total Utilisateurs",
                  value: dashboardStats.totalUsers || dashboardStats.userCount || 0,
                  color: "bg-blue-500",
                  icon: "👥"
                },
                {
                  label: "Total Réservations",
                  value: dashboardStats.omraBookings?.count || 0,
                  color: "bg-green-500",
                  icon: "📋"
                },
                {
                  label: "Revenu Total Prévu",
                  value: formatCurrency(dashboardStats.totalRevenueExpected || 0),
                  color: "bg-emerald-500",
                  icon: "💰"
                },
                {
                  label: "Revenu Total Collecté",
                  value: formatCurrency(dashboardStats.totalRevenueCollected || 0),
                  color: "bg-teal-500",
                  icon: "✅"
                },
                {
                  label: "Total Crédit",
                  value: formatCurrency(dashboardStats.omraBookings?.totalCredit || 0),
                  color: "bg-red-500",
                  icon: "⚠️"
                },
                {
                  label: "Total Paiements Traite",
                  value: formatCurrency(dashboardStats.kembyela?.totalAmount || 0),
                  color: "bg-indigo-500",
                  icon: "💳"
                },
                {
                  label: "Nombre de Traites",
                  value: dashboardStats.kembyela?.count || 0,
                  color: "bg-cyan-500",
                  icon: "📊"
                },
                {
                  label: "Total Dépenses",
                  value: formatCurrency(dashboardStats.dependences?.totalAmount || 0),
                  color: "bg-red-600",
                  icon: "💸"
                },
                {
                  label: "Profit Net",
                  value: formatCurrency(dashboardStats.netProfit || 0),
                  color: dashboardStats.netProfit >= 0 ? "bg-green-700" : "bg-red-700",
                  icon: dashboardStats.netProfit >= 0 ? "📈" : "📉",
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

            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
              {dashboardStats.byCity && Object.keys(dashboardStats.byCity).length > 0 && (
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="text-lg font-medium mb-4 text-center">Revenus Collectés par agence</h3>
                  <div className="h-80 flex items-center justify-center">
                    <Doughnut data={safeData(cityChartData)} options={doughnutOptions} />
                  </div>
                </div>
              )}

              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-4 text-center">Analyse Financière</h3>
                <div className="h-80">
                  <Bar data={safeData(profitVsExpensesData)} options={barOptions} />
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-4 text-center">Statut des Traites</h3>
                <div className="h-80 flex items-center justify-center">
                  <Doughnut data={safeData(traiteData)} options={doughnutOptions} />
                </div>
              </div>
            </section>

            {dashboardStats.byCity && filterType === 'all' && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistiques par agence</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">agence</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateurs</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Réservations</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus Collectés</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus Prévu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traites</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Net</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(dashboardStats.byCity).map(([city, data]) => (
                        <tr key={city} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{city}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.userCount || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.omraBookings?.count || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(data.totalRevenueCollected || 0)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(data.omraBookings?.totalAmount || 0)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.kembyela?.count || 0}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(data.netProfit || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {dashboardStats && (
              <section className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Résumé Financier</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenus Collectés:</span>
                    <span className="font-semibold">{formatCurrency(dashboardStats.totalRevenueCollected || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenus Prévu:</span>
                    <span className="font-semibold">{formatCurrency(dashboardStats.totalRevenueExpected || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dépenses Totales:</span>
                    <span className="font-semibold text-red-600">{formatCurrency(dashboardStats.dependences?.totalAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Crédit:</span>
                    <span className="font-semibold text-purple-600">{formatCurrency(dashboardStats.omraBookings?.totalCredit || 0)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-800 font-semibold">Profit Net (Collecté - Dépenses):</span>
                    <span className={`font-bold ${dashboardStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(dashboardStats.netProfit || 0)}
                    </span>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}