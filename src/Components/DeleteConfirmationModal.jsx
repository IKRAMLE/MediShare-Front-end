import React from 'react';
import { X } from 'lucide-react';

const DeleteConfirmationModal = ({
  equipmentToDelete,
  loading,
  confirmDelete,
  cancelDelete
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#084b88]">
            Confirmer la Suppression
          </h3>
          <button
            onClick={cancelDelete}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>
        <p className="mb-6 text-gray-600">
          Êtes-vous sûr de vouloir supprimer <span className="font-medium text-gray-900">"{equipmentToDelete?.name}"</span>
          ? Cette action ne peut pas être annulée.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={cancelDelete}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
