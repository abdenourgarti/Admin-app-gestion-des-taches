import React from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhoneAlt, FaVenusMars, FaBuilding, FaUsers } from 'react-icons/fa';

const ViewCompteModal = ({ compte, onClose }) => {
  if (!compte) return null;

  // Fonction pour regrouper les équipes par organisation
  const groupTeamsByOrganization = () => {
    const teamsByOrg = {};
    compte.roles.forEach(role => {
      if (role.role === 'teamBoss' || role.role === 'employee') {
        const orgId = role.organization._id;
        const teamsForOrg = compte.team.filter(team => team.Organization === orgId);
        if (teamsForOrg.length > 0) {
          teamsByOrg[orgId] = {
            organization: role.organization,
            teams: teamsForOrg,
            role: role.role
          };
        }
      }
    });
    return teamsByOrg;
  };

  const teamsByOrg = groupTeamsByOrganization();
  const getRole = (role) => {
    switch (role) {
      case "teamBoss":
        return "Chef de l'équipe"
        break;
      case "prjctBoss":
        return "Chef de projet"
        break;
      case "employee":
        return "Membre dans l'équipe"
        break;
    }
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-xl sm:w-full relative">
        <div className="bg-[#314155] h-10 flex items-center justify-between px-4">
          <h3 className="text-lg font-medium text-white">Détails du compte</h3>
          <button type="button" className="text-white hover:text-gray-300" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center mb-4">
            <div className="h-20 w-20 relative flex justify-center items-center rounded-full bg-[#314155] text-2xl text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 mr-4">    
              {compte?.nom[0].toUpperCase()}{" "}
              {compte?.prenom[0].toUpperCase()} 
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{`${compte.nom} ${compte.prenom}`}</h2>
              <p className="flex items-center text-gray-600">
                <FaEnvelope className="text-gray-400 mr-2"/>
                <span>{compte.email}</span>
              </p>
              <p className="flex items-center text-gray-600">
                <FaPhoneAlt className="text-gray-400 mr-2" />
                <span>{compte.phoneNumber}</span>
              </p>
              <p className="flex items-center text-gray-600">
                <FaVenusMars className="text-gray-400 mr-2" />
                <span>{JSON.parse(compte.gender).label}</span>
              </p>
            </div>
          </div>
          {(compte.roles.length == 1 && compte.roles[0].role === "individual") 
            ? (
              <div className="w-full my-4 py-2 text-gray-00 flex justify-center items-center border-gray-600 border-2 border-dashed">
                No Organizations
              </div>
              ) 
            :
              (
                <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Rôles, Organisations et Équipes</h4>
                {compte.roles.map((role, index) => (
                  <div key={index} className="bg-gray-100 p-3 rounded-lg mb-2">
                    <div className="flex items-center mb-1">
                      <FaBuilding className="text-gray-400 mr-2" />
                      <span className="font-medium">{role.organization.Name}</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6 mb-2">
                      {getRole(role.role)}
                      {teamsByOrg[role.organization._id] && (
                          teamsByOrg[role.organization._id].teams.map((team, teamIndex) => (
                              ` ${team.Name}`
                          ))
                      )}
                    </p>
                  </div>
                ))}
              </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default ViewCompteModal;