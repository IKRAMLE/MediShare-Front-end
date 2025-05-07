import React from 'react';
import { X } from 'lucide-react';

const EquipmentForm = ({
  formMode,
  formData,
  setFormData,
  handleSubmit,
  handleCancel,
  loading,
  currentEquipment,
  handleImageChange
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-[#084b88] mb-2">
            {formMode === "add" ? "Ajouter Nouvel Équipement" : "Modifier Équipement"}
          </h2>
          <button 
            onClick={handleCancel} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#084b88]">
                Nom de l'Équipement
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-md p-2 bg-[#f0f7ff] border border-[#ccc]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#084b88]">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-md p-2 bg-[#f0f7ff] border border-[#ccc]"
                required
              >
                <option value="">Sélectionner</option>
                <option>Aides à la Mobilité</option>
                <option>Équipement Respiratoire</option>
                <option>Lits d'Hôpital</option>
                <option>Sécurité Salle de Bain</option>
                <option>Lève-Personnes</option>
                <option>Aides à la Vie Quotidienne</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#084b88]">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-md p-2 bg-[#f0f7ff] border border-[#ccc]"
              rows="2"
              required
            />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#084b88]">
                Prix
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full rounded-md p-2 bg-[#f0f7ff] border border-[#ccc]"
                required
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#084b88]">
                Période
              </label>
              <select
                value={formData.rentalPeriod}
                onChange={(e) =>
                  setFormData({ ...formData, rentalPeriod: e.target.value })
                }
                className="w-full rounded-md p-2 bg-[#f0f7ff] border border-[#ccc]"
              >
                <option value="day">Jour</option>
                <option value="week">Semaine</option>
                <option value="month">Mois</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#084b88]">
                État
              </label>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                className="w-full rounded-md p-2 bg-[#f0f7ff] border border-[#ccc]"
                required
              >
                <option value="">Sélectionner</option>
                <option>Neuf</option>
                <option>Comme Neuf</option>
                <option>Excellent</option>
                <option>Bon</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#084b88]">
                Disponibilité
              </label>
              <select
                value={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.value })
                }
                className="w-full rounded-md p-2 bg-[#f0f7ff] border border-[#ccc]"
              >
                <option value="available">Disponible</option>
                <option value="pending">En attente</option>
                <option value="not-available">Non Disponible</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#084b88]">
                Emplacement
              </label>
              <select
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full rounded-md p-2 bg-[#f0f7ff] border border-[#ccc]"
                required
              >
                <option value="">Sélectionner</option>
                <option>Casablanca</option>
                <option>Rabat</option>
                <option>Marrakech</option>
                <option>Fès</option>
                <option>Tanger</option>
                <option>Agadir</option>
                <option>Meknès</option>
                <option>Oujda</option>
                <option>Kénitra</option>
                <option>Tétouan</option>
                <option>Safi</option>
                <option>Mohammedia</option>
                <option>El Jadida</option>
                <option>Béni Mellal</option>
                <option>Nador</option>
                <option>Khouribga</option>
                <option>Settat</option>
                <option>Berrechid</option>
                <option>Taza</option>
                <option>Khemisset</option>
                <option>Essaouira</option>
                <option>Taourirt</option>
                <option>Ouarzazate</option>
                <option>Larache</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#084b88] mb-1">
              Image
            </label>
            {formMode === "edit" && currentEquipment && (
              <p className="text-sm text-gray-500 mb-2">
                {currentEquipment.image
                  ? "Laissez vide pour conserver l'image actuelle"
                  : "Pas d'image actuelle"}
              </p>
            )}
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  Cliquez ou glissez-déposez une image
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF jusqu'à 10MB
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-[#0070cc] hover:bg-[#0058a6]"
              disabled={loading}
            >
              {loading
                ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {formMode === "add" ? "Ajout..." : "Mise à jour..."}
                  </span>
                )
                : (formMode === "add" ? "Ajouter" : "Mettre à jour")
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentForm;