import React from 'react';
import { LogOut } from 'lucide-react';
import logo from "/MediShare.png";

const Sidebar = ({ isSidebarOpen, menuItems, activeMenuItem, handleMenuClick, handleLogout }) => {
  
  return (
    <div
      className={`bg-gradient-to-b from-[#084b88] to-[#082a4d] text-white transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      } fixed h-full z-40 shadow-xl`}
    >
      <div className="flex items-center justify-between p-4">
        <div className={`flex items-center ${!isSidebarOpen && "justify-center w-full"}`}>
        <div className="h-7 w-20 mb-3 -mr-4 -ml-4">
                <img src={logo} alt="MediShare"  />
              </div>
          {isSidebarOpen && <span className="font-semibold text-xl">MediShare</span>}
        </div>
      </div>

      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.text}
              className={`flex items-center py-3 px-4 rounded-xl cursor-pointer transition-all duration-200 ${
                activeMenuItem === item.path
                  ? "bg-[#0058a6] text-white"
                  : "text-[#e0f0fe] hover:bg-[#0058a6]/50"
              }`}
              onClick={() => handleMenuClick(item.path)}
            >
              <item.icon size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
              {isSidebarOpen && <span>{item.text}</span>}
            </div>
          ))}
        </div>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-[#0058a6]">
        <button
          onClick={handleLogout}
          className={`flex items-center text-red-300 hover:text-red-100 hover:bg-red-900/20 py-3 px-4 rounded-xl w-full transition-colors ${
            !isSidebarOpen && "justify-center"
          }`}
        >
          <LogOut size={20} className={isSidebarOpen ? "mr-3" : ""} />
          {isSidebarOpen && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;