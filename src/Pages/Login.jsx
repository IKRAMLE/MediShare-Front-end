import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
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
    if (!formData.email) newErrors.email = 'L\'email est requis';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
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
            throw new Error(data.message || 'Identifiants incorrects');
          }
        }
        
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('authToken', data.token); // Keep both for backward compatibility
        }
        
        // Store user data if needed
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Redirect based on user role
          if (data.user.role === 'Admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        }
        
        // Show success message
        setSuccess(true);
      } else {
        // Handle non-JSON response (likely an error page)
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Le serveur a rencontré une erreur. Veuillez réessayer plus tard.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors(prev => ({ 
        ...prev,
        submit: error.message || 'Une erreur est survenue lors de la connexion'
      }));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <div className="flex-grow py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#f0f7ff] ">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleReturn}
            className="flex items-center text-[#0070cc] hover:text-[#0058a6] -ml-40 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </button>
          <div className="shadow-2xl">
            <div className="bg-white shadow-xl rounded-2xl p-6">
              {success ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-green-600">Connecté avec succès!</h2>
                  <p className="mt-2 text-gray-600">Redirection vers le tableau de bord...</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#084b88]">Bienvenue</h1>
                    <p className="mt-2 text-[#0070cc]">Connectez-vous à votre compte MediShare</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.submit && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {errors.submit}
                      </div>
                    )}
                  
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
                      <label htmlFor="password" className="block text-sm font-medium text-[#0058a6] mb-1">Mot de passe</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-[#37aaf8]" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-300' : 'border-[#bae0fd]'} rounded-lg focus:ring-2 focus:ring-[#108de4] focus:border-[#108de4] transition-colors text-[#084b88]`}
                          placeholder="Votre mot de passe"
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
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="rememberMe"
                            name="rememberMe"
                            type="checkbox"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#0070cc] focus:ring-[#108de4] border-[#7cc7fc] rounded"
                          />
                        </div>
                        <div className="ml-2 text-sm">
                          <label htmlFor="rememberMe" className="font-medium text-[#0058a6]">Se souvenir de moi</label>
                        </div>
                      </div>
                      <div className="text-sm">
                        <Link to="/forgot-password" className="font-medium text-[#0070cc] hover:text-[#0058a6]">
                          Mot de passe oublié?
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 ${isLoading ? 'bg-gray-500' : 'bg-[#0070cc]'} text-white font-semibold rounded-lg focus:ring-4 focus:ring-[#108de4] focus:ring-opacity-50 transition-colors`}
                      >
                        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                      </button>
                    </div>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-[#0070cc]">Vous n'avez pas de compte ? 
                      <Link to="/signup2" className="font-semibold text-[#0070cc] hover:text-[#0058a6]"> Créez-en un maintenant</Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;