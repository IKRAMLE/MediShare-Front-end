import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, User } from 'lucide-react';

const AuthenticationRequired = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f0f7ff]">
        <div className="text-[#0070cc] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f0f7ff] p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-red-500 text-white p-8 rounded-t-2xl">
          <div className="flex items-center">
            <AlertCircle size={32} className="mr-4" />
            <h2 className="text-2xl font-bold">Authentification requise</h2>
          </div>
          <p className="mt-2 text-white/90">
            Veuillez vous connecter pour accéder à cette page.
          </p>
        </div>
        <div className="p-8 bg-white">
          <p className="text-gray-600 mb-6">
            Vous devez être connecté(e) pour voir et gérer votre équipement
            médical. Veuillez vous connecter pour continuer.
          </p>
          <div className="flex flex-col space-y-4">
            <Link
              to="/login2"
              className="inline-flex justify-center items-center px-6 py-3 bg-[#0070cc] hover:bg-[#0058a6] text-white font-medium rounded-lg transition-colors"
            >
              <User size={18} className="mr-2" />
              Se connecter
            </Link>
            <Link
              to="/"
              className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-[#0070cc] font-medium rounded-lg hover:bg-[#f0f7ff] transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationRequired;
