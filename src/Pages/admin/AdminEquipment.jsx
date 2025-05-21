import AdminLayout from "../../layouts/AdminLayout";
import { useState, useEffect } from "react";
import { Filter, Search, Plus, Star, Edit, Trash, Eye, Loader2, Package, DollarSign, MapPin, Calendar, Tag, Image as ImageIcon, AlertCircle } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import EquipmentModal from "../../Components/EquipmentModal";

const Equipment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/equipment');
      if (response.data.success) {
        setEquipment(response.data.data);
        setFilteredEquipment(response.data.data);
      } else {
        setError('Failed to fetch equipment data');
      }
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError(err.response?.data?.message || 'Failed to fetch equipment data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(term, activeFilter);
  };

  const handleFilterChange = (filter) => {
    const newFilter = filter === activeFilter ? null : filter;
    setActiveFilter(newFilter);
    applyFilters(searchTerm, newFilter);
  };

  const applyFilters = (term, filter) => {
    let results = equipment;
    if (term.trim() !== "") {
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(term.toLowerCase()) ||
          item.category.toLowerCase().includes(term.toLowerCase()) ||
          item.location.toLowerCase().includes(term.toLowerCase())
      );
    }
    if (filter) {
      results = results.filter((item) => item.availability === filter);
    }
    setFilteredEquipment(results);
  };

  const handleAddEquipment = () => {
    setIsEditing(false);
    setSelectedEquipment(null);
    setIsModalOpen(true);
  };

  const handleEditEquipment = (item) => {
    setIsEditing(true);
    setSelectedEquipment(item);
    setIsModalOpen(true);
  };

  const handleDeleteEquipment = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        const response = await api.delete(`/equipment/${id}`);
        if (response.data.success) {
          toast.success('Equipment deleted successfully');
          fetchEquipment();
        } else {
          toast.error('Failed to delete equipment');
        }
      } catch (err) {
        console.error('Error deleting equipment:', err);
        toast.error(err.response?.data?.message || 'Failed to delete equipment');
      }
    }
  };

  const handleSaveEquipment = async (formData) => {
    try {
      if (isEditing) {
        // Update existing equipment
        const response = await api.put(`/equipment/${selectedEquipment._id}`, formData);
        if (response.data.success) {
          toast.success('Equipment updated successfully');
          fetchEquipment();
        } else {
          throw new Error('Failed to update equipment');
        }
      } else {
        // Create new equipment
        const response = await api.post('/equipment', formData);
        if (response.data.success) {
          toast.success('Equipment added successfully');
          fetchEquipment();
        } else {
          throw new Error('Failed to add equipment');
        }
      }
    } catch (err) {
      console.error('Error saving equipment:', err);
      throw err;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-red-600 text-center">
            <p className="text-lg font-semibold">{error}</p>
            <button 
              onClick={fetchEquipment}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0d4071]">Equipment Management</h1>
            <p className="text-[#0070cc]">Manage all equipment on the platform</p>
          </div>
          <button 
            onClick={handleAddEquipment}
            className="bg-[#108de4] hover:bg-[#0070cc] text-white px-4 py-2 rounded inline-flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Equipment
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search equipment..."
              className="pl-8 pr-4 py-2 border rounded bg-white w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["available", "not-available"].map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-3 py-1 rounded text-sm border ${
                  activeFilter === status
                    ? `text-white ${
                        status === "available"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
              >
                {status === "available" ? "Available" : "Not Available"}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment Table */}
        <div className="bg-white border rounded shadow">
          <div className="border-b px-4 py-3 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-semibold">Equipment</h2>
            <span className="text-sm text-gray-500">
              Total: {filteredEquipment.length} items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEquipment.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded overflow-hidden">
                        <img
                          src={item.image ? `http://localhost:5000${item.image}` : "https://via.placeholder.com/300"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${item.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.availability === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.availability === "available" ? "Available" : "Not Available"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditEquipment(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEquipment(item._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Equipment Modal */}
      <EquipmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEquipment}
        equipment={selectedEquipment}
        isEditing={isEditing}
      />
    </AdminLayout>
  );
};

export default Equipment;
