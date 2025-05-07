import { useState, useEffect } from "react";
import { Package, DollarSign, MapPin, Calendar, Tag, Image as ImageIcon, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EquipmentModal = ({ isOpen, onClose, onSave, equipment = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    rentalPeriod: 'day',
    condition: '',
    location: '',
    image: '',
    availability: 'available',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (equipment && isEditing) {
      setFormData({
        name: equipment.name || '',
        description: equipment.description || '',
        category: equipment.category || '',
        price: equipment.price || '',
        rentalPeriod: equipment.rentalPeriod || 'day',
        condition: equipment.condition || '',
        location: equipment.location || '',
        image: equipment.image || '',
        availability: equipment.availability || 'available',
        status: equipment.status || 'active'
      });
      setImagePreview(equipment.image || '');
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        rentalPeriod: 'day',
        condition: '',
        location: '',
        image: '',
        availability: 'available',
        status: 'active'
      });
      setImagePreview('');
    }
    setErrors({});
  }, [equipment, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.condition.trim()) {
      newErrors.condition = 'Condition is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!isEditing && !formData.image) {
      newErrors.image = 'Image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key] instanceof File) {
          formDataToSend.append('image', formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      await onSave(formDataToSend);
      onClose();
    } catch (error) {
      console.error('Error saving equipment:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to save equipment' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Package className="mr-2 h-5 w-5" />
                {isEditing ? 'Edit Equipment' : 'Add New Equipment'}
              </h2>
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('basic')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'basic'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Details
              </button>
            </div>
            
            {/* Error Message */}
            <AnimatePresence>
              {errors.submit && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 p-3 text-red-600 dark:text-red-400 text-sm flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  {errors.submit}
                </motion.div>
              )}
            </AnimatePresence>
            
            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Info Tab */}
              <AnimatePresence mode="wait">
                {activeTab === 'basic' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Equipment Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Package className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Enter equipment name"
                          />
                        </div>
                        <AnimatePresence>
                          {errors.name && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-sm text-red-500 mt-1"
                            >
                              {errors.name}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Category
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Tag className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.category ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Enter category"
                          />
                        </div>
                        <AnimatePresence>
                          {errors.category && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-sm text-red-500 mt-1"
                            >
                              {errors.category}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Enter equipment description"
                      />
                      <AnimatePresence>
                        {errors.description && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-red-500 mt-1"
                          >
                            {errors.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="space-y-1">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Equipment Image {isEditing ? '(leave empty to keep current)' : ''}
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                        <div className="space-y-1 text-center">
                          {imagePreview ? (
                            <div className="relative">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="mx-auto h-32 w-auto object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview('');
                                  setFormData(prev => ({ ...prev, image: '' }));
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <>
                              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label
                                  htmlFor="image-upload"
                                  className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="image-upload"
                                    name="image"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <AnimatePresence>
                        {errors.image && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-red-500 mt-1"
                          >
                            {errors.image}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Details Tab */}
              <AnimatePresence mode="wait">
                {activeTab === 'details' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Price
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.price ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        <AnimatePresence>
                          {errors.price && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-sm text-red-500 mt-1"
                            >
                              {errors.price}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="rentalPeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Rental Period
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-gray-400" />
                          </div>
                          <select
                            id="rentalPeriod"
                            name="rentalPeriod"
                            value={formData.rentalPeriod}
                            onChange={handleChange}
                            className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="day">Per Day</option>
                            <option value="month">Per Month</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Condition
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Tag className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="condition"
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.condition ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Enter condition"
                          />
                        </div>
                        <AnimatePresence>
                          {errors.condition && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-sm text-red-500 mt-1"
                            >
                              {errors.condition}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Location
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.location ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Enter location"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.location && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-red-500 mt-1"
                          >
                            {errors.location}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="availability" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Availability
                        </label>
                        <select
                          id="availability"
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="available">Available</option>
                          <option value="not-available">Not Available</option>
                        </select>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    'Save Equipment'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EquipmentModal; 