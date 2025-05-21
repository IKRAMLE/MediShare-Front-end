import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone, ArrowLeft } from 'lucide-react';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleReturn = () => {
    navigate('/');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Le nom complet est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    if (!formData.phone) newErrors.phone = 'Le numéro de téléphone est requis';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Les mots de passe doivent correspondre';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Vous devez accepter les termes et conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('https://medishare-back-end-production.up.railway.app/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          agreeTerms: formData.agreeTerms
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        
        if (!response.ok) {
          // Handle specific validation errors from server
          if (data.errors && Array.isArray(data.errors)) {
            const serverErrors = {};
            data.errors.forEach(error => {
              serverErrors[error.param] = error.msg;
            });
            setErrors(serverErrors);
            throw new Error('Veuillez corriger les erreurs dans le formulaire');
          } else {
            throw new Error(data.message || 'Erreur lors de la création du compte');
          }
        }
        
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        // Store user data if needed
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Show success message
        setSuccess(true);
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login2');
        }, 2000);
      } else {
        // Handle non-JSON response (likely an error page)
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Le serveur a rencontré une erreur. Veuillez réessayer plus tard.');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(prev => ({ 
        ...prev,
        submit: error.message || 'Une erreur est survenue lors de la création du compte'
      }));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#f0f7ff]">
        <div className="max-w-2xl mx-auto">
        <button
            onClick={handleReturn}
            className="flex items-center text-[#0070cc] hover:text-[#0058a6] -ml-40 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </button>
          <div className="bg-white shadow-xl rounded-2xl p-6">
            {success ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-600">Compte créé avec succès!</h2>
                <p className="mt-2 text-gray-600">Redirection vers la page de connexion...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-[#084b88]">Créez votre compte</h1>
                  <p className="mt-2 text-[#0070cc]">Rejoignez MediShare et commencez à partager du matériel médical</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {errors.submit}
                    </div>
                  )}
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-[#0058a6] mb-1">Nom complet</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-[#37aaf8]" />
                        </div>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          autoComplete="name"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border ${errors.fullName ? 'border-red-300' : 'border-[#bae0fd]'} rounded-lg focus:ring-2 focus:ring-[#108de4] focus:border-[#108de4] transition-colors text-[#084b88]`}
                          placeholder="Votre nom complet"
                        />
                      </div>
                      {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#0058a6] mb-1">Adresse email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-[#37aaf8]" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300' : 'border-[#bae0fd]'} rounded-lg focus:ring-2 focus:ring-[#108de4] focus:border-[#108de4] transition-colors text-[#084b88]`}
                          placeholder="Votre adresse email"
                        />
                      </div>
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-[#0058a6] mb-1">Numéro de téléphone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-[#37aaf8]" />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border ${errors.phone ? 'border-red-300' : 'border-[#bae0fd]'} rounded-lg focus:ring-2 focus:ring-[#108de4] focus:border-[#108de4] transition-colors text-[#084b88]`}
                          placeholder="Votre numéro de téléphone"
                        />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-[#0058a6] mb-1">Mot de passe</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-[#37aaf8]" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-300' : 'border-[#bae0fd]'} rounded-lg focus:ring-2 focus:ring-[#108de4] focus:border-[#108de4] transition-colors text-[#084b88]`}
                          placeholder="Créez un mot de passe"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? 
                            <EyeOff className="h-5 w-5 text-[#37aaf8]" /> : 
                            <Eye className="h-5 w-5 text-[#37aaf8]" />
                          }
                        </button>
                      </div>
                      {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0058a6] mb-1">Confirmer le mot de passe</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-[#37aaf8]" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-10 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-[#bae0fd]'} rounded-lg focus:ring-2 focus:ring-[#108de4] focus:border-[#108de4] transition-colors text-[#084b88]`}
                          placeholder="Confirmer votre mot de passe"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? 
                            <EyeOff className="h-5 w-5 text-[#37aaf8]" /> : 
                            <Eye className="h-5 w-5 text-[#37aaf8]" />
                          }
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="agreeTerms"
                          name="agreeTerms"
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="h-4 w-4 text-[#0070cc] focus:ring-[#108de4] border-[#7cc7fc] rounded"
                        />
                      </div>
                      <div className="ml-2 text-sm">
                        <label htmlFor="agreeTerms" className="font-medium text-[#0058a6]">J'accepte les termes et conditions</label>
                      </div>
                    </div>
                    {errors.agreeTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>}
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 px-4 ${isLoading ? 'bg-gray-500' : 'bg-[#0070cc]'} text-white font-semibold rounded-lg focus:ring-4 focus:ring-[#108de4] focus:ring-opacity-50 transition-colors`}
                    >
                      {isLoading ? 'Création du compte...' : 'Créer un compte'}
                    </button>
                  </div>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-[#0070cc]">Vous avez déjà un compte ? 
                    <Link to="/login2" className="font-semibold text-[#0070cc] hover:text-[#0058a6]"> Se connecter</Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;