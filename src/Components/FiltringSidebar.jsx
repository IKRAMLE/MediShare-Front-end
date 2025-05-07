import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";

function FilteringSidebar({ onFilterChange }) {
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [availability, setAvailability] = useState("");
  const [condition, setCondition] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [categories, setCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);

  // Fetch categories and max price from API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axiosInstance.get('/equipment');
        const equipment = response.data.data;
        
        // Extract unique categories
        const uniqueCategories = [...new Set(equipment.map(item => item.category))];
        setCategories(uniqueCategories);
        
        // Find max price
        const highestPrice = Math.max(...equipment.map(item => item.price));
        setMaxPrice(Math.ceil(highestPrice / 100) * 100); // Round up to nearest hundred
        setPriceRange({ min: 0, max: highestPrice });
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    
    fetchFilters();
  }, []);

  // Function to handle filter changes
  const handleFilterChange = () => {
    onFilterChange({
      category,
      priceRange,
      availability,
      condition,
      sortBy,
    });
  };

  // Handle price range changes
  const handlePriceChange = (value) => {
    setPriceRange(prev => ({ ...prev, max: parseInt(value) }));
  };

  return (
    <div className="p-6 rounded-lg shadow bg-gradient-to-b from-[#084b88] to-[#082a4d] mt-30 ml-5 w-80 h-145">
      <h4 className="text-lg font-medium mb-4 text-[#ffffff]">Filtres</h4>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Category Filter */}
        <div className="mb-4">
          <label htmlFor="category" className="block mb-2 text-sm text-[#ffffff]">
            Catégorie
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 bg-white border-[#e5e3e0] text-[#2c3e50] focus:outline-[#3498db]"
          >
            <option value="">Toutes les Catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="mb-4">
          <label htmlFor="priceRange" className="block mb-2 text-sm text-[#ffffff]">
            Prix Maximum
          </label>
          <input
            type="range"
            id="priceRange"
            min="0"
            max={maxPrice}
            value={priceRange.max}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#e5e3e0]"
          />
          <div className="flex justify-between text-xs mt-1 text-[#ffffff]">
            <span>0 DH</span>
            <span>{priceRange.max} DH</span>
          </div>
        </div>

        {/* Availability Filter */}
        <div className="mb-4">
          <label htmlFor="availability" className="block mb-2 text-sm text-[#ffffff]">
            Disponibilité
          </label>
          <select
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 bg-white border-[#e5e3e0] text-[#2c3e50] focus:outline-[#3498db]"
          >
            <option value="">Tous</option>
            <option value="available">Disponible</option>
            <option value="unavailable">Non Disponible</option>
          </select>
        </div>

        {/* Condition Filter */}
        <div className="mb-4">
          <label htmlFor="condition" className="block mb-2 text-sm text-[#ffffff]">
            État
          </label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 bg-white border-[#e5e3e0] text-[#2c3e50] focus:outline-[#3498db]"
          >
            <option value="">Tous les États</option>
            <option value="new">Neuf</option>
            <option value="like-new">Comme Neuf</option>
            <option value="excellent">Excellent</option>
            <option value="good">Bon</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="mb-4">
          <label htmlFor="sortBy" className="block mb-2 text-sm text-[#ffffff]">
            Trier Par
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 bg-white border-[#e5e3e0] text-[#2c3e50] focus:outline-[#3498db]"
          >
            <option value="">Par défaut</option>
            <option value="price-asc">Prix: Croissant</option>
            <option value="price-desc">Prix: Décroissant</option>
            <option value="name-asc">Nom: A-Z</option>
            <option value="name-desc">Nom: Z-A</option>
          </select>
        </div>

        {/* Apply Button */}
        <button
          type="button"
          onClick={handleFilterChange}
          className="w-full py-2 px-4 mt-4 rounded transition duration-150 ease-in-out text-black bg-[#ffffff] hover:bg-[#adb4b8]"
        >
          Appliquer les Filtres
        </button>
      </form>
    </div>
  );
}

export default FilteringSidebar;
