import React from 'react';
import { FaTimes, FaMapMarkedAlt, FaUser, FaEnvelope, FaPhoneAlt, FaGlobeAmericas, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';

const ViewOrganisationModal = ({ organisation, onClose }) => {
  if (!organisation) {
    return null;
  }

  const parseJSON = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return jsonString;
    }
  };

  const country = parseJSON(organisation.country);

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-xl sm:w-full relative">
        <div className="bg-[#314155] h-10 flex items-center justify-between px-4">
          <h3 className="text-lg font-medium text-white">Détails de l'organisation</h3>
          <button type="button" className="text-white hover:text-gray-300" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Section Organisation (Gauche) */}
            <div className="md:w-1/2">
              <div className="flex items-center mb-4">
                <div className="bg-white w-20 h-20 flex items-center justify-center rounded-full mr-4">
                  <FaBuilding className="text-6xl text-[#314155]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{organisation.Name}</h2>
                  <p className="flex items-center text-gray-600 mb-2">
                    <FaGlobeAmericas className="text-gray-400 mr-2"/>
                    <span>Pays: {country.name}</span>
                  </p>
                  <p className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="text-gray-400 mr-2"/>
                    <span>Province: {organisation.province}</span>
                  </p>
                  <p className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkedAlt className="text-gray-400 mr-2"/>
                    <span>Adresse: {organisation.street}</span>
                  </p>
                </div>
              </div>
            </div>
            <h4 className="text-lg font-semibold mb-2">Informations du propriétaire</h4>
            {/* Section Propriétaire (Droite) */}
            <div className="md:w-1/2">
              <div className="flex items-center mb-4">
                <div className="h-20 w-20 relative flex justify-center items-center rounded-full bg-[#314155] text-2xl text-white mr-4">    
                  {organisation.Boss.nom[0].toUpperCase()}{" "}
                  {organisation.Boss.prenom[0].toUpperCase()} 
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{organisation.Boss.nom} {organisation.Boss.prenom}</h2>
                  <p className="flex items-center text-gray-600">
                    <FaEnvelope className="text-gray-400 mr-2"/>
                    <span>{organisation.Boss.email}</span>
                  </p>
                  <p className="flex items-center text-gray-600">
                    <FaPhoneAlt className="text-gray-400 mr-2" />
                    <span>{organisation.Boss.phoneNumber}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrganisationModal;
