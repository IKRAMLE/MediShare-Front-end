import { useState, useEffect } from 'react';
import { ShieldCheck, DollarSign, Clock, Users2, Recycle, Award } from 'lucide-react';

const Benefit = ({ icon: Icon, title, description, iconColor, bgColor, borderColor }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className={`w-16 h-16 ${bgColor} ${borderColor} rounded-full flex items-center justify-center mb-4`}>
        <Icon className={iconColor} size={28} />
      </div>
      <h3 className="text-xl font-semibold text-[#084b88] mb-3">{title}</h3>
      <p className="text-[#958a80]">{description}</p>
    </div>
  );
};

const OurBenefits = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('benefits-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: ShieldCheck,
      title: "Sûr et Vérifié",
      description: "Tout le matériel est vérifié pour la sécurité et la qualité avant d'être répertorié sur notre plateforme.",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border border-blue-100"
    },
    {
      icon: DollarSign,
      title: "Économique",
      description: "Économisez jusqu'à 90 % par rapport à l'achat de nouveaux équipements pour des besoins médicaux temporaires.",
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border border-green-100"
    },
    {
      icon: Clock,
      title: "Durée Flexible",
      description: "Louez pour des jours, des semaines ou des mois en fonction de votre période de rétablissement.",
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border border-amber-100"
    },
    {
      icon: Users2,
      title: "Soutien Communautaire",
      description: "Connectez-vous avec d'autres personnes ayant utilisé du matériel similaire pour obtenir des conseils et du soutien.",
      iconColor: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border border-rose-100"
    },
    {
      icon: Recycle,
      title: "Choix Durable",
      description: "Réduisez les déchets en donnant une seconde vie au matériel médical grâce au partage.",
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border border-emerald-100"
    },
    {
      icon: Award,
      title: "Assurance Qualité",
      description: "Chaque annonce inclut des informations détaillées sur l'état et l'historique d'utilisation.",
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border border-purple-100"
    }
  ];

  return (
    <section id="benefits-section" className="py-20 bg-gradient-to-b from-[#f0f7ff] to-white -mt-17">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className={`inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-[#e0f0fe] text-[#0058a6] border border-[#bae0fd] transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>Pourquoi Choisir MediShare</span>
          <h2 className={`section-heading transition-all duration-700 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>Les Avantages de Notre <span className="text-gradient font-medium">Plateforme</span></h2>
          <p className={`text-lg text-[#958a80] transition-all duration-700 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>Nous avons conçu MediShare Maroc en pensant aux propriétaires et aux utilisateurs d'équipements, en créant une plateforme qui offre des avantages pour tous.</p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {benefits.map((benefit, index) => (
            <Benefit 
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              iconColor={benefit.iconColor}
              bgColor={benefit.bgColor}
              borderColor={benefit.borderColor}
            />
          ))}
        </div>

        <div className={`mt-16 text-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <button className="button-primary">Commencez à Explorer</button>
          <p className="mt-4 text-[#a39991] text-sm">Rejoignez des milliers de Marocains qui bénéficient déjà de la communauté MediShare</p>
        </div>
      </div>
    </section>
  );
};

export default OurBenefits;