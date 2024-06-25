"use client"
import ViewCompteModal from '@/components/ViewCompteModal';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaPlus, FaEye, FaPen, FaTrash, FaTimes } from 'react-icons/fa';


const ComptesTable = ({ comptes, onDeleteCompte }) => {
  const [compteToDelete, setCompteToDelete] = useState(null);
  const [compteToView, setCompteToView] = useState(null);

  const handleDeleteCompte = (compte) => {
    setCompteToDelete(compte);
  };

  const confirmDeleteCompte = () => {
    onDeleteCompte(compteToDelete);
    setCompteToDelete(null);
  };

  const cancelDeleteCompte = () => {
    setCompteToDelete(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-xl">Liste des comptes</h1>
        <a
          href="/AddUser"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Ajouter
        </a>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="bg-gray-200 border border-gray-400 px-4 py-2">Nom et prénom</th>
            <th className="bg-gray-200 border border-gray-400 px-4 py-2">Email</th>
            <th className="bg-gray-200 border border-gray-400 px-4 py-2 w-64">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comptes.map((compte) => (
            <tr key={compte.id}>
              <td className="border border-gray-400 px-4 py-2">
                {compte.nom} {compte.prenom}
              </td>
              <td className="border border-gray-400 px-4 py-2">{compte.email}</td>
              <td className="border border-gray-400 px-4 py-2">
                <div className="flex flex-col md:flex-row justify-center items-center md:items-start">
                  <button
                    onClick={() => setCompteToView(compte)}
                    className="mr-2 mb-2 md:mb-0 text-green-500 hover:text-green-700 flex items-center"
                  >
                    <FaEye className="mr-1" /> Voir
                  </button>
                  <Link
                    href={{
                      pathname: '/UpdateUser',
                      query: { compteDetails: encodeURIComponent(JSON.stringify(compte)) },
                    }}
                    className="mr-2 mb-2 md:mb-0 text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <FaPen className="mr-1" /> Modifier
                  </Link>
                  <button
                    onClick={() => handleDeleteCompte(compte)}
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

      <ViewCompteModal compte={compteToView} onClose={() => setCompteToView(null)} />

      {compteToDelete && (
        <div className="text-white fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-700 rounded-lg shadow-lg p-6 relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={cancelDeleteCompte}
            >
              <FaTimes color="white" />
            </button>
            <div className="mb-4 text-lg font-semibold">Confirmation</div>
            <div className="mb-4">
              Êtes-vous sûr de vouloir supprimer le compte {compteToDelete.nom} {compteToDelete.prenom} ?
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={cancelDeleteCompte}
              >
                Annuler
              </button>
              <button
                type="button"
                className="bg-[#fc4545] text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600"
                onClick={confirmDeleteCompte}
              >
                <FaTrash className="mr-1" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComptesTable;