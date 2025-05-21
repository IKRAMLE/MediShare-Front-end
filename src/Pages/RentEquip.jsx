import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import FiltringSidebar from '../Components/FiltringSidebar';
import axiosInstance from '../utils/axiosConfig';
import { Heart, AlertCircle } from 'lucide-react';

function RentEquip() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch equipment data from backend
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/equipment');
        setEquipment(response.data.data);
        setFilteredEquipment(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch equipment data');
        setLoading(false);
        console.error('Error fetching equipment:', err);
      }
    };

    fetchEquipment();
    
    // Only fetch favorites if user is authenticated
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    try {
      const response = await axiosInstance.get('/favorites');
      
      // Extract equipment IDs from the favorites data
      const favoriteIds = new Set(
        response.data.data
          .filter(fav => fav && fav.equipment && fav.equipment._id)
          .map(fav => fav.equipment._id)
      );
      
      setFavorites(favoriteIds);
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
      } else {
        console.error('Error fetching favorites:', error);
      }
    }
  };

  const toggleFavorite = async (e, item) => {
    e.stopPropagation();
    if (!item || !item._id) return; // Guard against invalid items
    
    if (!isAuthenticated) {
      setNotification({
        show: true,
        message: 'Veuillez vous connecter pour ajouter aux favoris',
        type: 'warning'
      });
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      return;
    }
    
    try {
      if (favorites.has(item._id)) {
        // Remove from favorites
        await axiosInstance.delete(`/favorites/${item._id}`);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(item._id);
          return newFavorites;
        });
      } else {
        // Add to favorites
        const response = await axiosInstance.post(`/favorites/${item._id}`);
        if (response.data.success) {
          setFavorites(prev => new Set([...prev, item._id]));
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
      } else {
        console.error('Error toggling favorite:', error);
      }
    }
  };

  const addToCart = (item) => {
    // Get existing cart items
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists
    const existingItem = existingCart.find(cartItem => cartItem.id === item._id);
    
    if (existingItem) {
      // Show notification that item is already in cart
      setNotification({
        show: true,
        message: 'Cet équipement est déjà dans votre panier',
        type: 'warning'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      
      return;
    }
    
    // Add new item with all necessary details
    const newCart = [...existingCart, {
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image ? `https://medishare-back-end-production.up.railway.app${item.image}` : '/api/placeholder/100/100',
      days: item.rentalPeriod === 'month' ? 30 : 7,
      rentalPeriod: item.rentalPeriod,
      quantity: 1,
      description: item.description,
      category: item.category,
      condition: item.condition
    }];
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Update cart count in header
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: newCart.length }));
    
    // Show success notification
    setNotification({
      show: true,
      message: 'Équipement ajouté au panier avec succès',
      type: 'success'
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleViewDetails = (item) => {
    if (item && item._id) {
      console.log("Navigating to equipment details:", item._id);
      navigate(`/equipment/${item._id}`);
    }
  };

  // Handle filter changes from sidebar
  const handleFilterChange = (filters) => {
    let filtered = [...equipment];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Filter by price range
    filtered = filtered.filter(item => 
      item.price >= filters.priceRange.min && 
      item.price <= filters.priceRange.max
    );

    // Filter by availability
    if (filters.availability) {
      filtered = filtered.filter(item => item.availability === filters.availability);
    }

    // Filter by condition
    if (filters.condition) {
      filtered = filtered.filter(item => item.condition === filters.condition);
    }

    // Sort items
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }

    setFilteredEquipment(filtered);
  };

  return (
    <>
      <Header />
      {notification.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`p-4 rounded-lg shadow-lg flex items-center ${
            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
          }`}>
            <AlertCircle className="mr-2" size={20} />
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row">
        <FiltringSidebar onFilterChange={handleFilterChange} />
        
        <main className="flex-1 p-5 mt-23 ml-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Rent Medical Equipment</h1>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded">
              {error}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600">{filteredEquipment.length} items found</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEquipment.map(item => (
                  <div key={item._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div 
                      className="h-48 overflow-hidden bg-gray-100 relative cursor-pointer"
                      onClick={() => handleViewDetails(item)}
                    >
                      {item.image ? (
                        <img 
                          src={`https://medishare-back-end-production.up.railway.app${item.image}`} 
                          alt={item.name} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(e, item);
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                        aria-label={favorites.has(item._id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart
                          size={20}
                          className={`${isAuthenticated && favorites.has(item._id) ? 'fill-red-500 stroke-red-500' : 'stroke-gray-500'}`}
                        />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <div 
                        className="cursor-pointer"
                        onClick={() => handleViewDetails(item)}
                      >
                        <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-blue-600 font-bold">
                          {item.price} DH/{item.rentalPeriod}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.availability === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.availability === 'available' ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 text-xs bg-gray-100 rounded">{item.category}</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 rounded">{item.condition}</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 rounded">{item.location}</span>
                      </div>
                      
                      <button 
                        onClick={() => addToCart(item)}
                        disabled={item.availability !== 'available'}
                        className={`w-full py-2 rounded transition-colors ${
                          item.availability === 'available'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {item.availability === 'available' ? 'Rent Now' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredEquipment.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">No equipment matches your filters</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default RentEquip;