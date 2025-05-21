import React from 'react';
import { Plus, Package, X, Edit, Trash2 } from 'lucide-react';

const MyEquipment = ({
  handleAddEquipment,
  loading,
  error,
  setError,
  filteredEquipment,
  handleEditEquipment,
  handleDeleteClick
}) => {
  return (
    <div className="bg-[#e0f0fe] shadow-sm p-6 mb-8 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#084b88]">
            Mon Équipement
          </h2>
          <p className="text-md text-[#108de4] mt-1">
            Gérez vos annonces d'équipement médical
          </p>
        </div>
        <button
          onClick={handleAddEquipment}
          className="bg-[#0070cc] hover:bg-[#0058a6] text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Ajouter Nouvel Équipement
        </button>
      </div>

      {loading && <div className="text-center py-8">Chargement...</div>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
          <button
            onClick={() => setError(null)}
            className="absolute top-0 right-0 p-3"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {!loading && !error && filteredEquipment.length === 0 ? (
        <div className="text-center py-16 px-6 bg-[#f0f7ff] rounded-xl">
          <div className="rounded-full p-4 bg-[#e0f0fe] text-[#0070cc] mx-auto w-22 h-22 flex items-center justify-center mb-4">
            <Package size={60} />
          </div>
          <h3 className="font-semibold text-lg text-[#084b88] mb-2">
            Aucun équipement trouvé
          </h3>
          <p className="text-[#108de4] mb-6 max-w-md mx-auto">
            Vous n'avez pas encore ajouté d'équipement médical. Ajoutez
            votre premier article pour commencer à le louer.
          </p>
          <button
            onClick={handleAddEquipment}
            className="bg-[#0070cc] hover:bg-[#0058a6] text-white px-6 py-3 rounded-lg flex items-center mx-auto"
          >
            <Plus size={20} className="mr-2" />
            Ajouter Votre Premier Équipement
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-50 bg-gray-200 relative">
                {item.image ? (
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-[#f0f7ff]">
                    <Package size={64} className="text-[#0070cc]" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[#084b88] mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.description.length > 100
                    ? `${item.description.substring(0, 28)}...`
                    : item.description}
                </p>
                <p className="text-[#0070cc] font-bold">
                  {item.price} MAD/
                  {item.rentalPeriod === "day" ? "jour" : "mois"}
                </p>

                {/* Edit and Delete buttons */}
                <div className="flex justify-end space-x-2 -mt-7">
                  <button
                    onClick={() => handleEditEquipment(item)}
                    className="p-2 bg-[#e0f0fe] text-[#0070cc] rounded-full hover:bg-[#0070cc] hover:text-white transition-colors"
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEquipment;