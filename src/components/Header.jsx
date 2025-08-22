import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-gray-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-end p-6 lg:px-8">
        <button
          onClick={handleSignout}
          className="text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </nav>
    </header>
  );
};

export default Header;