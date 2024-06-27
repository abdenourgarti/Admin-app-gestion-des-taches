import ViewOrganisationModal from '@/components/ViewOrganisationModal';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaPlus, FaEye, FaPen, FaTrash, FaTimes } from 'react-icons/fa';
import axios from "axios";

const OrganisationsTable = ({ organisations, recharge }) => {
  const [organisationToDelete, setOrganisationToDelete] = useState(null);
  const [organisationToView, setOrganisationToView] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [popupMessage, setPopupMessage] = useState('');

  const axiosInstance = axios.create({
    baseURL: "https://back-pfe-master.vercel.app",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const onDeleteOrganisation = async (organisation) => {
    try {
      const response = await axiosInstance.delete(`/user/users/${organisation.Boss._id}`);
      
      if (response.status === 200) {
        console.log("Utilisateur supprimé avec succès de la base de données");
        setPopupType('success');
        setPopupMessage('Utilisateur supprimé avec succès.');
        setShowPopup(true);
        recharge();
      } else {
        throw new Error("Erreur lors de la suppression de l'utilisateur de la base de données");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      setPopupType('error');
      setPopupMessage(`Erreur lors de la suppression : ${error.message}`);
      setShowPopup(true);
    }
    try {
      const response = await axiosInstance.delete(`/organization/organizations/${organisation._id}`);
      
      if (response.status === 200) {
        console.log("organisation supprimé avec succès de la base de données");
        setPopupType('success');
        setPopupMessage('organisation supprimé avec succès.');
        setShowPopup(true);
        recharge();
      } else {
        throw new Error("Erreur lors de la suppression de l'organisation de la base de données");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'organisation:", error);
      setPopupType('error');
      setPopupMessage(`Erreur lors de la suppression : ${error.message}`);
      setShowPopup(true);
    }
  }

  const handleDeleteOrganisation = (organisation) => {
    setOrganisationToDelete(organisation);
  };

  const confirmDeleteOrganisation = () => {
    onDeleteOrganisation(organisationToDelete);
    setOrganisationToDelete(null);
  };

  const cancelDeleteOrganisation = () => {
    setOrganisationToDelete(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-xl">Liste des organisations</h1>
        <a
          href="/AddOrganisation"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Ajouter
        </a>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="bg-gray-200 border border-gray-400 px-4 py-2">Nom</th>
            <th className="bg-gray-200 border border-gray-400 px-4 py-2">Propriétaire </th>
            <th className="bg-gray-200 border border-gray-400 px-4 py-2">Email </th>
            <th className="bg-gray-200 border border-gray-400 px-4 py-2 w-64">Actions</th>
          </tr>
        </thead>
        <tbody>
          {organisations.map((organisation) => (
            <tr key={organisation.id}>
              <td className="border border-gray-400 px-4 py-2">{organisation.Name}</td>
              <td className="border border-gray-400 px-4 py-2">{organisation.Boss.nom} {organisation.Boss.prenom}</td>
              <td className="border border-gray-400 px-4 py-2">{organisation.Boss.email}</td>
              <td className="border border-gray-400 px-4 py-2">
                <div className="flex flex-col md:flex-row justify-center items-center md:items-start">
                  <button                    
                    onClick={() => setOrganisationToView(organisation)}
                    className="mr-2 mb-2 md:mb-0 text-green-500 hover:text-green-700 flex items-center"
                  >
                    <FaEye className="mr-1" /> Voir
                  </button>
                  <Link
                    href={{
                      pathname: '/UpdateOrganisation',
                      query: { organisationDetails: encodeURIComponent(JSON.stringify(organisation)) },
                    }}
                    className="mr-2 mb-2 md:mb-0 text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <FaPen className="mr-1" /> Modifier
                  </Link>
                  <button
                    onClick={() => handleDeleteOrganisation(organisation)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <FaTrash className="mr-1" /> Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ViewOrganisationModal
        organisation={organisationToView}
        onClose={() => setOrganisationToView(null)}
      />

      {organisationToDelete && (
        <div className="text-white fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-700 rounded-lg shadow-lg p-6 relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={cancelDeleteOrganisation}
            >
              <FaTimes color="white" />
            </button>
            <div className="mb-4 text-lg font-semibold">Confirmation</div>
            <div className="mb-4">
              Êtes-vous sûr de vouloir supprimer l&aposorganisation {organisationToDelete.nom} ?
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={cancelDeleteOrganisation}
              >
                Annuler
              </button>
              <button
                type="button"
                className="bg-[#fc4545] text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600"
                onClick={confirmDeleteOrganisation}
              >
                <FaTrash className="mr-1" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className={`bg-white p-6 rounded-lg shadow-lg ${popupType === 'success' ? 'border-green-500' : 'border-red-500'} border-4`}>
            <h2 className={`text-2xl font-bold mb-4 ${popupType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {popupType === 'success' ? 'Succès' : 'Erreur'}
            </h2>
            <p className="mb-4">{popupMessage}</p>
            <button
              onClick={() => {
                setShowPopup(false);
                if (popupType === 'success') {
                  // Vous pouvez appeler handleCancel ici si nécessaire
                }
              }}
              className={`px-4 py-2 rounded ${popupType === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganisationsTable;