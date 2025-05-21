import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setSubscriptionStatus("Veuillez entrer une adresse email valide");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscriptionStatus("Veuillez entrer une adresse email valide");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('https://medishare-back-end-production.up.railway.app/api/newsletter/subscribe', { email });
      setSubscriptionStatus(response.data.message);
      setEmail(""); // Clear the input after successful subscription
    } catch (error) {
      setSubscriptionStatus(
        error.response?.data?.message || 
        "Une erreur est survenue. Veuillez réessayer plus tard."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer id="contact" className="bg-[#0d4071] text-white pt-16 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <span className="font-semibold text-2xl text-white">
                Medi<span className="text-[#7cc7fc]">Share</span>
              </span>
            </div>

            <p className="text-[#e0f0fe] mb-6">
              Une plateforme qui connecte les personnes ayant besoin d'équipement médical avec celles qui peuvent le partager, rendant les soins de santé plus accessibles à travers le Maroc.
            </p>

            <div className="flex space-x-6">
              <a
                href="#"
                className="text-[#e0f0fe] hover:text-white transition-colors p-3 rounded-full hover:bg-[#084b88]"
              >
                <FaFacebook size={22} />
              </a>
              <a
                href="#"
                className="text-[#e0f0fe] hover:text-white transition-colors p-3 rounded-full hover:bg-[#084b88]"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="#"
                className="text-[#e0f0fe] hover:text-white transition-colors p-3 rounded-full hover:bg-[#084b88]"
              >
                <FaTwitter size={22} />
              </a>
              <a
                href="#"
                className="text-[#e0f0fe] hover:text-white transition-colors p-3 rounded-full hover:bg-[#084b88]"
              >
                <FaLinkedin size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links - Medical Equipment Renting */}
          <div className="ml-17">
            <h3 className="text-lg font-medium mb-6">Équipement Médical</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-[#e0f0fe] hover:text-white transition-colors"
                >
                  Parcourir les équipements
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#e0f0fe] hover:text-white transition-colors"
                >
                  Listez votre équipement
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#e0f0fe] hover:text-white transition-colors"
                >
                  Comment ça marche
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#e0f0fe] hover:text-white transition-colors"
                >
                  Directives de sécurité
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#e0f0fe] hover:text-white transition-colors"
                >
                  Tarification & Plans
                </a>
              </li>
            </ul>
          </div>

          {/* About & Resources */}
          <div className="ml-12">
            <h3 className="text-lg font-medium mb-6">Informations sur l'entreprise</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-[#e0f0fe] hover:text-white transition-colors"
                >
                  Notre histoire
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#e0f0fe] hover:text-white transition-colors"
                >
                  L'équipe
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#e0f0fe] hover:text-white transition-colors"
                >
                  Carrières
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#e0f0fe] hover:text-white transition-colors"
                >
                  Contactez-nous
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#e0f0fe] hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-medium mb-6">Restez informé</h3>
            <p className="text-[#e0f0fe] mb-4">
              Abonnez-vous à notre newsletter pour les dernières mises à jour sur la disponibilité des équipements médicaux, des offres exclusives et des conseils santé.
            </p>

            <form onSubmit={handleSubscribe} className="mb-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="w-full px-4 py-3 bg-[#084b88] border border-[#0058a6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37aaf8] text-white placeholder-[#37aaf8]"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className={`absolute right-1 top-1 bg-[#0070cc] text-white px-4 py-2 rounded-md hover:bg-[#108de4] transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Envoi...' : "S'abonner"}
                </button>
              </div>
              {subscriptionStatus && (
                <p className={`mt-2 text-sm ${
                  subscriptionStatus.includes("erreur") || subscriptionStatus.includes("déjà") 
                    ? "text-red-400" 
                    : "text-green-400"
                }`}>
                  {subscriptionStatus}
                </p>
              )}
            </form>

            <p className="text-xs text-[#37aaf8]">
              En vous abonnant, vous acceptez notre Politique de confidentialité et consentez à recevoir des mises à jour de notre part.
            </p>
          </div>
        </div>

        <div className="border-t border-[#084b88] mt-12 pt-8 text-center">
          <p className="text-[#7cc7fc] text-sm">
            © {new Date().getFullYear()} MediShare. Tous droits réservés.
          </p>
          <p className="flex items-center justify-center text-xs text-[#37aaf8] mt-2">
            Créé avec <Heart size={12} className="mx-1 text-rose-500" /> pour la
            communauté marocaine
          </p>
          <div className="mt-4 text-xs text-[#37aaf8] flex justify-center space-x-4">
            <a href="#" className="hover:text-[#e0f0fe] transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="hover:text-[#e0f0fe] transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="hover:text-[#e0f0fe] transition-colors">
              Politique de cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
