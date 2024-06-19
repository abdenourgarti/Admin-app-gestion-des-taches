import React, { useState } from 'react';
import Link from 'next/link';
import { FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../../app/Firebase/firebaseConfig';

const Navigation = ({ activeTab }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Rediriger vers la page de connexion après avoir fermé la session
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <nav className="bg-gray-800 text-gray-400 uppercase font-bold tracking-wide border-b border-white">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center">
          <button
            className="text-gray-400 focus:outline-none md:hidden ml-4"
            onClick={toggleNav}
          >
            {isNavOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div className="hidden md:flex">
            <Link
              href="/Comptes"
              className={`nav-item ml-5 px-4 py-2 cursor-pointer ${
                activeTab === 'tab1' ? 'bg-gray-900 text-white' : 'hover:bg-gray-700'
              }`}
            >
              Comptes
            </Link>
            <Link
              href="/Organisations"
              className={`nav-item ml-5 px-4 py-2 cursor-pointer ${
                activeTab === 'tab2' ? 'bg-gray-900 text-white' : 'hover:bg-gray-700'
              }`}
            >
              Organisations
            </Link>
          </div>
        </div>
        <div className="relative">
          <button
            className="text-red-500 focus:outline-none flex items-center mr-5 bg-white rounded-full"
            onClick={toggleDropdown}
          >
            <FaUserCircle
              size={32}
              className={`${!isDropdownOpen ? 'rounded-full border-2' : ''}`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-10">
              <Link
                href="/ProfilAdmin"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
              >
                <FaUserAlt className="mr-2" />
                Profil
              </Link>
              <button onClick={handleSignOut} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center">
                <FaSignOutAlt className="mr-2" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
      {isNavOpen && (
        <div className="md:hidden">
          <div className="py-2 bg-gray-800 text-center">
            <Link
              href="/Comptes"
              className={`block py-2 cursor-pointer ${
                activeTab === 'tab1' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              Comptes
            </Link>
            <Link
              href="/Organisations"
              className={`block py-2 cursor-pointer ${
                activeTab === 'tab2' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              Organisations
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;