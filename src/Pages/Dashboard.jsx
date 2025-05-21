import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { Compass, TrendingUp, User, Heart, Package, Settings, MessageSquare, ClipboardList } from "lucide-react";
import DashboardHeader from "../Components/DashboardHeader";
import Sidebar from "../Components/Sidebar";
import StatsCards from "../Components/StatsCards";
import MyEquipment from "../Components/MyEquipment";
import EquipmentForm from "../Components/EquipmentForm";
import DeleteConfirmationModal from "../Components/DeleteConfirmationModal";
import AuthenticationRequired from "../Components/AuthenticationRequired";

const API_URL = "https://medishare-back-end-production.up.railway.app/api";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("/dashboard");
  const [equipment, setEquipment] = useState([]);
  const [stats, setStats] = useState({
    totalEquipment: 0,
    active: 0,
    pending: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [currentEquipment, setCurrentEquipment] = useState(null);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    rentalPeriod: "day",
    condition: "",
    availability: "available",
    location: "",
    image: null,
  });

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
      fetchData();
    }
  }, [userData]);

  // Fetch equipment and stats from API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch equipment for the current user only
      const userId = userData.id; // Changed from _id to id to match the server response
      if (!userId) {
        throw new Error("User ID not found");
      }

      // Fetch equipment
      const equipmentRes = await axiosInstance.get('/equipment');
      const userEquipment = equipmentRes.data.data.filter(item => item.userId === userId);
      setEquipment(userEquipment);

      // For now, calculate stats based on filtered equipment
      const stats = {
        totalEquipment: userEquipment.length,
        active: userEquipment.filter(item => item.availability === 'available').length,
        pending: userEquipment.filter(item => item.availability === 'pending').length,
        revenue: userEquipment.reduce((acc, item) => acc + (item.price || 0), 0)
      };
      setStats(stats);

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        "Échec du chargement des données. Veuillez réessayer plus tard."
      );
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleAddEquipment = () => {
    setFormMode("add");
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      rentalPeriod: "day",
      condition: "",
      availability: "available",
      location: "",
      image: null,
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleEditEquipment = (item) => {
    setFormMode("edit");
    setCurrentEquipment(item);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      category: item.category || "",
      price: item.price || "",
      rentalPeriod: item.rentalPeriod || "day",
      condition: item.condition || "",
      availability: item.availability || "available",
      location: item.location || "",
      image: null,
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleDeleteClick = (item) => {
    setEquipmentToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!equipmentToDelete) return;

    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/equipment/${equipmentToDelete._id}`);
      
      if (response.status === 200) {
        // Remove deleted item from state
        setEquipment((prev) =>
          prev.filter((item) => item._id !== equipmentToDelete._id)
        );

        // Update stats
        setStats(prevStats => ({
          ...prevStats,
          totalEquipment: prevStats.totalEquipment - 1,
          active: equipmentToDelete.availability === 'available' 
            ? prevStats.active - 1 
            : prevStats.active,
          pending: equipmentToDelete.availability === 'pending'
            ? prevStats.pending - 1
            : prevStats.pending
        }));

        // Close modal and reset state
        setIsDeleteModalOpen(false);
        setEquipmentToDelete(null);
        setError(null);
      }
    } catch (err) {
      console.error("Error deleting equipment:", err);
      setError("Échec de la suppression de l'équipement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setEquipmentToDelete(null);
    setLoading(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key]);
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add userId to the form data
      formDataToSend.append('userId', userData.id);

      let response;
      if (formMode === "add") {
        response = await axiosInstance.post('/equipment', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.status === 201) {
          setEquipment(prev => [...prev, response.data.data]);
          updateStats('add', response.data.data);
        }
      } else {
        // Update existing equipment
        response = await axiosInstance.put(`/equipment/${currentEquipment._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.status === 200) {
          setEquipment(prev =>
            prev.map(item =>
              item._id === currentEquipment._id ? response.data.data : item
            )
          );
          updateStats('update', response.data.data, currentEquipment);
        }
      }

      // Reset form and close modal
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        rentalPeriod: "day",
        condition: "",
        availability: "available",
        location: "",
        image: null,
      });
      setShowAddForm(false);
      setShowEditForm(false);
      setCurrentEquipment(null);
      setError(null);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        formMode === "add"
          ? "Échec de l'ajout de l'équipement. Veuillez réessayer."
          : "Échec de la mise à jour de l'équipement. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (action, newData, oldData = null) => {
    setStats(prev => {
      const stats = { ...prev };
      
      if (action === 'add') {
        stats.totalEquipment++;
        if (newData.availability === 'available') stats.active++;
        if (newData.availability === 'pending') stats.pending++;
      } 
      else if (action === 'update') {
        if (oldData.availability !== newData.availability) {
          if (oldData.availability === 'available') stats.active--;
          if (oldData.availability === 'pending') stats.pending--;
          if (newData.availability === 'available') stats.active++;
          if (newData.availability === 'pending') stats.pending++;
        }
      }
      
      return stats;
    });
  };

  // Filter equipment based on search query
  const filteredEquipment = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show authentication check
  if (!authChecked || !isLoggedIn) {
    return <AuthenticationRequired isLoading={!authChecked} />;
  }

  return (
    <div className="flex h-screen bg-[#f0f7ff]">
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
          <StatsCards stats={stats} />
          <MyEquipment
            handleAddEquipment={handleAddEquipment}
            loading={loading}
            error={error}
            setError={setError}
            filteredEquipment={filteredEquipment}
            handleEditEquipment={handleEditEquipment}
            handleDeleteClick={handleDeleteClick}
          />
        </main>
      </div>

      {/* Add Equipment Form Modal */}
      {(showAddForm || showEditForm) && (
        <EquipmentForm
          formMode={formMode}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          loading={loading}
          currentEquipment={currentEquipment}
          handleImageChange={handleImageChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          equipmentToDelete={equipmentToDelete}
          loading={loading}
          confirmDelete={confirmDelete}
          cancelDelete={cancelDelete}
        />
      )}
    </div>
  );
};

export default Dashboard;