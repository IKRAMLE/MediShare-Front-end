import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { Package, Edit, Trash2, Plus, Compass, User, Heart, Settings, MessageSquare, ClipboardList } from "lucide-react";
import DashboardHeader from "../Components/DashboardHeader";
import Sidebar from "../Components/Sidebar";

const API_URL = 'http://localhost:5000'; 

const MyEquipmentPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const menuItems = [
    { icon: Compass, text: "Tableau de bord", path: "/dashboard" },
    { icon: Package, text: "Mon Équipement", path: "/my-equipment" },
    { icon: ClipboardList, text: "Demandes", path: "/requests" },
    { icon: MessageSquare, text: "Messages", path: "/chat" },
    { icon: Heart, text: "Favoris", path: "/favorites" },
    { icon: User, text: "Profil", path: "/profile" },
    { icon: Settings, text: "Paramètres", path: "/settings" },
  ];


  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
    } else {
      navigate("/login2");
    }
  }, [navigate]);

  useEffect(() => {
    if (userData && userData.id) {
      fetchEquipment();
    }
  }, [userData]);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const userId = userData.id;
      if (!userId) {
        throw new Error("User ID not found");
      }

      console.log("Fetching equipment for user:", userId);
      const response = await axiosInstance.get('/equipment');
      console.log("Raw API response:", response.data);
      
      // Add full URLs to images
      const userEquipment = response.data.data
        .filter(item => item.userId === userId)
        .map(item => ({
          ...item,
          image: item.image && !item.image.startsWith('http') ? `${API_URL}${item.image}` : item.image
        }));
      
      console.log("Processed equipment data:", userEquipment);
      setEquipment(userEquipment);
      setError(null);
    } catch (err) {
      console.error("Error fetching equipment:", err);
      setError("Échec du chargement des données. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login2");
  };

  const handleAddEquipment = () => {
    navigate("/dashboard");
  };

  const handleEditEquipment = (item) => {
    navigate("/dashboard", { state: { editEquipment: item } });
  };

  const handleDeleteClick = (item) => {
    navigate("/dashboard", { state: { deleteEquipment: item } });
  };

  const handleViewDetails = (item) => {
    console.log("Clicked item:", item);
    console.log("Item ID:", item._id);
    console.log("Full item data:", JSON.stringify(item, null, 2));
    
    if (item && item._id) {
      const url = `/equipment/${item._id}`;
      console.log("Navigating to:", url);
      navigate(url);
    } else {
      console.error("Invalid equipment item:", item);
    }
  };

  // Filter equipment based on search query
  const filteredEquipment = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (availability) => {
    switch (availability) {
      case 'available':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'not-available':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (availability) => {
    switch (availability) {
      case 'available':
        return 'Disponible';
      case 'pending':
        return 'En attente';
      case 'not-available':
        return 'Non disponible';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f7ff]">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        menuItems={menuItems}
        activeMenuItem="/my-equipment"
        handleMenuClick={handleMenuClick}
        handleLogout={handleLogout}
      />

      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userData={userData}
          handleLogout={handleLogout}
        />

        <main className="p-8">
          <div className="bg-[#e0f0fe] shadow-sm p-6 mb-8 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#084b88]">
                  Mon Équipement
                </h2>
                <p className="text-md text-[#108de4] mt-1">
                  Gérez vos annonces d'équipement médical
                </p>
              </div>
              <button
                onClick={handleAddEquipment}
                className="bg-[#0070cc] hover:bg-[#0058a6] text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Ajouter Nouvel Équipement
              </button>
            </div>

            {loading && (
              <div className="bg-white rounded-lg p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0070cc] mx-auto"></div>
                <p className="text-center mt-4 text-[#108de4]">Chargement de vos équipements...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p className="font-medium">Une erreur est survenue</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && filteredEquipment.length === 0 ? (
              <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm">
                <div className="rounded-full p-4 bg-[#e0f0fe] text-[#0070cc] mx-auto w-20 h-20 flex items-center justify-center mb-4">
                  <Package size={40} />
                </div>
                <h3 className="font-semibold text-lg text-[#084b88] mb-2">
                  Aucun équipement trouvé
                </h3>
                <p className="text-[#108de4] mb-6 max-w-md mx-auto">
                  Vous n'avez pas encore ajouté d'équipement médical. Ajoutez votre premier article pour commencer à le louer.
                </p>
                <button
                  onClick={handleAddEquipment}
                  className="bg-[#0070cc] hover:bg-[#0058a6] text-white px-6 py-3 rounded-lg flex items-center mx-auto"
                >
                  <Plus size={20} className="mr-2" />
                  Ajouter Votre Premier Équipement
                </button>
              </div>
            ) : !loading && !error && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Équipement
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Catégorie
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Période
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          État
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ville
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEquipment.map((item) => (
                        <tr 
                          key={item._id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleViewDetails(item)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {item.image ? (
                                  <img
                                    className="h-10 w-10 rounded-lg object-cover"
                                    src={item.image}
                                    alt={item.name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-lg bg-[#f0f7ff] flex items-center justify-center">
                                    <Package size={20} className="text-[#0070cc]" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.price} MAD</div>
                            <div className="text-xs text-gray-500">
                              Par {item.rentalPeriod === 'day' ? 'jour' : 
                                  item.rentalPeriod === 'week' ? 'semaine' : 'mois'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.rentalPeriod === 'day' ? 'Jour' : 
                             item.rentalPeriod === 'week' ? 'Semaine' : 'Mois'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.condition}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.availability)}`}>
                              {getStatusText(item.availability)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditEquipment(item)
                                }}
                                className="p-1.5 bg-[#e0f0fe] text-[#0070cc] rounded-lg hover:bg-[#0070cc] hover:text-white transition-colors"
                                title="Modifier"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(item)
                                }}
                                className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
                              </button>
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
        </main>
      </div>
    </div>
  );
};

export default MyEquipmentPage;