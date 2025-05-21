import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { ArrowLeft, Package, MapPin, Calendar, Tag, Star, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = 'https://medishare-back-end-production.up.railway.app';

const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRenting, setIsRenting] = useState(false);

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching equipment with ID:", id);
        const response = await axiosInstance.get(`/equipment/${id}`);
        console.log("Equipment details API response:", response);
        
        let equipmentData;
        if (response.data.data) {
          equipmentData = response.data.data;
        } else if (response.data) {
          equipmentData = response.data;
        } else {
          throw new Error("Invalid response format");
        }
        
        // Handle image URL
        if (equipmentData.image) {
          if (equipmentData.image.startsWith('http')) {
            setSelectedImage(equipmentData.image);
          } else if (equipmentData.image.startsWith('/uploads/')) {
            setSelectedImage(`${API_URL}${equipmentData.image}`);
          } else {
            setSelectedImage(`${API_URL}/uploads/${equipmentData.image}`);
          }
        }
        
        console.log("Processed equipment data:", equipmentData);
        setEquipment(equipmentData);
      } catch (error) {
        console.error("Error fetching equipment details:", error);
        setError("Impossible de charger les détails de l'équipement. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log("Starting fetch for equipment ID:", id);
      fetchEquipmentDetails();
    } else {
      console.error("No equipment ID provided");
      setError("ID d'équipement manquant");
      setLoading(false);
    }
  }, [id]);

  const handleRent = async () => {
    try {
      setIsRenting(true);
      const response = await axiosInstance.post('/rentals', {
        equipmentId: id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      });

      if (response.data.success) {
        navigate('/rentals');
      } else {
        setError("Impossible de louer l'équipement. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Error renting equipment:", error);
      if (error.response?.status === 401) {
        navigate('/login2');
      } else {
        setError("Une erreur est survenue lors de la location. Veuillez réessayer.");
      }
    } finally {
      setIsRenting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl max-w-md mx-auto">
          <div className="text-blue-500 mb-4">
            <Shield className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-900 text-xl font-medium mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="inline-block mr-2 h-5 w-5" />
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl max-w-md mx-auto">
          <Package className="h-16 w-16 mx-auto text-blue-400 mb-4" />
          <p className="text-xl text-gray-900 font-medium mb-6">Équipement non trouvé</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="inline-block mr-2 h-5 w-5" />
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200 group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="font-medium">Retour</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="relative h-[500px] lg:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-transparent z-10" />
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Package className="h-20 w-20 text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-4 left-4 z-20">
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-500/90 text-white backdrop-blur-sm shadow-lg">
                  {equipment.category}
                </span>
              </div>
            </div>

            {/* Equipment Details */}
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{equipment.name}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <MapPin className="text-gray-500 mr-1" size={18} />
                      <span className="text-gray-600">{equipment.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="text-yellow-400 fill-yellow-400 mr-1" size={18} />
                      <span className="text-gray-600">{equipment.rating || 'Nouveau'}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed">{equipment.description}</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Spécifications</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-500">État</p>
                      <p className="font-medium text-gray-900">{equipment.condition}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-500">Disponibilité</p>
                      <p className="font-medium text-gray-900">{equipment.availability}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Prix par jour</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        {equipment.price} MAD
                      </p>
                    </div>
                    <button
                      onClick={handleRent}
                      disabled={isRenting || equipment.availability !== 'available'}
                      className={`px-6 py-3 rounded-full text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                        isRenting || equipment.availability !== 'available'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                      }`}
                    >
                      {isRenting ? 'Location en cours...' : 'Louer maintenant'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EquipmentDetails;
