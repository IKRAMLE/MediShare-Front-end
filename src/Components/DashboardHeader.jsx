import React from 'react';
import { Bell, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const DashboardHeader = ({ isSidebarOpen, setIsSidebarOpen, searchQuery, setSearchQuery, userData }) => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-[#e0f0fe] text-[#0070cc] transition-colors"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        <h1 className="text-xl font-semibold text-[#084b88]">
          Bienvenue sur votre tableau de bord
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#37aaf8]"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un équipement..."
            className="bg-[#f0f7ff] rounded-full pl-10 pr-4 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-[#108de4] text-sm"
          />
        </div>

        <div className="relative">
          <button className="p-2 rounded-full hover:bg-[#e0f0fe] text-[#0070cc] transition-colors">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white cursor-pointer -mt-1"
          style={{
            backgroundColor: "#0058a6",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          {userData?.photoURL ? (
            <img
              src={userData.photoURL}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-base font-bold">
              {userData?.email?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
