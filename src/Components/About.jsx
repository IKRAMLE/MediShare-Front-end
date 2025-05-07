import { Users, Heart, Award, Shield, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';

const AboutUs = () => {
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

    const element = document.getElementById('about-us-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about-us-section" className="py-20 bg-gradient-to-b from-white to-[#f0f7ff]">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className={`inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-[#e0f0fe] text-[#0070cc] border border-[#bae0fd] transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            À Propos de MediShare 
          </span>
          <h2 className={`section-heading transition-all duration-700 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Notre Mission & <span className="text-gradient font-medium">Nos Valeurs</span>
          </h2>
          <p className={`text-lg text-[#7d7469] transition-all duration-700 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Nous révolutionnons l'accès aux équipements médicaux au Maroc grâce à notre plateforme de partage communautaire, 
            rendant les soins de santé plus accessibles et abordables pour tous tout en réduisant les déchets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#108de4]/20 to-[#0058a6]/20 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80" 
                alt="Professionnels médicaux au Maroc" 
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
          </div>
          
          <div className={`space-y-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>    
            <div>
              <h3 className="text-2xl font-semibold text-[#084b88] mb-3 flex items-center">
                <Users className="mr-2 text-[#108de4]" size={24} />
                Le Problème Que Nous Résolvons
              </h3>
              <p className="text-[#7d7469]">
                Au Maroc, les équipements médicaux sont souvent prohibitifs, surtout pour des besoins temporaires. De nombreuses 
                familles s'endettent pour acheter des équipements qu'elles n'utiliseront que pendant quelques semaines ou mois. 
                Pendant ce temps, des milliers d'appareils médicaux de qualité restent inutilisés dans tout le pays. Notre plateforme 
                comble cette lacune, créant une économie de partage accessible pour les soins de santé.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-[#084b88] mb-3 flex items-center">
                <Award className="mr-2 text-[#108de4]" size={24} />
                Notre Approche
              </h3>
              <p className="text-[#7d7469]">
                Nous avons construit une plateforme sécurisée et conviviale où les propriétaires d'équipements peuvent mettre en 
                location leurs articles inutilisés, tandis que ceux qui en ont besoin peuvent trouver des options de location 
                abordables. Notre système de vérification garantit que tous les équipements répondent aux normes de sécurité, 
                et notre système d'évaluation communautaire établit la confiance entre les membres.
              </p>
            </div>
          </div>
        </div>
        
        <div className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white p-8 rounded-xl shadow-md border border-[#e0f0fe] hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-6">
              <Shield className="text-[#0070cc]" size={24} />
            </div>
            <h4 className="text-xl font-semibold text-[#084b88] mb-3">Sécurité Avant Tout</h4>
            <p className="text-[#7d7469]">
              Nous priorisons votre sécurité avec des vérifications d'équipement minutieuses et des procédures de vérification. 
              Toutes les annonces sont soumises à un processus d'examen pour s'assurer qu'elles répondent aux normes de santé 
              avant d'apparaître sur notre plateforme.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-[#e0f0fe] hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-6">
              <Award className="text-[#0070cc]" size={24} />
            </div>
            <h4 className="text-xl font-semibold text-[#084b88] mb-3">Accès Abordable</h4>
            <p className="text-[#7d7469]">
              Notre plateforme rend les équipements médicaux de qualité accessibles à une fraction du prix d'achat. Les 
              locataires économisent généralement 70 à 90% par rapport à l'achat de neuf, tandis que les propriétaires 
              récupèrent une partie de leur investissement initial.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-[#e0f0fe] hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-6">
              <Heart className="text-[#0070cc]" size={24} />
            </div>
            <h4 className="text-xl font-semibold text-[#084b88] mb-3">Impact Communautaire</h4>
            <p className="text-[#7d7469]">
              En partageant des équipements, vous aidez les autres tout en réduisant les déchets et l'impact environnemental. 
              Notre plateforme a déjà facilité plus de 1 000 locations, aidant des centaines de familles à accéder à des soins 
              qu'elles n'auraient autrement pas pu se permettre.
            </p>
          </div>
        </div>

        {/* Adding Impact Stats Section */}
        <div className="mt-24 py-12 px-6 bg-[#084b88] rounded-2xl shadow-xl">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-medium text-white mb-4">Notre Impact En Chiffres</h3>
            <p className="text-[#e0f0fe] max-w-2xl mx-auto">
              Depuis notre lancement, nous avons fait une différence mesurable dans l'accessibilité des soins de santé à travers le Maroc.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#0058a6] flex items-center justify-center">
                  <Users className="text-[#e0f0fe]" size={32} />
                </div>
              </div>
              <h4 className="text-4xl font-bold text-white mb-2">2 500+</h4>
              <p className="text-[#e0f0fe]">Utilisateurs Inscrits</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#0058a6] flex items-center justify-center">
                  <BarChart3 className="text-[#e0f0fe]" size={32} />
                </div>
              </div>
              <h4 className="text-4xl font-bold text-white mb-2">1 200+</h4>
              <p className="text-[#e0f0fe]">Annonces d'Équipements</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#0058a6] flex items-center justify-center">
                  <TrendingUp className="text-[#e0f0fe]" size={32} />
                </div>
              </div>
              <h4 className="text-4xl font-bold text-white mb-2">15+</h4>
              <p className="text-[#e0f0fe]">Villes Couvertes</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#0058a6] flex items-center justify-center">
                  <CheckCircle className="text-[#e0f0fe]" size={32} />
                </div>
              </div>
              <h4 className="text-4xl font-bold text-white mb-2">98%</h4>
              <p className="text-[#e0f0fe]">Taux de Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Adding Our Vision */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-3xl font-semibold text-[#084b88] mb-6">Notre Vision pour l'Avenir</h3>
            <p className="text-[#7d7469] mb-6">
              Nous envisageons un Maroc où personne n'a à choisir entre la stabilité financière et l'accès aux équipements médicaux nécessaires. 
              Notre objectif est de nous étendre à chaque ville et zone rurale du pays, en veillant à ce que la distance ne soit jamais un obstacle aux soins.
            </p>
            <p className="text-[#7d7469] mb-6">
              Nous développons également des partenariats avec des hôpitaux, des cliniques et des fournisseurs médicaux pour créer un écosystème 
              complet qui soutient les patients à chaque étape de leur parcours de soins.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="text-[#108de4] mr-3" size={20} />
                <p className="text-[#665f57]">Couverture nationale d'ici 2027</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-[#108de4] mr-3" size={20} />
                <p className="text-[#665f57]">Intégration avec les prestataires de soins de santé</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-[#108de4] mr-3" size={20} />
                <p className="text-[#665f57]">Programme de don d'équipement pour les familles à faible revenu</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-[#108de4] mr-3" size={20} />
                <p className="text-[#665f57]">Ressources éducatives pour les soins de santé à domicile</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute -top-5 -right-5 w-24 h-24 bg-[#e0f0fe] rounded-full opacity-70"></div>
              <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-[#bae0fd] rounded-full opacity-70"></div>
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80" 
                alt="Avenir des soins de santé au Maroc" 
                className="rounded-xl shadow-xl relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;