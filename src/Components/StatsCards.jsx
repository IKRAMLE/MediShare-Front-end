import React from 'react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-[#084b88] text-sm font-medium mb-2">
          Équipement Total
        </h3>
        <p className="text-3xl font-bold text-[#0070cc]">
          {stats.totalEquipment}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-[#084b88] text-sm font-medium mb-2">
          Annonces Actives
        </h3>
        <p className="text-3xl font-bold text-green-500">
          {stats.active}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-[#084b88] text-sm font-medium mb-2">
          Annonces En Attente
        </h3>
        <p className="text-3xl font-bold text-yellow-500">
          {stats.pending}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-[#084b88] text-sm font-medium mb-2">
          Revenu Total
        </h3>
        <p className="text-3xl font-bold text-[#0070cc]">
          0 MAD
        </p>
      </div>
    </div>
  );
};

export default StatsCards;
