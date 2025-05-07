import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);
    
    try {
      // Create form data with Web3Forms access key
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("access_key", "6aac95e2-14e1-4102-9afc-cce0cb860c70");
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("message", formData.message);
      
      // Convert to JSON
      const object = Object.fromEntries(formDataToSubmit);
      const json = JSON.stringify(object);
      
      // Submit to Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitSuccess(true);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        
        // Reset success message after a delay
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(true);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#f0f7ff] to-[#ffffff] -mt-16">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4" id="contact-us">Contactez-nous</h2>
          <p className="max-w-2xl mx-auto text-[#0058a6]">
            Vous avez des questions ou souhaitez en savoir plus sur MediShare Maroc ? Contactez notre équipe et nous serons heureux de vous aider.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold text-[#084b88] mb-6">Informations de contact</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-[#e0f0fe] p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-[#0070cc]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#084b88]">Notre emplacement</h4>
                  <p className="text-[#0070cc] mt-1">123 Avenue Mohammed V, Casablanca, Maroc</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#e0f0fe] p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-[#0070cc]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#084b88]">Numéro de téléphone</h4>
                  <p className="text-[#0070cc] mt-1">+212 522 123 456</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#e0f0fe] p-3 rounded-full mr-4">
                  <Mail className="h-6 w-6 text-[#0070cc]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#084b88]">Adresse email</h4>
                  <p className="text-[#0070cc] mt-1">info@medisharemorocco.com</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h4 className="font-medium text-[#084b88] mb-4">Heures d'ouverture</h4>
              <div className="space-y-2 text-[#0070cc]">
                <p>Lundi - Vendredi : 9h00 - 18h00</p>
                <p>Samedi : 9h00 - 13h00</p>
                <p>Dimanche : Fermé</p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold text-[#084b88] mb-6">Envoyez-nous un message</h3>
            
            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-5 rounded-lg flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>Votre message a été envoyé avec succès ! Nous reviendrons vers vous sous peu.</p>
              </div>
            ) : submitError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-5 rounded-lg flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p>Une erreur s'est produite lors de l'envoi. Veuillez réessayer plus tard.</p>
              </div>
            ) : null}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#0058a6] mb-1">Nom complet</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#bae0fd] rounded-lg focus:ring-2 focus:ring-[#108de4] focus:border-[#108de4] transition-colors text-[#084b88]"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#0058a6] mb-1">Adresse email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#bae0fd] rounded-lg focus:ring-2 focus:ring-[#108de4] focus:border-[#108de4] transition-colors text-[#084b88]"
                    placeholder="Votre email"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#0058a6] mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-[#bae0fd] rounded-lg focus:ring-2 focus:ring-[#108de4] focus:border-[#108de4] transition-colors text-[#084b88]"
                    placeholder="Écrivez votre message ici..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-[#0070cc] hover:bg-[#0058a6] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi...
                    </>
                  ) : (
                    <>
                      Envoyer le message <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;