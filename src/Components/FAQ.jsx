import React from 'react';

const FAQSection = () => {
  return (
    <section className="py-16 bg-white -mt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0070cc]">Questions fréquemment posées</h2>
          <p className="mt-4 text-xl text-[#0d4071] max-w-3xl mx-auto">
            Questions courantes sur la location d'équipements médicaux
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#f0f7ff] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#108de4] mb-2">Comment puis-je louer des équipements médicaux ?</h3>
            <p className="text-[#0d4071]">
              Pour louer des équipements médicaux, il vous suffit de parcourir notre site, de choisir l'équipement dont vous avez besoin, de vérifier sa disponibilité, et de suivre les étapes pour la réservation en ligne.
            </p>
          </div>

          <div className="bg-[#f0f7ff] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#108de4] mb-2">Quels types d'équipements médicaux sont disponibles ?</h3>
            <p className="text-[#0d4071]">
              Nous proposons une large gamme d'équipements médicaux, y compris des fauteuils roulants, des lits médicaux, des appareils de rééducation, des oxymètres de pouls, et bien d'autres. Vous pouvez consulter notre catalogue en ligne pour plus de détails.
            </p>
          </div>

          <div className="bg-[#f0f7ff] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#108de4] mb-2">Comment puis-je payer pour la location ?</h3>
            <p className="text-[#0d4071]">
              Nous acceptons différents moyens de paiement, y compris les cartes de crédit, PayPal, et les virements bancaires. Le paiement doit être effectué lors de la réservation.
            </p>
          </div>

          <div className="bg-[#f0f7ff] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#108de4] mb-2">Puis-je annuler ou modifier ma réservation ?</h3>
            <p className="text-[#0d4071]">
              Oui, vous pouvez annuler ou modifier votre réservation jusqu'à 48 heures avant la date de livraison. Toute annulation ou modification après ce délai peut entraîner des frais supplémentaires.
            </p>
          </div>

          <div className="bg-[#f0f7ff] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#108de4] mb-2">Que faire si l'équipement est défectueux ?</h3>
            <p className="text-[#0d4071]">
              Si l'équipement est défectueux, veuillez nous contacter immédiatement. Nous organiserons soit une réparation, soit un remplacement de l'équipement sans frais supplémentaires pour vous.
            </p>
          </div>

          <div className="bg-[#f0f7ff] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#108de4] mb-2">Offrez-vous un service de livraison ?</h3>
            <p className="text-[#0d4071]">
              Oui, nous proposons un service de livraison et de récupération d'équipement. Nous nous assurons que l'équipement arrive à votre domicile à temps et que vous pouvez le retourner facilement à la fin de votre location.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
