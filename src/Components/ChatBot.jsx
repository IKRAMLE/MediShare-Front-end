import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, HelpCircle, Clock, AlertCircle, Bot, ChevronDown, ChevronUp } from 'lucide-react';

const ChatBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Initial messages and suggestions
  const initialMessages = [
    { 
      role: 'assistant', 
      content: 'Bonjour! Je suis votre assistant MediShare. Comment puis-je vous aider aujourd\'hui?' 
    }
  ];

  const suggestions = [
    'Comment fonctionne la location d\'équipements?',
    'Quels sont les frais de location?',
    'Comment puis-je devenir propriétaire d\'équipements?',
    'Comment contacter le support?'
  ];

  // Réponses prédéfinies pour les questions fréquentes
  const predefinedResponses = {
    'comment fonctionne la location d\'équipements': 'La location d\'équipements médicaux sur MediShare est simple : 1) Parcourez notre catalogue d\'équipements disponibles, 2) Sélectionnez l\'équipement et la durée de location souhaitée, 3) Remplissez le formulaire de demande, 4) Effectuez le paiement, 5) Récupérez l\'équipement ou faites-le livrer à votre adresse.',
    'quels sont les frais de location': 'Les frais de location varient selon l\'équipement et la durée. Nous proposons des tarifs journaliers, hebdomadaires et mensuels. Des frais de livraison peuvent s\'appliquer selon votre localisation. Consultez la page de l\'équipement pour voir les tarifs détaillés.',
    'comment puis-je devenir propriétaire d\'équipements': 'Pour devenir propriétaire d\'équipements sur MediShare : 1) Créez un compte, 2) Remplissez le formulaire de propriétaire, 3) Ajoutez vos équipements avec photos et descriptions, 4) Définissez vos tarifs de location, 5) Recevez des demandes de location et gérez votre inventaire.',
    'comment contacter le support': 'Vous pouvez contacter notre support par email à support@medishare.com, par téléphone au +33 1 23 45 67 89, ou via notre formulaire de contact sur notre site web. Notre équipe est disponible du lundi au vendredi de 9h à 18h.'
  };

  // Initialize messages when chat is opened
  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages(initialMessages);
    }
  }, [isChatOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  const handleSendMessage = async (userMessage = message) => {
    if (!userMessage.trim()) return;

    // Add user message to chat
    const userMsg = { role: 'user', content: userMessage };
    setMessages(prevMessages => [...prevMessages, userMsg]);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // Simuler un délai de réponse
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rechercher une réponse prédéfinie
      const lowerCaseMessage = userMessage.toLowerCase();
      let botResponse = '';
      
      // Vérifier si la question correspond à une réponse prédéfinie
      for (const [key, value] of Object.entries(predefinedResponses)) {
        if (lowerCaseMessage.includes(key)) {
          botResponse = value;
          break;
        }
      }
      
      // Si aucune réponse prédéfinie n'est trouvée, générer une réponse générique
      if (!botResponse) {
        if (lowerCaseMessage.includes('bonjour') || lowerCaseMessage.includes('salut')) {
          botResponse = 'Bonjour! Comment puis-je vous aider aujourd\'hui?';
        } else if (lowerCaseMessage.includes('merci')) {
          botResponse = 'Je vous en prie! N\'hésitez pas à me poser d\'autres questions.';
        } else if (lowerCaseMessage.includes('au revoir') || lowerCaseMessage.includes('bye')) {
          botResponse = 'Au revoir! N\'hésitez pas à revenir si vous avez d\'autres questions.';
        } else {
          botResponse = 'Je comprends votre question. Pour plus d\'informations, vous pouvez consulter notre FAQ ou contacter notre support client.';
        }
      }
      
      const botMessage = { 
        role: 'assistant', 
        content: botResponse
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setError('Désolé, une erreur s\'est produite. Veuillez réessayer plus tard.');
      
      // Add error message to chat
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          role: 'assistant', 
          content: 'Désolé, une erreur s\'est produite. Veuillez réessayer plus tard.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot Bubble */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="bg-[#0070cc] text-white p-3 rounded-full shadow-lg hover:bg-[#005ba6] transition-all transform hover:scale-105"
          aria-label="Open chat"
        >
          <MessageCircle size={20} />
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div 
          ref={chatWindowRef}
          className={`w-80 bg-white border rounded-lg shadow-xl flex flex-col transition-all duration-300 ease-in-out ${
            isMinimized ? 'h-14' : 'h-[500px]'
          }`}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#0070cc] to-[#005ba6] text-white p-3 flex justify-between items-center rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-full">
                <Bot size={16} className="text-[#0070cc]" />
              </div>
              <h2 className="text-base font-semibold">MediShare Assistant</h2>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={toggleMinimize}
                className="hover:bg-white/20 p-1 rounded"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-white/20 p-1 rounded"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Container - Only show when not minimized */}
          {!isMinimized && (
            <>
              <div className="flex-grow overflow-y-auto p-3 space-y-2">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0 mr-1.5 mt-1">
                        <div className="bg-[#f0f7ff] p-1 rounded-full">
                          <Bot size={14} className="text-[#0070cc]" />
                        </div>
                      </div>
                    )}
                    <div 
                      className={`p-2 rounded-lg max-w-[85%] text-sm ${
                        msg.role === 'user' 
                          ? 'bg-[#0070cc] text-white rounded-tr-none' 
                          : 'bg-[#f0f7ff] text-[#084b88] rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="flex-shrink-0 ml-1.5 mt-1">
                        <div className="bg-[#0070cc] p-1 rounded-full">
                          <div className="w-3 h-3 rounded-full bg-white/30"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Suggestions */}
                {messages.length === 1 && (
                  <div className="mt-3 animate-fadeIn">
                    <p className="text-xs text-gray-500 mb-1.5">Suggestions:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="bg-[#f0f7ff] text-[#084b88] text-xs px-2 py-0.5 rounded-full hover:bg-[#e0efff] transition-colors hover:shadow-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {isLoading && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="p-2 bg-[#f0f7ff] text-[#084b88] rounded-lg flex items-center gap-2 text-sm">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-[#0070cc] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-[#0070cc] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-[#0070cc] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span>En train de réfléchir...</span>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="p-2 bg-red-100 text-red-700 rounded-lg flex items-center gap-1.5 text-sm">
                      <AlertCircle size={14} />
                      <span>{error}</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-3 border-t border-gray-200">
                <div className="flex items-center">
                  <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Écrivez votre message..."
                    className="flex-grow p-1.5 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#0070cc]"
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !message.trim()}
                    className="bg-[#0070cc] text-white p-1.5 rounded-r-lg hover:bg-[#005ba6] disabled:opacity-50 transition-colors"
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <div className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                  <HelpCircle size={10} />
                  <span>Posez des questions sur nos services</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;