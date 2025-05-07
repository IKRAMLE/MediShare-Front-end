import { useState, useEffect, useRef } from 'react';
import { SearchCheck, Handshake, CalendarCheck, Heart } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Trouver l'Équipement",
    description: "Parcourez le catalogue complet ou recherchez l'équipement médical spécifique dont vous avez besoin.",
    icon: SearchCheck,
    color: "bg-blue-50 text-blue-500 border-blue-100",
  },
  {
    id: 2,
    title: "Demander la Location",
    description: "Contactez le propriétaire, vérifiez les détails et organisez les options de ramassage ou de livraison.",
    icon: Handshake,
    color: "bg-emerald-50 text-emerald-500 border-emerald-100",
  },
  {
    id: 3,
    title: "Utiliser et Retourner",
    description: "Utilisez l'équipement pour la durée nécessaire et retournez-le en bon état.",
    icon: CalendarCheck,
    color: "bg-amber-50 text-amber-500 border-amber-100",
  },
  {
    id: 4,
    title: "Partagez Votre Expérience",
    description: "Laissez un avis pour aider les autres et construire une communauté de confiance.",
    icon: Heart,
    color: "bg-rose-50 text-rose-500 border-rose-100",
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev === steps.length ? 1 : prev + 1));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 bg-[#f0f7ff]">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-heading ">Comment Fonctionne MediShare</h2>
          <p className="section-subheading">
            Notre plateforme rend la location et l'annonce d'équipements médicaux simple, 
            sécurisée et efficace pour tous.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Liste des étapes */}
          <div className="space-y-6">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`glass-card p-6 rounded-xl transition-all duration-500 ${
                  activeStep === step.id 
                    ? 'border-l-4 border-l-[#108de4] scale-105 shadow-lg' 
                    : 'opacity-75 hover:opacity-100'
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${step.color} mr-4`}>
                    <step.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {step.id}. {step.title}
                    </h3>
                    <p className="text-warmGray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Illustration */}
          <div className={`relative transition-all duration-600 ${isVisible ? 'opacity-100' : 'opacity-0 translate-x-12'}`}>
            <div className="aspect-square max-w-md mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#e0f0fe]/80 to-[#bae0fd]/50 rounded-full blur-3xl"></div>
              <div className="relative z-10 h-full rounded-3xl glass-card p-6 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                  alt="Femme utilisant l'application MediShare"
                  className="rounded-2xl object-cover object-center shadow-xl"
                />
              </div>
              
              {/* Éléments décoratifs */}
              <div className="absolute top-10 -left-5 h-20 w-20 rounded-xl bg-yellow-100 -rotate-12 shadow"></div>
              <div className="absolute -bottom-5 right-10 h-24 w-24 rounded-xl bg-blue-100 rotate-12 shadow-sm"></div>
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 bg-green-100 h-16 w-16 rounded-full shadow-md"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;