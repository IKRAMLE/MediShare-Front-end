import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { User, ShoppingCart, Menu, X } from "lucide-react";
import ShoppingCartComponent from "../Components/ShoppingCard";
import logo from "/MediShare.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const dropdownTimeout = useRef(null);

  // Handle scrolling effect on navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load cart items from localStorage and listen for updates
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(cart);
      setCartCount(cart.length);
    };

    // Initial load
    updateCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCart();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Handle dropdown hover behavior
  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setIsAboutDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setIsAboutDropdownOpen(false);
    }, 200);
  };

  // Cart icon animation for badge
  const [cartBounce, setCartBounce] = useState(false);

  const toggleCart = () => {
    if (!isCartOpen) {
      // Animate the cart icon when opening
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 300);
    }
    setIsCartOpen(!isCartOpen);
  };

  // Handle removing item from cart
  const handleRemoveFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    setCartCount(updatedCart.length);
    // Dispatch event to notify other components
    window.dispatchEvent(
      new CustomEvent("cartUpdated", { detail: updatedCart.length })
    );
  };

  // Handle updating item quantity
  const handleUpdateQuantity = (itemId, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    // Dispatch event to notify other components
    window.dispatchEvent(
      new CustomEvent("cartUpdated", { detail: updatedCart.length })
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="h-7 w-20 mb-3 -mr-4">
                <img src={logo} alt="MediShare"  />
              </div>
              <span
                className={`font-medium text-xl ${
                  isScrolled ? "text-gray-900" : "text-gray-800"
                }`}
              >
                Medi<span className="text-blue-500">Share</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 ml-[130px]">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Accueil
              </Link>

              {/* About Dropdown */}
              <div
                className="relative group"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center">
                  À propos
                </button>
                {isAboutDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white text-gray-800 shadow-lg rounded-md py-2 border border-gray-100">
                    <a
                      href="#browse"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      Parcourir l'équipement
                    </a>
                    <a
                      href="#how-it-works"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      Comment ça marche
                    </a>
                    <a
                      href="#vision"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      Notre vision pour l'avenir
                    </a>
                    <a
                      href="#benefits"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      Avantages de notre plateforme
                    </a>
                  </div>
                )}
              </div>

              <Link
                to="/rent-equip"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Louer un équipement
              </Link>
              <a
                href="#contact-us"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Contact
              </a>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login2"
                className="rounded-full p-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={20} />
              </Link>

              <button
                onClick={toggleCart}
                className={`relative rounded-full p-2 text-gray-700 hover:bg-gray-50 transition-all ${
                  cartBounce ? "animate-bounce" : ""
                }`}
              >
                <ShoppingCart
                  size={20}
                  className={isCartOpen ? "text-blue-600" : ""}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden rounded-md p-2 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setIsMenuOpen(false)}
            ></div>
            <div className="fixed top-0 right-0 w-64 h-full bg-blue-600 text-white p-6">
              <div className="flex justify-end">
                <button
                  className="p-2 hover:bg-blue-400 rounded-full transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mt-6 flex flex-col space-y-4">
                <Link
                  to="/"
                  className="py-2 hover:text-blue-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  to="/rent-equip"
                  className="py-2 hover:text-blue-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Louer un équipement
                </Link>
                <Link
                  to="#contact-us"
                  className="py-2 hover:text-blue-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Shopping Cart Component */}
      <ShoppingCartComponent
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={handleRemoveFromCart}
        updateCartItemQuantity={handleUpdateQuantity}
      />
    </>
  );
};

export default Navbar;
