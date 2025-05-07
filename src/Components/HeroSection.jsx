import { useState, useEffect } from "react";
import { ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="pt-28 pb-22 md:pt-40 md:pb-32 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-full">
        <div className="absolute top-1/4 right-1/3 w-64 h-64 rounded-full bg-[#e0f0fe] blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-[#bae0fd] blur-3xl opacity-60"></div>
      </div>

      <div className="container-custom relative z-10 -mt-6">
        <div className="max-w-4xl mx-auto text-center">
          <span
            className={`inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-[#f0f7ff] text-[#108de4] border border-[#e0f0fe] transition-all duration-700 ${
              isLoaded ? "opacity-100" : "opacity-0 -translate-y-4"
            }`}
          >
            Plateforme révolutionnaire de location d'équipement médical
          </span>

          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6 transition-all duration-700 delay-100 ${
              isLoaded ? "opacity-100" : "opacity-0 -translate-y-4"
            }`}
          >
            <span className="text-[#0058a6]">La guérison commence par</span>
            <br />
            <span className="text-gradient font-normal">
              un équipement accessible
            </span>
          </h1>

          <p
            className={`text-xl text-[#a39991] mb-10 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isLoaded ? "opacity-100" : "opacity-0 -translate-y-4"
            }`}
          >
            Connectez-vous avec des personnes louant des équipements médicaux à
            des prix abordables. Pas besoin d'acheter du matériel coûteux pour
            un usage temporaire.
          </p>

          <div
            className={`relative max-w-xl mx-auto mb-12 transition-all duration-700 delay-300 ${
              isLoaded ? "opacity-100" : "opacity-0 -translate-y-4"
            }`}
          >
            <div className="relative">
         
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
               
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-400 -mt-4 ${
              isLoaded ? "opacity-100" : "opacity-0 -translate-y-4"
            }`}
          >
          <Link to="/rent-equip">
              <button className="button-primary group flex items-center px-6 py-3 bg-[#108de4] text-white rounded-full font-semibold hover:bg-[#0070cc] transition-all">
                <span>Parcourir l'équipement</span>
                <ChevronRight
                  size={16}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </button>
          </Link>
          <a href="#how-it-works">
            <button className="button-secondary flex items-center px-6 py-3 bg-[#f0f7ff] text-[#108de4] border border-[#e0f0fe] rounded-full font-semibold hover:bg-[#e0f0fe] transition-all">
              <span>Comment ça marche</span>
            </button>
          </a>
          </div>

          <div
            className={`flex items-center justify-center gap-4 md:gap-10 mt-16 transition-all duration-700 delay-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0058a6]">1200+</div>
              <div className="text-sm text-[#7d7469]">
                Équipements disponibles
              </div>
            </div>
            <div className="h-10 w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0058a6]">300+</div>
              <div className="text-sm text-[#7d7469]">Locataires heureux</div>
            </div>
            <div className="h-10 w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0058a6]">15+</div>
              <div className="text-sm text-[#7d7469]">Villes couvertes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave shape divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full h-auto"
        >
          <path
            fill="#f0f7ff"
            fillOpacity="1"
            d="M0,96L60,80C120,64,240,32,360,26.7C480,21,600,43,720,48C840,53,960,43,1080,42.7C1200,43,1320,53,1380,58.7L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
