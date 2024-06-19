import React from 'react';
import { FaTimes, FaMapMarkedAlt, FaUserTie, FaEnvelope, FaPhoneAlt, FaGlobeAmericas, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';

const ViewOrganisationModal = ({ organisation, onClose }) => {
  if (!organisation) {
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
          <div className="bg-white w-32 h-32 flex items-center justify-center md:ml-6 rounded-full md:mb-0 mb-4">
            <FaBuilding className="text-6xl text-[#314155]" />
          </div>

          <div className="md:ml-12 w-full md:w-2/3 md:pl-4 relative text-center md:text-left">
            <h2 className="text-2xl font-semibold font-serif mb-1">{organisation.nom}</h2>
            <p className="text-gray-500 md:ml-2">Propriétaire: {organisation.proprietaire}</p>
            <p className="text-gray-500 md:ml-2">ID: {organisation.id}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row py-4 px-6">
          <div className="w-full md:w-1/2 pr-4 mb-4 md:mb-0">
            
            <div className="flex items-center mb-2">
              <FaGlobeAmericas className="text-gray-400 mr-2" />
              <p className="text-gray-400 font-semibold">Pays</p>
            </div>
            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              {organisation.pays}
            </div>
            <div className="flex items-center mt-2 mb-2">
              <FaMapMarkerAlt className="text-gray-400 mr-2" />
              <p className="text-gray-400 font-semibold">Province</p>
            </div>
            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              {organisation.province}
            </div>
            <div className="flex items-center mt-2 mb-2">
              <FaMapMarkedAlt className="text-gray-400 mr-2" />
              <p className="text-gray-400 font-semibold">Adresse</p>
            </div>
            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              {organisation.rue}
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-4 md:border-l-2 md:border-[#314155]">
            <div className="flex items-center mb-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <p className="text-gray-400 font-semibold">Email</p>
            </div>
            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              {organisation.email}
            </div>
            <div className="flex items-center mt-2 mb-2">
              <FaPhoneAlt className="text-gray-400 mr-2" />
              <p className="text-gray-400 font-semibold">Téléphone</p>
            </div>
            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              {organisation.telephone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrganisationModal;