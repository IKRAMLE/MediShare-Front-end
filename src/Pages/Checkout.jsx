import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, Truck, Phone, AlertCircle, Upload, ArrowLeft, User, Mail, IdCard, MapPin, MessageSquare, Info, Paperclip, Send } from 'lucide-react';
import axiosInstance from "../utils/axiosConfig";

const paymentMethods = [
  {
    id: 'bank',
    name: 'Virement Bancaire',
    description: 'Transfert direct vers notre compte bancaire'
  },
  {
    id: 'wafacash',
    name: 'Wafacash',
    description: 'Paiement via Wafacash'
  },
  {
    id: 'cashplus',
    name: 'CashPlus',
    description: 'Paiement via CashPlus'
  }
];

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [rentalDates, setRentalDates] = useState({});
  const [customPeriods, setCustomPeriods] = useState({});
  const [periodTypes, setPeriodTypes] = useState({});
  const [showOwnerContact, setShowOwnerContact] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [total, setTotal] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [receiptFile, setReceiptFile] = useState(null);
  const [cinFile, setCinFile] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cin: '',
    address: '',
    city: '',
    phone: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageFile, setMessageFile] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [messageSuccess, setMessageSuccess] = useState(false);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      const itemsWithDetails = await Promise.all(
        cart.map(async (item) => {
          const response = await axiosInstance.get(`/equipment/${item.id}`);
          return {
            ...response.data.data,
            quantity: item.quantity,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
          };
        })
      );

      setCartItems(itemsWithDetails);
      
      // Initialize rental dates
      const dates = {};
      itemsWithDetails.forEach(item => {
        dates[item._id] = {
          startDate: item.startDate,
          endDate: item.endDate
        };
      });
      setRentalDates(dates);
      
      // Calculate total after setting the dates
      setTimeout(() => {
        calculateTotal(itemsWithDetails, dates);
      }, 0);
    } catch (error) {
      console.error('Error loading cart items:', error);
      setError('Erreur lors du chargement du panier');
    } finally {
      setLoading(false);
    }
  };

  const calculateMonths = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  const calculateItemTotal = (item) => {
    if (!rentalDates[item._id]) {
      // Initialize dates if they don't exist
      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
      setRentalDates(prev => ({
        ...prev,
        [item._id]: {
          startDate: today,
          endDate: nextMonth
        }
      }));
      return item.price * item.quantity; // Return price for one month initially
    }
    
    const dates = rentalDates[item._id];
    const months = calculateMonths(dates.startDate, dates.endDate);
    const basePrice = item.price * item.quantity;
    return basePrice * months;
  };

  const calculateDeposit = (item) => {
    const basePrice = item.price * item.quantity;
    return basePrice * 0.7; 
  };

  const getPeriodText = (item) => {
    const periodType = periodTypes[item._id] || item.rentalPeriod || 'day';
    return periodType === 'month' ? 'mois' : 'jour';
  };

  const handleDateChange = (itemId, dateType, value) => {
    setRentalDates(prev => {
      const updated = {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [dateType]: value
        }
      };
      calculateTotal(cartItems, updated);
      return updated;
    });
  };

  const handlePeriodChange = (itemId, days) => {
    setRentalDates(prev => {
      const updated = { ...prev, [itemId]: { ...prev[itemId], endDate: prev[itemId].startDate } };
      calculateTotal(cartItems, updated);
      return updated;
    });
  };

  const handlePeriodTypeChange = (itemId, type) => {
    setPeriodTypes(prev => ({ ...prev, [itemId]: type }));
    
    // Convert current value to days based on new type
    const currentValue = customPeriods[itemId] || 1;
    let days;
    if (type === 'month') {
      days = currentValue * 30;
    } else {
      days = currentValue;
    }
    handlePeriodChange(itemId, days);
  };

  const handleCustomPeriodChange = (itemId, value) => {
    const numValue = parseInt(value) || 1;
    setCustomPeriods(prev => ({ ...prev, [itemId]: numValue }));
    
    // Convert to days based on period type
    let days;
    if (periodTypes[itemId] === 'month') {
      days = numValue * 30;
    } else {
      days = numValue;
    }
    handlePeriodChange(itemId, days);
  };

  const getDiscountText = (days) => {
    const discount = calculateDiscount(days);
    if (discount > 0) {
      return `(-${discount * 100}% de réduction)`;
    }
    return '';
  };

  const calculateTotal = (items = cartItems, dates = rentalDates) => {
    if (!items.length) return;
    
    const sum = items.reduce((acc, item) => {
      const itemTotal = calculateItemTotal(item);
      return acc + (itemTotal || 0);
    }, 0);
    
    setTotal(sum);
    setDeposit(sum * 0.7); // 70% deposit
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCinUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setFieldErrors(prev => ({
          ...prev,
          cinFile: 'Le fichier ne doit pas dépasser 5MB'
        }));
        return;
      }
      setCinFile(file);
      // Clear error when file is uploaded
      if (fieldErrors.cinFile) {
        setFieldErrors(prev => ({
          ...prev,
          cinFile: ''
        }));
      }
    }
  };

  const validatePersonalInfo = () => {
    const errors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'cin', 'address', 'city', 'phone'];
    
    requiredFields.forEach(field => {
      if (!personalInfo[field]) {
        errors[field] = 'Ce champ est obligatoire';
      }
    });

    if (!cinFile) {
      errors.cinFile = 'Le document CIN est obligatoire';
    }

    // Validate email format
    if (personalInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      errors.email = 'Veuillez entrer une adresse email valide';
    }

    // Validate phone number format
    if (personalInfo.phone && !/^[0-9]{10}$/.test(personalInfo.phone)) {
      errors.phone = 'Veuillez entrer un numéro de téléphone valide (10 chiffres)';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleMessageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMessageFile(file);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setMessageError('Veuillez entrer un message');
      return;
    }

    try {
      setSendingMessage(true);
      setMessageError(null);

      // Create FormData for message
      const formData = new FormData();
      formData.append('message', message);
      if (messageFile) {
        formData.append('file', messageFile);
      }

      // Get the first item's owner ID
      if (cartItems.length > 0) {
        formData.append('ownerId', cartItems[0].userId);
      }

      // Send message to backend
      const response = await axiosInstance.post('/chat/message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessageSuccess(true);
        setMessage('');
        setMessageFile(null);
      } else {
        setMessageError(response.data.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessageError('Erreur lors de l\'envoi du message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleConfirmOrder = async () => {
    // Validate personal information
    if (!validatePersonalInfo()) {
      return;
    }

    if (!selectedPayment) {
      setError('Veuillez sélectionner un mode de paiement');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare order data
      const orderData = {
        items: cartItems.map(item => {
          const months = calculateMonths(rentalDates[item._id].startDate, rentalDates[item._id].endDate);
          const itemTotal = calculateItemTotal(item);
          const itemDeposit = calculateDeposit(item);
          
          return {
            equipmentId: item._id,
            quantity: item.quantity,
            startDate: rentalDates[item._id].startDate,
            endDate: rentalDates[item._id].endDate,
            rentalDays: months, // Nombre de mois
            rentalPeriod: 'month', // Type de période fixé à 'month'
            price: itemTotal + itemDeposit // Prix total incluant le dépôt
          };
        }),
        paymentMethod: selectedPayment,
        totalAmount: Number(total + deposit), // Conversion explicite en nombre
        deposit: Number(deposit), // Conversion explicite en nombre
        personalInfo,
        message: message || "Aucun message"
      };

      // Create FormData for file upload
      const formData = new FormData();
      if (messageFile) {
        formData.append('messageFile', messageFile);
      }
      if (cinFile) {
        formData.append('cinFile', cinFile);
      }
      formData.append('orderData', JSON.stringify(orderData));

      // Submit order to backend
      const response = await axiosInstance.post('/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Clear cart
        localStorage.removeItem('cart');
        
        // Get owner details for the first item (assuming all items are from the same owner)
        if (response.data.data && response.data.data.length > 0) {
          const order = response.data.data[0];
          try {
            const ownerResponse = await axiosInstance.get(`/user/${order.ownerId}`);
            if (ownerResponse.data.success) {
              setOwnerDetails(ownerResponse.data.data);
            }
          } catch (ownerErr) {
            console.error('Error fetching owner details:', ownerErr);
          }
        }
        
        // Show success message
        setShowOwnerContact(true);
        
        // Redirect to home page after 5 seconds
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } else {
        setError(response.data.message || 'Erreur lors de la création de la commande');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      if (err.response) {
        // Handle specific error messages from the backend
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response.status === 400) {
          setError('Données de commande invalides. Veuillez vérifier vos informations.');
        } else if (err.response.status === 500) {
          setError('Erreur serveur. Veuillez réessayer plus tard.');
        } else {
          setError('Erreur lors de la création de la commande');
        }
      } else if (err.request) {
        // Network error
        setError('Erreur de connexion. Veuillez vérifier votre connexion internet.');
      } else {
        setError('Erreur lors de la création de la commande');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0070cc]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] p-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-center text-[#0070cc]">
            <AlertCircle className="h-12 w-12" />
          </div>
          <p className="text-center mt-4 text-[#084b88]">{error}</p>
        </div>
      </div>
    );
  }

  if (showOwnerContact && ownerDetails) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#084b88] mb-6">Commande Confirmée</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">
              Votre commande a été confirmée avec succès. Contactez le propriétaire pour finaliser la location.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#084b88] flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Coordonnées du Propriétaire
            </h3>
            
            <div className="bg-[#f0f7ff] rounded-lg p-4">
              <p className="font-medium text-[#084b88]">{ownerDetails.name}</p>
              <p className="text-[#0070cc]">{ownerDetails.phone}</p>
              <p className="text-[#4e4942] mt-2">{ownerDetails.email}</p>
            </div>

            <div className="mt-6 text-sm text-[#7d7469]">
              <p>* Veuillez contacter le propriétaire pour:</p>
              <ul className="list-disc ml-5 mt-2">
                <li>Confirmer la disponibilité aux dates souhaitées</li>
                <li>Organiser la livraison ou le retrait</li>
                <li>Finaliser le paiement selon la méthode choisie</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f7ff] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#084b88] hover:text-[#0070cc] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-[#084b88]">Finalisation de la Commande</h1>
          <div className="w-20"></div> {/* Empty div for spacing */}
        </div>

        {/* Personal Information Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informations Personnelles
            </h2>
            <p className="text-blue-100 text-sm mt-1">Veuillez remplir vos informations pour finaliser la commande</p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    Informations de Base
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={personalInfo.firstName}
                        onChange={handlePersonalInfoChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          fieldErrors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        required
                        placeholder="Entrez votre prénom"
                      />
                      {fieldErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {fieldErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={personalInfo.lastName}
                        onChange={handlePersonalInfoChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          fieldErrors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        required
                        placeholder="Entrez votre nom"
                      />
                      {fieldErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {fieldErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Contact
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        required
                        placeholder="votre@email.com"
                      />
                      {fieldErrors.email && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          fieldErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        required
                        pattern="[0-9]{10}"
                        placeholder="06XXXXXXXX"
                      />
                      {fieldErrors.phone && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <IdCard className="h-4 w-4 mr-2 text-blue-600" />
                    Identité
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        CIN <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cin"
                        value={personalInfo.cin}
                        onChange={handlePersonalInfoChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          fieldErrors.cin ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        required
                        placeholder="Entrez votre numéro CIN"
                      />
                      {fieldErrors.cin && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {fieldErrors.cin}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Document CIN <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                          <Upload className="h-5 w-5 mr-2" />
                          <span>Choisir un fichier</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleCinUpload}
                            className="hidden"
                          />
                        </label>
                        {cinFile && (
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            {cinFile.name}
                          </div>
                        )}
                      </div>
                      {fieldErrors.cinFile && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {fieldErrors.cinFile}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Formats acceptés : JPG, PNG, PDF. Taille maximale : 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                    Adresse
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Adresse <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={personalInfo.address}
                        onChange={handlePersonalInfoChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          fieldErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        required
                        placeholder="Entrez votre adresse complète"
                      />
                      {fieldErrors.address && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {fieldErrors.address}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Ville <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={personalInfo.city}
                        onChange={handlePersonalInfoChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          fieldErrors.city ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        required
                        placeholder="Entrez votre ville"
                      />
                      {fieldErrors.city && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {fieldErrors.city}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Required Fields Note */}
            <div className="mt-6 text-sm text-gray-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
              <span>Les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires</span>
            </div>
          </div>
        </div>

        {/* Equipment Summary */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Récapitulatif de la Location
            </h2>
            <p className="text-blue-100 text-sm mt-1">Vérifiez les détails de votre location</p>
          </div>

          {/* Summary Content */}
          <div className="p-6">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <div className="flex items-start gap-6">
                    {/* Equipment Image */}
                    <div className="relative">
                      <img
                        src={`https://medishare-back-end-production.up.railway.app${item.image}`}
                        alt={item.name}
                        className="w-32 h-32 rounded-xl object-cover shadow-md"
                      />
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        x{item.quantity}
                      </div>
                    </div>

                    {/* Equipment Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Prix par mois</p>
                          <p className="text-lg font-semibold text-blue-600">{item.price} MAD</p>
                        </div>
                      </div>

                      {/* Rental Period Selection */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            <div className="flex items-center space-x-2">
                              <input
                                type="date"
                                name="startDate"
                                value={rentalDates[item._id].startDate}
                                onChange={(e) => handleDateChange(item._id, 'startDate', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-40 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <span className="text-gray-500">à</span>
                              <input
                                type="date"
                                name="endDate"
                                value={rentalDates[item._id].endDate}
                                onChange={(e) => handleDateChange(item._id, 'endDate', e.target.value)}
                                min={rentalDates[item._id].startDate}
                                className="w-40 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Durée: {calculateMonths(rentalDates[item._id].startDate, rentalDates[item._id].endDate)} mois</p>
                            <p className="text-lg font-semibold text-blue-600">{calculateItemTotal(item)} MAD</p>
                          </div>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-500 mb-1">Dépôt de garantie</p>
                          <p className="text-lg font-semibold text-blue-600">{calculateDeposit(item)} MAD</p>
                          <p className="text-xs text-gray-400 mt-1">70% du prix total</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-500 mb-1">Total à payer</p>
                          <p className="text-lg font-semibold text-blue-600">{calculateItemTotal(item) + calculateDeposit(item)} MAD</p>
                          <p className="text-xs text-gray-400 mt-1">Inclut le dépôt</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Méthode de Paiement
            </h2>
            <p className="text-blue-100 text-sm mt-1">Choisissez votre méthode de paiement préférée</p>
          </div>

          {/* Payment Methods Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    selectedPayment === method.id
                      ? 'ring-2 ring-blue-500 scale-[1.02]'
                      : 'hover:scale-[1.01]'
                  }`}
                >
                  <div className={`rounded-xl p-6 h-full ${
                    selectedPayment === method.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
                  }`}>
                    {/* Payment Method Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      selectedPayment === method.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-blue-500 group-hover:bg-blue-100'
                    }`}>
                      {method.id === 'bank' && <CreditCard className="h-6 w-6" />}
                      {method.id === 'wafacash' && <Truck className="h-6 w-6" />}
                      {method.id === 'cashplus' && <Phone className="h-6 w-6" />}
                    </div>

                    {/* Payment Method Name */}
                    <h3 className={`font-semibold mb-2 ${
                      selectedPayment === method.id
                        ? 'text-blue-700'
                        : 'text-gray-700 group-hover:text-blue-600'
                    }`}>
                      {method.name}
                    </h3>

                    {/* Payment Method Description */}
                    <p className="text-sm text-gray-500 mb-4">
                      {method.description}
                    </p>

                    {/* Selection Indicator */}
                    <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 group-hover:border-blue-300'
                    }`}>
                      {selectedPayment === method.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confirm Order Button */}
        <div className="flex justify-end">
          <button
            onClick={handleConfirmOrder}
            className="bg-[#0070cc] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#005fa3] transition-colors"
          >
            Confirmer la Commande
          </button>
        </div>
      </div>

      {showOwnerContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Commande créée avec succès!</h3>
              <p className="text-sm text-gray-500 mb-4">
                Votre commande a été enregistrée. Le propriétaire de l'équipement vous contactera bientôt pour confirmer la location.
              </p>
              
              {ownerDetails && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4 text-left">
                  <h4 className="font-medium text-blue-800 mb-2">Informations de contact du propriétaire:</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Nom:</span> {ownerDetails.firstName} {ownerDetails.lastName}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Email:</span> {ownerDetails.email}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Téléphone:</span> {ownerDetails.phone}
                    </p>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                Vous serez redirigé vers la page d'accueil dans quelques secondes...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
