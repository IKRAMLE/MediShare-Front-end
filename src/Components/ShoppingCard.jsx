import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, CreditCard, ArrowRight, Heart, Gift } from "lucide-react";

const ShoppingCart = ({ isOpen, onClose, cartItems = [], removeFromCart, updateCartItemQuantity }) => {
  const [animateItems, setAnimateItems] = useState(false);
  const navigate = useNavigate();
  
  const isEmpty = cartItems.length === 0;
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price  * item.quantity), 0);
  };
  
  // Handle item removal with fallback if no function is provided
  const handleRemoveItem = (itemId) => {
    if (removeFromCart) {
      removeFromCart(itemId);
    }
  };
  
  // Handle quantity update with fallback if no function is provided
  const handleQuantityUpdate = (itemId, newQuantity) => {
    if (updateCartItemQuantity) {
      // Limiter la quantité entre 1 et 1 (donc toujours 1)
      updateCartItemQuantity(itemId, 1);
    }
  };
  
  // Reset animation state when cart closes and animate when it opens
  useEffect(() => {
    if (isOpen) {
      // Add small delay for animation to work properly
      setTimeout(() => setAnimateItems(true), 100);
    } else {
      setAnimateItems(false);
    }
  }, [isOpen]);
  
  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-opacity-30 backdrop-blur-xs"
        onClick={onClose}
      />
      
      {/* Cart container with animated entrance */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transform transition-all duration-500 scale-100 opacity-100">
        {/* Wave decoration on top */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-blue-600 overflow-hidden">
          <div className="absolute inset-0">
            <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="w-full h-full">
              <path 
                d="M0,0 L400,0 L400,10 C300,30 100,0 0,12 L0,0 Z" 
                fill="#3B82F6" 
              />
            </svg>
          </div>
        </div>
        
        {/* Header */}
        <div className="pt-6 pb-2 px-6 flex items-center justify-between border-b">
          <div className="flex items-center">
            <ShoppingBag size={16} className="mr-1" />
            <span className="font-medium text-sm">Panier ({cartCount})</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Cart content */}
        <div className="p-6">
          {isEmpty ? (
            <div className="py-12 flex flex-col items-center">
              <div className="relative mb-6">
                <ShoppingBag size={64} className="text-gray-200" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-xl">?</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-800">Votre panier est vide</h3>
              <p className="text-gray-500 text-center mt-2 mb-6">Parcourez notre catalogue et trouvez l'équipement médical dont vous avez besoin.</p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center"
              >
                Explorer <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center p-3 bg-blue-50 rounded-lg transform transition-all duration-500 ${animateItems ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="h-16 w-16 bg-white rounded-md overflow-hidden border border-gray-100 mr-4 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <button 
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>{item.price} DH / {item.rentalPeriod === 'month' ? 'mois' : 'jour'} </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-white rounded-full border border-gray-200">
                          <button 
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                            onClick={() => handleQuantityUpdate(item.id, 1)}
                          >
                            -
                          </button>
                          <span className="mx-2 text-sm font-medium">1</span>
                          <button 
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                            onClick={() => handleQuantityUpdate(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <span className="font-medium text-blue-600">
                          {item.price} DH
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary */}
              <div className="mt-6 pt-4 border-t border-dashed">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Sous-total</span>
                  <span>{calculateTotal()} DH</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Frais de service</span>
                  <span>20.00 DH</span>
                </div>
                <div className="flex justify-between font-medium mt-4">
                  <span>Total</span>
                  <span className="text-blue-600 text-lg">{calculateTotal() + 20} DH</span>
                </div>
                
                {/* Checkout button */}
                <button 
                  onClick={handleCheckout}
                  className="mt-4 w-full py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center group"
                >
                  <CreditCard size={18} className="mr-2 group-hover:animate-pulse" />
                  Valider ma commande
                </button>
                
                {/* Additional options */}
                <div className="flex text-sm text-gray-500 justify-center mt-4 space-x-4">
                  <button className="flex items-center hover:text-blue-600 transition-colors">
                    <Heart size={14} className="mr-1" /> Sauvegarder
                  </button>
                  <button className="flex items-center hover:text-blue-600 transition-colors">
                    <Gift size={14} className="mr-1" /> Ajouter code promo
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Pulse decoration at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 opacity-75"></div>
      </div>
    </div>
  );
};

export default ShoppingCart;