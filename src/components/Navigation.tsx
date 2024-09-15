import Link from 'next/link';
import { ShoppingBag, Search, Menu } from "lucide-react";

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <div className="text-2xl font-extrabold text-indigo-600">URBANEDGE</div>
      <div className="hidden md:flex space-x-6 text-sm font-medium">
        <a href="#" className="hover:text-indigo-600 transition-colors">
          New Arrivals
        </a>
        <a href="#" className="hover:text-indigo-600 transition-colors">
          Collections
        </a>
        <a href="#" className="hover:text-indigo-600 transition-colors">
          Sustainability
        </a>
        <a href="#" className="hover:text-indigo-600 transition-colors">
          About Us
        </a>
      </div>
      <div className="flex items-center space-x-4">
        <Search
          size={20}
          className="text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors"
        />
        <div className="relative">
          <ShoppingBag
            size={20}
            className="text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors"
          />
          <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </div>
        <Menu
          size={20}
          className="md:hidden text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors"
        />
      </div>
    </div>
  </nav>
  );
};

export default Navigation;