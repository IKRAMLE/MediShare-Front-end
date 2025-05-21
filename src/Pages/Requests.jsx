import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { Compass, TrendingUp, User, Heart, Package, Settings, MessageSquare, ClipboardList, Check, X, Clock, Mail, Phone, MapPin, Paperclip, Search, Filter, Calendar, DollarSign, ChevronRight, ChevronDown, ChevronUp, Star, Award, AlertCircle, Info } from "lucide-react";
import DashboardHeader from "../Components/DashboardHeader";
import Sidebar from "../Components/Sidebar";
import AuthenticationRequired from "../Components/AuthenticationRequired";

const Requests = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("/requests");
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table"); 
  const [sortBy, setSortBy] = useState("date"); 
  const [sortOrder, setSortOrder] = useState("desc"); 
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(true);
      setUserData(parsedUser);
      setActiveMenuItem(location.pathname);
    } else {
      // Redirect to login if no user data
      navigate("/login2");
    }
    setAuthChecked(true);
  }, [location, navigate]);

  useEffect(() => {
    // Only fetch data if we have user data
    if (userData && userData.id) {
      fetchRequests();
    }
  }, [userData]);

  // Fetch requests from API
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const userId = userData.id;
      if (!userId) {
        throw new Error("User ID not found");
      }

      // Fetch orders from the backend API
      const response = await axiosInstance.get('/orders/owner');
      
      if (response.data.success) {
        const orders = response.data.data;
        
        // Transform orders data to match the component's expected format
        const transformedRequests = orders.map(order => {
          // Ensure we have valid items and equipment data
          const firstItem = order.items && order.items[0];
          const equipment = firstItem?.equipmentId;
          const user = order.userId;
          const personalInfo = order.personalInfo || {};

          if (!equipment) {
            console.warn('Order missing equipment data:', order);
            return null;
          }

          return {
            _id: order._id,
            equipmentId: equipment._id,
            equipmentName: equipment.name || 'Unknown Equipment',
            requesterId: user?._id,
            requesterName: personalInfo.firstName && personalInfo.lastName 
              ? `${personalInfo.firstName} ${personalInfo.lastName}`
              : 'Utilisateur',
            status: order.status || 'pending',
            startDate: firstItem?.startDate || new Date().toISOString(),
            endDate: firstItem?.endDate || new Date().toISOString(),
            rentalPeriod: firstItem?.rentalPeriod || 'day',
            totalPrice: order.totalAmount || 0,
            message: order.message || "Aucun message",
            createdAt: order.createdAt || new Date().toISOString(),
            equipmentPhoto: equipment.image || "/api/placeholder/100/100",
            personalInfo: {
              firstName: personalInfo.firstName || '',
              lastName: personalInfo.lastName || '',
              email: user?.email || personalInfo.email || '',
              phone: personalInfo.phone || '',
              address: personalInfo.address || '',
              city: personalInfo.city || '',
              country: personalInfo.country || '',
              postalCode: personalInfo.postalCode || '',
              cin: personalInfo.cin || '',
              cinProof: order.cinProof || '',
              profession: personalInfo.profession || '',
              organization: personalInfo.organization || ''
            }
          };
        }).filter(request => request !== null); 

        setRequests(transformedRequests);

        // Calculate stats
        const stats = {
          totalRequests: transformedRequests.length,
          pending: transformedRequests.filter(req => req.status === 'pending').length,
          approved: transformedRequests.filter(req => req.status === 'approved').length,
          rejected: transformedRequests.filter(req => req.status === 'rejected').length,
        };
        setStats(stats);

        setError(null);
      } else {
        throw new Error(response.data.message || "Failed to fetch requests");
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Échec du chargement des demandes. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: Compass, text: "Tableau de bord", path: "/dashboard" },
    { icon: Package, text: "Location d'équipement", path: "/rent-equip" },
    { icon: ClipboardList, text: "Demandes", path: "/requests" },
    { icon: Heart, text: "Favoris", path: "/favorites" },
    { icon: User, text: "Profil", path: "/profile" },
    { icon: Settings, text: "Paramètres", path: "/settings" },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setActiveMenuItem(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login2");
  };

  // Filter requests based on search query and selected filter
  const filteredRequests = requests.filter(
    (req) => {
      const matchesSearch = 
        req.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        selectedFilter === "all" || 
        req.status === selectedFilter;
      
      return matchesSearch && matchesFilter;
    }
  );

  // Sort requests based on selected criteria
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc" 
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.equipmentName.localeCompare(b.equipmentName)
        : b.equipmentName.localeCompare(a.equipmentName);
    } else if (sortBy === "price") {
      return sortOrder === "asc"
        ? a.totalPrice - b.totalPrice
        : b.totalPrice - a.totalPrice;
    }
    return 0;
  });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleApprove = async (requestId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/orders/${requestId}/status`, {
        status: 'approved'
      });
      
      if (response.data.success) {
        // Update state to reflect changes
        setRequests(prev => 
          prev.map(req => 
            req._id === requestId 
              ? { ...req, status: 'approved' } 
              : req
          )
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          approved: prev.approved + 1
        }));
        
        setModalOpen(false);
        setSelectedRequest(null);
      } else {
        throw new Error(response.data.message || "Failed to approve request");
      }
    } catch (err) {
      console.error("Error approving request:", err);
      setError("Échec de l'approbation de la demande. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/orders/${requestId}/status`, {
        status: 'rejected'
      });
      
      if (response.data.success) {
        // Update state to reflect changes
        setRequests(prev => 
          prev.map(req => 
            req._id === requestId 
              ? { ...req, status: 'rejected' } 
              : req
          )
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          rejected: prev.rejected + 1
        }));
        
        setModalOpen(false);
        setSelectedRequest(null);
      } else {
        throw new Error(response.data.message || "Failed to reject request");
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError("Échec du rejet de la demande. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const openRequestDetails = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Calculate rental duration in days
  const calculateRentalDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format price with Moroccan Dirham
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  };

  // Show authentication check
  if (!authChecked || !isLoggedIn) {
    return <AuthenticationRequired isLoading={!authChecked} />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        handleMenuClick={handleMenuClick}
        handleLogout={handleLogout}
      />

      <div
        className={`flex-1 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userData={userData}
        />

        <main className="p-6">
          {/* Stats Cards with Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Demandes</p>
                  <h3 className="text-2xl font-bold text-blue-600">{stats.totalRequests}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-amber-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">En attente</p>
                  <h3 className="text-2xl font-bold text-amber-600">{stats.pending}</h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Approuvées</p>
                  <h3 className="text-2xl font-bold text-green-600">{stats.approved}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Refusées</p>
                  <h3 className="text-2xl font-bold text-red-600">{stats.rejected}</h3>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <X className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Requests Section with Enhanced UI */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-blue-600" />
                Demandes de Location
              </h2>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                    selectedFilter === "all" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Toutes
                </button>
                <button 
                  onClick={() => setSelectedFilter("pending")}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                    selectedFilter === "pending" 
                      ? "bg-amber-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  En attente
                </button>
                <button 
                  onClick={() => setSelectedFilter("approved")}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                    selectedFilter === "approved" 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approuvées
                </button>
                <button 
                  onClick={() => setSelectedFilter("rejected")}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                    selectedFilter === "rejected" 
                      ? "bg-red-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <X className="h-4 w-4 mr-1" />
                  Refusées
                </button>
              </div>
            </div>

            {/* Advanced Filters and View Options */}
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                    />
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  
                  <button 
                    onClick={() => setExpandedFilters(!expandedFilters)}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Filtres avancés
                    {expandedFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Affichage:</span>
                  <button 
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "table" 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title="Vue tableau"
                  >
                    <ClipboardList className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode("card")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "card" 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title="Vue carte"
                  >
                    <Package className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Expanded Filters */}
              {expandedFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Trier par:</span>
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="date">Date</option>
                        <option value="name">Nom</option>
                        <option value="price">Prix</option>
                      </select>
                      <button 
                        onClick={toggleSortOrder}
                        className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                        title={sortOrder === "asc" ? "Trier croissant" : "Trier décroissant"}
                      >
                        {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-60">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            ) : sortedRequests.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Aucune demande trouvée
                </h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? "Aucune demande ne correspond à votre recherche." 
                    : selectedFilter !== "all" 
                      ? `Vous n'avez pas de demandes ${
                          selectedFilter === "pending" ? "en attente" : 
                          selectedFilter === "approved" ? "approuvées" : 
                          "refusées"
                        }.` 
                      : "Vous n'avez pas encore reçu de demandes de location."}
                </p>
              </div>
            ) : viewMode === "table" ? (
              <div className="overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Équipement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Demandeur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Période
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedRequests.map((request) => (
                        <tr 
                          key={request._id} 
                          className="hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => openRequestDetails(request)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                                <img 
                                  className="h-full w-full object-cover" 
                                  src={`http://localhost:5000${request.equipmentPhoto}`} 
                                  alt={request.equipmentName} 
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder-equipment.jpg";
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {request.equipmentName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {request.requesterName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <Calendar size={16} className="mr-1" />
                              <span>
                                {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  {calculateRentalDuration(request.startDate, request.endDate)} jours
                                </span>
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {formatPrice(request.totalPrice)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                request.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : request.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {request.status === "pending"
                                ? "En attente"
                                : request.status === "approved"
                                ? "Approuvée"
                                : "Refusée"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                openRequestDetails(request);
                              }}
                            >
                              Détails
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedRequests.map((request) => (
                  <div 
                    key={request._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => openRequestDetails(request)}
                  >
                    <div className="h-40 overflow-hidden">
                      <img 
                        className="w-full h-full object-cover" 
                        src={`http://localhost:5000${request.equipmentPhoto}`} 
                        alt={request.equipmentName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-equipment.jpg";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{request.equipmentName}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            request.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.status === "pending"
                            ? "En attente"
                            : request.status === "approved"
                            ? "Approuvée"
                            : "Refusée"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-1 text-blue-500" />
                        {request.requesterName}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-1" />
                        <span>
                          {formatDate(request.startDate)} - {formatDate(request.endDate)}
                          <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {calculateRentalDuration(request.startDate, request.endDate)} jours
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        {formatPrice(request.totalPrice)}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button 
                          className="text-blue-600 hover:text-blue-900 flex items-center text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openRequestDetails(request);
                          }}
                        >
                          Voir détails
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Request Details Modal with Enhanced UI */}
      {modalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Header with gradient background */}
            <div className="relative h-24 bg-[#07447d] rounded-t-2xl">
              <div className="absolute -bottom-10 left-4 flex items-end space-x-3">
                <div className="h-20 w-20 rounded-xl border-4 border-white shadow-lg overflow-hidden">
                  <img 
                    className="h-full w-full object-cover"
                    src={`http://localhost:5000${selectedRequest.equipmentPhoto}`}
                    alt={selectedRequest.equipmentName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-equipment.jpg";
                    }}
                  />
                </div>
                <div className="mb-2">
                  <h2 className="text-xl font-bold text-white mb-1">{selectedRequest.equipmentName}</h2>
                  <span
                    className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                      selectedRequest.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : selectedRequest.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedRequest.status === "pending"
                      ? "En attente"
                      : selectedRequest.status === "approved"
                      ? "Approuvée"
                      : "Refusée"}
                  </span>
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors bg-black bg-opacity-20 p-1 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 pt-12">
              {/* Tabs Navigation */}
              <div className="flex mb-4 border-b border-gray-200">
                <button 
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'details' 
                      ? 'text-[#07447d] border-b-2 border-[#07447d]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  Détails
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'requester' 
                      ? 'text-[#07447d] border-b-2 border-[#07447d]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('requester')}
                >
                  Demandeur
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'message' 
                      ? 'text-[#07447d] border-b-2 border-[#07447d]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('message')}
                >
                  Message
                </button>
              </div>

              {/* Main Content */}
              <div className="space-y-4">
                {/* Equipment Details Tab */}
                {activeTab === 'details' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500">ID de l'équipement</p>
                      <p className="text-sm font-medium">{selectedRequest.equipmentId}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500">Prix total</p>
                      <p className="text-sm font-medium text-[#07447d]">{formatPrice(selectedRequest.totalPrice)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500">Période de location</p>
                      <div className="flex items-center mb-2">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">
                            {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              {calculateRentalDuration(selectedRequest.startDate, selectedRequest.endDate)} jours
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500">Date de la demande</p>
                      <p className="text-sm font-medium">{new Date(selectedRequest.createdAt).toLocaleString('fr-FR')}</p>
                    </div>
                  </div>
                )}

                {/* Requester Details Tab */}
                {activeTab === 'requester' && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="bg-white p-1.5 rounded-full mr-2 shadow-sm">
                        <User className="h-3.5 w-3.5 text-[#07447d]" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        {selectedRequest.personalInfo.firstName} {selectedRequest.personalInfo.lastName}
                      </h3>
                      {selectedRequest.personalInfo.cin && (
                        <span className="ml-2 text-xs text-gray-500">CIN: {selectedRequest.personalInfo.cin}</span>
                      )}
                    </div>
                    {selectedRequest.personalInfo.cinProof && (
                      <div className="mt-2 flex items-center">
                        <div className="bg-white p-1 rounded-full mr-1 shadow-sm">
                          <Paperclip className="h-3 w-3 text-[#07447d]" />
                        </div>
                        <a 
                          href={`http://localhost:5000${selectedRequest.personalInfo.cinProof}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-[#07447d] hover:underline"
                        >
                          Preuve CIN
                        </a>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                      <div className="flex items-center">
                        <div className="bg-white p-1 rounded-full mr-1 shadow-sm">
                          <Mail className="h-3 w-3 text-[#07447d]" />
                        </div>
                        <span>{selectedRequest.personalInfo.email}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-white p-1 rounded-full mr-1 shadow-sm">
                          <Phone className="h-3 w-3 text-[#07447d]" />
                        </div>
                        <span>{selectedRequest.personalInfo.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-white p-1 rounded-full mr-1 shadow-sm">
                          <MapPin className="h-3 w-3 text-[#07447d]" />
                        </div>
                        <span>{selectedRequest.personalInfo.address}, {selectedRequest.personalInfo.city}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-white p-1 rounded-full mr-1 shadow-sm">
                          <Info className="h-3 w-3 text-[#07447d]" />
                        </div>
                        <span>{selectedRequest.personalInfo.profession} - {selectedRequest.personalInfo.organization}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Tab */}
                {activeTab === 'message' && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 shadow-sm">
                    <div className="flex items-start">
                      <div className="bg-white p-1.5 rounded-full mr-2 shadow-sm">
                        <MessageSquare className="h-3.5 w-3.5 text-[#07447d]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-700 whitespace-pre-line">{selectedRequest.message || "Aucun message"}</p>
                        {selectedRequest.messageFile && (
                          <div className="mt-2 flex items-center">
                            <div className="bg-white p-1 rounded-full mr-1 shadow-sm">
                              <Paperclip className="h-3 w-3 text-[#07447d]" />
                            </div>
                            <a 
                              href={`http://localhost:5000${selectedRequest.messageFile}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-[#07447d] hover:underline"
                            >
                              Pièce jointe
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedRequest.status === "pending" && (
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => handleReject(selectedRequest._id)}
                    disabled={loading}
                    className="px-3 py-1.5 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Refuser
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest._id)}
                    disabled={loading}
                    className="px-3 py-1.5 bg-[#07447d] text-white rounded-lg hover:bg-[#063a6a] transition-colors flex items-center text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Approuver
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;