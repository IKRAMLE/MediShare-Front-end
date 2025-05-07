import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { User, Settings as SettingsIcon, Package, LogOut, Save, Compass, Heart, ClipboardList } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const Settings = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notifyNewRentals: true,
    notifyMessages: true,
    notifyUpdates: false,
    darkMode: false
  });
  
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(true);
      setUserData(parsedUser);
      setFormData(prev => ({
        ...prev,
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        darkMode: parsedUser.settings?.darkMode || false,
        notifyNewRentals: parsedUser.settings?.notifyNewRentals ?? true,
        notifyMessages: parsedUser.settings?.notifyMessages ?? true,
        notifyUpdates: parsedUser.settings?.notifyUpdates ?? false
      }));
    } else {
      navigate('/login2');
      showNotification("Authentification requise. Veuillez vous connecter pour accéder aux paramètres", "error");
    }
  }, [navigate]);

  useEffect(() => {
    // Apply dark mode
    if (formData.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [formData.darkMode]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    showNotification("Vous avez été déconnecté avec succès", "success");
    navigate('/login2');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    if (formData.phone && !/^[0-9+\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Le numéro de téléphone n'est pas valide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification("Veuillez corriger les erreurs dans le formulaire", "error");
      return;
    }

    try {
      // Update user data in localStorage
      if (userData) {
        const updatedUser = {
          ...userData,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          settings: {
            notifyNewRentals: formData.notifyNewRentals,
            notifyMessages: formData.notifyMessages,
            notifyUpdates: formData.notifyUpdates,
            darkMode: formData.darkMode
          }
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        showNotification("Vos paramètres ont été mis à jour avec succès", "success");
      }
    } catch (error) {
      showNotification("Une erreur est survenue lors de la mise à jour des paramètres", "error");
      console.error('Error updating settings:', error);
    }
  };

  const menuItems = [
    { icon: Compass, text: "Tableau de bord", path: "/dashboard" },
    { icon: Package, text: "Location d'équipement", path: "/rent-equip" },
    { icon: ClipboardList, text: "Demandes", path: "/requests" },
    { icon: Heart, text: "Favoris", path: "/favorites" },
    { icon: User, text: "Profil", path: "/profile" },
    { icon: SettingsIcon, text: "Paramètres", path: "/settings" },
  ];

  if (!isLoggedIn || !userData) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col mt-10">
      <Header/>
      
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
      
      <div className="flex-grow py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#f0f7ff] dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex flex-col items-center mb-8">
                <div className="h-24 w-24 rounded-full bg-[#108de4] flex items-center justify-center text-white text-3xl mb-4">
                  <User size={40} />
                </div>
                <h2 className="text-xl font-bold text-[#084b88] dark:text-white">{userData.email}</h2>
                <p className="text-[#0070cc] dark:text-blue-400">Membre depuis {new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg text-[#0070cc] hover:bg-[#f0f7ff] transition-colors ${
                      item.path === '/settings' ? 'bg-[#f0f7ff] dark:bg-gray-700' : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.text}
                  </Link>
                ))}
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center p-3 rounded-lg text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Déconnexion
                </button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-[#084b88] dark:text-white mb-6">Paramètres du Compte</h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-[#0070cc] dark:text-blue-400 mb-4">Informations du Profil</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom Complet</label>
                        <input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange}
                          placeholder="Votre nom complet"
                          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#108de4] focus:border-[#108de4] dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Adresse Email</label>
                        <input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange}
                          placeholder="Votre adresse email"
                          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#108de4] focus:border-[#108de4] dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Numéro de Téléphone</label>
                        <input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange}
                          placeholder="Votre numéro de téléphone"
                          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#108de4] focus:border-[#108de4] dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>
                </div>
                
                <hr className="border-t border-gray-200 dark:border-gray-700" />
                
                <div>
                  <h2 className="text-xl font-semibold text-[#0070cc] dark:text-blue-400 mb-4">Préférences de Notification</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[#084b88] dark:text-white font-medium">Nouvelles Demandes de Location</h3>
                        <p className="text-[#108de4] dark:text-blue-400 text-sm">Recevoir des notifications lorsque quelqu'un demande votre équipement</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.notifyNewRentals}
                          onChange={(e) => handleSwitchChange('notifyNewRentals', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#bae0fd] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#108de4] dark:border-gray-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[#084b88] dark:text-white font-medium">Nouveaux Messages</h3>
                        <p className="text-[#108de4] dark:text-blue-400 text-sm">Être notifié lorsque vous recevez de nouveaux messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.notifyMessages}
                          onChange={(e) => handleSwitchChange('notifyMessages', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#bae0fd] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#108de4] dark:border-gray-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[#084b88] dark:text-white font-medium">Mises à Jour de la Plateforme</h3>
                        <p className="text-[#108de4] dark:text-blue-400 text-sm">Restez informé des nouvelles fonctionnalités et mises à jour</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.notifyUpdates}
                          onChange={(e) => handleSwitchChange('notifyUpdates', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#bae0fd] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#108de4] dark:border-gray-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <hr className="border-t border-gray-200 dark:border-gray-700" />
                
                <div>
                  <h2 className="text-xl font-semibold text-[#0070cc] dark:text-blue-400 mb-4">Apparence</h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[#084b88] dark:text-white font-medium">Mode Sombre</h3>
                      <p className="text-[#108de4] dark:text-blue-400 text-sm">Activer le thème sombre pour l'interface</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.darkMode}
                        onChange={(e) => handleSwitchChange('darkMode', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#bae0fd] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#108de4] dark:border-gray-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#108de4] hover:bg-[#084b88] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#108de4]"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Settings;