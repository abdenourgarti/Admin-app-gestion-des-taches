import React from 'react';
import { FaTimes, FaUserAlt, FaBuilding, FaUserFriends, FaEnvelope, FaPhoneAlt, FaVenusMars } from 'react-icons/fa';

const ViewCompteModal = ({ compte, onClose }) => {
  if (!compte) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full relative">
        <div className="bg-[#314155] h-7 flex items-center justify-between px-4">
          <div></div>
          <button type="button" className="text-white hover:text-gray-300" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="flex flex-col items-center md:flex-row p-4">
          <div className="bg-[#314155] w-32 h-32 flex items-center justify-center md:ml-6 rounded-full md:mb-0 mb-4">
            <FaUserAlt className="text-6xl text-white" />
          </div>

          <div className="md:ml-12 w-full md:w-2/3 md:pl-4 relative text-center md:text-left">
            <h2 className="text-2xl font-semibold font-serif mb-1">{compte.nom} {compte.prenom}</h2>
            <p className="text-gray-500 md:ml-2">Rôle: {compte.role}</p>
            <p className="text-gray-500 md:ml-2">ID: {compte.id}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row py-4 px-6">
          <div className="w-full md:w-1/2 pr-4 mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <FaBuilding className="text-gray-400 mr-2" />
              <p className="text-gray-400 font-semibold">Organisation</p>
            </div>
            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              {compte.organisation}
            </div>

            <div className="flex items-center mt-2 mb-2">
              
              <p className="text-gray-400 font-semibold">Sexe</p>
            </div>
            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              {compte.sexe==='homme' ? 
                (<div className="ml-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M220-80v-300h-60v-220q0-33 23.5-56.5T240-680h120q33 0 56.5 23.5T440-600v220h-60v300H220Zm80-640q-33 0-56.5-23.5T220-800q0-33 23.5-56.5T300-880q33 0 56.5 23.5T380-800q0 33-23.5 56.5T300-720Z" />
                </svg>
                <span className="ml-2">Homme</span>
              </div>) 
            : (
              <div className="ml-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 -960 960 960"
                          width="24"
                        >
                          <path d="M600-80v-240H480l102-306q8-26 29.5-40t48.5-14q27 0 48.5 14t29.5 40l102 306H720v240H600Zm60-640q-33 0-56.5-23.5T580-800q0-33 23.5-56.5T660-880q33 0 56.5 23.5T740-800q0 33-23.5 56.5T660-720Z" />
                        </svg>
                        <span className="ml-2">Femme</span>
                      </div>
            )}

            </div>
          </div>

          <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-4 md:border-l-2 md:border-[#314155]">
            <div className="flex items-center mb-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <p className="text-gray-400 font-semibold">Email</p>
            </div>
            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              {compte.email}
            </div>

            <div className="flex items-center mt-2 mb-2">
              <FaPhoneAlt className="text-gray-400 mr-2" />
              <p className="text-gray-400 font-semibold">Téléphone</p>
            </div>
            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              {compte.telephone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCompteModal;