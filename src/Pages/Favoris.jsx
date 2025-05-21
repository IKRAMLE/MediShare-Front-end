import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Filter, AlertCircle, Compass, Package, ClipboardList, User, Settings, ChevronRight } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';
import Sidebar from '../Components/Sidebar';

const Favoris = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('/favorites');

  const menuItems = [
    { icon: Compass, text: "Tableau de bord", path: "/dashboard" },
    { icon: Package, text: "Location d'équipement", path: "/rent-equip" },
    { icon: ClipboardList, text: "Demandes", path: "/requests" },
    { icon: Heart, text: "Favoris", path: "/favorites" },
    { icon: User, text: "Profil", path: "/profile" },
    { icon: Settings, text: "Paramètres", path: "/settings" },
  ];

  const handleMenuClick = (path) => {
    setActiveMenuItem(path);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login2');
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/favorites');
      
      // Extract equipment data from favorites
      const favoriteEquipment = response.data.data
        .filter(fav => fav && fav.equipment)
        .map(fav => fav.equipment);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(
        favoriteEquipment
          .filter(item => item && item.category)
          .map(item => item.category)
      )];
      
      setCategories(['all', ...uniqueCategories]);
      setFavorites(favoriteEquipment);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        navigate('/login2');
      } else {
        setError('Impossible de charger les favoris');
      }
      
      setLoading(false);
    }
  };

  const removeFavorite = async (e, equipmentId) => {
    e.stopPropagation();
    try {
      await axiosInstance.delete(`/favorites/${equipmentId}`);
      setFavorites(prev => prev.filter(item => item._id !== equipmentId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        navigate('/login2');
      }
    }
  };

  const handleViewDetails = (item) => {
    navigate(`/equipment/${item._id}`);
  };

  const filteredFavorites = favorites.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        handleMenuClick={handleMenuClick}
        handleLogout={handleLogout}
      />

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Mes Favoris</h1>
              <p className="text-gray-600 mt-2">Gérez vos équipements préférés</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un équipement..."
                  className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {categories.length > 1 && (
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'Toutes les catégories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              <AlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <Heart className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-500 text-xl">Aucun favori trouvé</p>
              <p className="text-gray-400 mt-2">Commencez à ajouter des équipements à vos favoris</p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map(item => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div 
                      className="relative h-48 cursor-pointer group"
                      onClick={() => handleViewDetails(item)}
                    >
                      {item.image ? (
                        <img
                          src={`https://medishare-back-end-production.up.railway.app${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <button
                        onClick={(e) => removeFavorite(e, item._id)}
                        className="absolute top-2 right-2 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
                        aria-label="Remove from favorites"
                      >
                        <Heart className="text-red-500 fill-red-500" size={20} />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-2xl font-bold text-blue-600">{item.price}€/jour</p>
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Voir détails
                          <ChevronRight size={16} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};

export default Favoris;