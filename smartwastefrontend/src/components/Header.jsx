import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { IoLeafOutline } from 'react-icons/io5';

const NAV_ITEMS = [
  { name: 'Home', path: '#home' },
  { name: 'Services', path: '#services' },
  { name: 'About', path: '#about' },
  { name: 'Contact', path: '#contact' }
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-md fixed w-full top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4CBB17] to-[#3d9613] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <IoLeafOutline className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#2f7410] to-[#4CBB17] bg-clip-text text-transparent">
                EcoCollect
              </h1>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={() => setActiveItem(item.name)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeItem === item.name
                      ? 'text-[#2f7410] bg-[#edfae0]'
                      : 'text-gray-700 hover:text-[#4CBB17] hover:bg-[#edfae0]/50'
                  }`}
                >
                  {item.name}
                </a>
              ))}
              <a href="/signup" className="ml-4">
                <button className="bg-gradient-to-r from-[#4CBB17] to-[#3d9613] text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 transform">
                  Get Started
                </button>
              </a>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-[#4CBB17] hover:bg-[#edfae0] p-2 rounded-lg transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  activeItem === item.name
                    ? 'text-[#2f7410] bg-[#edfae0]'
                    : 'text-gray-700 hover:bg-[#edfae0]/50 hover:text-[#4CBB17]'
                }`}
                onClick={() => {
                  setActiveItem(item.name);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.name}
              </a>
            ))}
            <a
              href="/signup"
              className="block w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <button className="w-full mt-2 bg-gradient-to-r from-[#4CBB17] to-[#3d9613] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                Get Started
              </button>
            </a>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;