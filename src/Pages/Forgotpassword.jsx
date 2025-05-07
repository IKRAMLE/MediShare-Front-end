import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate password reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#f0f7ff]">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#084b88]">Mot de passe oublié</h1>
              <p className="mt-2 text-[#0070cc]">
                {isSubmitted 
                  ? "Vérifiez votre e-mail pour les instructions de réinitialisation" 
                  : "Entrez votre e-mail pour recevoir un lien de réinitialisation du mot de passe"}
              </p>
            </div>
            
            {isSubmitted ? (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#f0f7ff] mb-4">
                  <CheckCircle2 className="h-10 w-10 text-[#108de4]" />
                </div>
                <p className="text-[#0058a6] mb-6">
                  Nous avons envoyé un e-mail à <strong>{email}</strong> avec des instructions pour réinitialiser votre mot de passe.
                </p>
                <p className="text-[#0070cc] text-sm mb-6">
                  Vérifiez votre dossier de spam si vous ne le voyez pas dans votre boîte de réception. Le lien expirera dans 30 minutes.
                </p>
                <div className="mt-6">
                  <Link 
                    to="/login2" 
                    className="text-[#0070cc] hover:text-[#084b88] flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#0058a6] mb-1">
                    Adresse e-mail
                  </label>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-[#bae0fd] rounded-lg focus:ring-2 focus:ring-[#108de4] focus:border-[#108de4] transition-colors text-[#084b88]"
                      placeholder="Votre adresse e-mail"
                    />
                  </div>
                  <p className="mt-2 flex items-center text-sm text-[#108de4]">
                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                    Nous enverrons un lien de réinitialisation du mot de passe à cet e-mail.
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0070cc] hover:bg-[#0058a6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#108de4] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi du lien de réinitialisation...
                    </>
                  ) : (
                    "Envoyer le lien de réinitialisation"
                  )}
                </button>
                
                <div className="flex items-center justify-center">
                  <Link 
                    to="/login2" 
                    className="text-[#0070cc] hover:text-[#084b88] flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
