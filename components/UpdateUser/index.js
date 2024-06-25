import React, { useState, useEffect } from "react";
import { Formik, Field, FieldArray, ErrorMessage } from "formik";
import { FaTrash, FaPlus, FaEye, FaEyeSlash, FaBuilding, FaEnvelope, FaPhoneAlt, FaVenusMars, FaTimes } from "react-icons/fa";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import axios from "axios";
import * as Yup from 'yup';

const UpdateUserForm = ({ compte, handleCancel }) => {
  const [phoneValue, setPhoneValue] = useState(compte.phoneNumber);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
  const [organisations, setOrganisations] = useState([]);
  const [allOrganisations, setAllOrganisations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [roles, setRoles] = useState([]);
  const [teamsArray, setTeamsArray] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // ou "error"

  const axiosInstance = axios.create({
    baseURL: "http://localhost:1937",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getAllOrganizations = async () => {
    try {
      const response = await axiosInstance.get("/organization/AllOrganizations");
      console.log("organizations = ", response.data);
      setAllOrganisations(response.data);
  
      const filteredOrganizations = response.data.filter(org => {
        return !compte.roles.some(role => role.organization?._id === org._id);
      });
  
      setOrganisations(filteredOrganizations.map(org => ({
        value: org._id,
        label: org.Name,
        ...org
      })));
    } catch (error) {
      console.error("Erreur lors de la récupération des organisations :", error);
    }
  };

  const fetchTeams = async (organisationId) => {
    try {
      const response = await axiosInstance.get(`/team/teams?Organization=${organisationId}`);
      setTeams(response.data.map(team => ({
        value: team._id,
        label: team.Name,
        ...team
      })));
    } catch (error) {
      console.error("Erreur lors de la récupération des équipes :", error);
    }
  };

  useEffect(() => {
    getAllOrganizations();
    setRoles(compte.roles);
    setTeamsArray(compte.team)
  }, []);

  useEffect(() => {
    
    console.log("teamsArray = ", teamsArray)
  }, [teamsArray]);

  useEffect(() => {
    
    console.log("roles = ", roles)
  }, [roles]);

  const initialValues = {
    nom: compte.nom || "",
    prenom: compte.prenom || "",
    email: compte.email || "",
    phoneNumber: compte.phoneNumber || "",
    gender: (() => {
      if (typeof compte.gender === 'string') {
        try {
          const parsedGender = JSON.parse(compte.gender);
          return parsedGender.value || "";
        } catch (e) {
          // Si le parsing échoue, on considère que c'est déjà une valeur simple
          return compte.gender;
        }
      }
      return compte.gender?.value || "";
    })(),
    newPassword: "",
    confirmNewPassword: "",
    roles: compte.roles || [],
    newRole: {
      organisation: null,
      role: "",
      equipe: null
    }
  };

  const validationSchema = Yup.object().shape({
    nom: Yup.string().required("Le nom est requis"),
    prenom: Yup.string().required("Le prénom est requis"),
    email: Yup.string().email("Email invalide").required("L'email est requis"),
    phoneNumber: Yup.string().required("Le numéro de téléphone est requis"),
    gender: Yup.string().required("Le genre est requis"),
    newPassword: Yup.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Les mots de passe doivent correspondre')
  });

  const genderOptions = [
    { value: "male", label: "Homme" },
    { value: "female", label: "Femme" }
  ];

  const roleOptions = [
    { value: "employee", label: "Employé" },
    { value: "prjctBoss", label: "Chef de projet" },
  ];

  const handleAddRole = (values, setFieldValue) => {
    if (values.newRole.organisation && values.newRole.role) {
      const organisation = allOrganisations.find(org => org._id === values.newRole.organisation.value);
  
      if (organisation) {
        if (values.newRole.role === "employee" && !values.newRole.equipe) {
          console.error("Veuillez sélectionner une équipe pour le rôle d'employé.");
          return;
        }
  
        const role = {
          role: values.newRole.role,
          organization: organisation,
        };
  
        const newRoles = [...roles, role];
        setRoles(newRoles);
        setFieldValue("roles", newRoles);
  
        const updatedOrganisations = organisations.filter(org => org.value !== values.newRole.organisation.value);
        setOrganisations(updatedOrganisations);
  
        // Mise à jour de teamsArray
        if (values.newRole.role === "employee" && values.newRole.equipe) {
          const newTeam = {
            ...values.newRole.equipe,
            Organization: organisation._id
          };
          setTeamsArray(prevTeams => [...prevTeams, newTeam]);
        }
  
        setFieldValue("newRole", { organisation: null, role: "", equipe: null });
      } else {
        console.error("Organisation non trouvée");
      }
    } else {
      console.error("Organisation ou rôle non sélectionné");
    }
  };

  const handleDeleteRole = (index, values, setFieldValue) => {
    setRoleToDelete(index);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteRole = (values, setFieldValue) => {
    if (roleToDelete !== null) {
      const roleToRemove = values.roles[roleToDelete];
      
      const updatedRoles = values.roles.filter((_, index) => index !== roleToDelete);
      setRoles(updatedRoles);
      setFieldValue("roles", updatedRoles);
      if (roleToRemove.role !== "individual") {
        const updatedOrganisations = [...organisations, {
          value: roleToRemove.organization._id,
          label: roleToRemove.organization.Name,
          ...roleToRemove.organization
        }];
        setOrganisations(updatedOrganisations);
  
        // Mise à jour de teamsArray
        const updatedTeamsArray = teamsArray.filter(team => 
          team.Organization !== roleToRemove.organization._id
        );
        setTeamsArray(updatedTeamsArray);
      }
      

  
      setShowDeleteConfirmation(false);
      setRoleToDelete(null);
    }
  };

  const cancelDeleteRole = () => {
    setShowDeleteConfirmation(false);
    setRoleToDelete(null);
  };

  const updateUser = async (values) => {
    try {
      let filteredRoles;
      if (roles.length > 0) {
        filteredRoles = roles.map(role => ({
          role: role.role,
          organization: role.organization._id
        }));
      } else {
        filteredRoles = [{
          role: "individual",
          organization: null
        }];
      }
      
  
      const filteredTeams = teamsArray.map(team => team._id);
  
      const userData = {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        phoneNumber: values.phoneNumber,
        gender: values.gender,
        roles: filteredRoles,
        team: filteredTeams
      };
  
      if (values.newPassword) {
        userData.password = values.newPassword;
      }
  
      const response = await axiosInstance.patch(`/user/updateUser?id=${compte._id}`, userData);
  
      if (response.status === 200) {
        console.log("Utilisateur mis à jour avec succès :", response.data);
        setPopupMessage("Utilisateur mis à jour avec succès !");
        setPopupType("success");
        setShowPopup(true);
      } else {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", response.data);
        setPopupMessage("Erreur lors de la mise à jour de l'utilisateur.");
        setPopupType("error");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      setPopupMessage("Erreur de connexion au serveur.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  const confirmUpdate = (values) => {
    updateUser(values);
    setShowUpdateConfirmation(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('/BG.jpeg')]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => setShowUpdateConfirmation(true)}
        >
          {({ values, setFieldValue, handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Informations personnelles</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nom" className="block mb-1">Nom</label>
                    <Field name="nom" type="text" className="w-full p-2 border rounded" />
                    <ErrorMessage name="nom" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="prenom" className="block mb-1">Prénom</label>
                    <Field name="prenom" type="text" className="w-full p-2 border rounded" />
                    <ErrorMessage name="prenom" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block mb-1 flex items-center">
                  <FaEnvelope className="mr-2" /> Email
                </label>
                <Field name="email" type="email" className="w-full p-2 border rounded" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block mb-1 flex items-center">
                  <FaPhoneAlt className="mr-2" /> Numéro de téléphone
                </label>
                <PhoneInput
                  value={phoneValue}
                  onChange={(value) => {
                    setPhoneValue(value);
                    setFieldValue("phoneNumber", value);
                  }}
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label htmlFor="gender" className="block mb-1 flex items-center">
                  <FaVenusMars className="mr-2" /> Genre
                </label>
                <Select
                  options={genderOptions}
                  value={genderOptions.find(option => option.value === values.gender)}
                  onChange={(selectedOption) => setFieldValue("gender", selectedOption.value)}
                  className="w-full"
                />
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Changer le mot de passe (optionnel)</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="newPassword" className="block mb-1">Nouveau mot de passe</label>
                    <Field name="newPassword" type={showNewPassword ? "text" : "password"} className="w-full p-2 border rounded pr-10" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="relative">
                    <label htmlFor="confirmNewPassword" className="block mb-1">Confirmer le nouveau mot de passe</label>
                    <Field name="confirmNewPassword" type={showConfirmNewPassword ? "text" : "password"} className="w-full p-2 border rounded pr-10" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    >
                      {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <ErrorMessage name="confirmNewPassword" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Rôles et Organisations</h2>
                <FieldArray name="roles">
                  {() => (
                    <div>
                      {roles.map((role, index) => {
                        const correspondingTeam = teamsArray.find(team => team.Organization === role.organization?._id);
                        return (
                          <div key={index} className="mb-4 p-4 border rounded bg-gray-50 flex justify-between items-center">
                            <div className="flex items-center">
                              <FaBuilding className="mr-2 text-gray-600" />
                              <div>
                                <h3 className="font-semibold">{role.organization?.Name}</h3>
                                <p>Rôle: {role.role}</p>
                                {correspondingTeam && <p>Équipe: {correspondingTeam.Name}</p>}
                              </div>
                            </div>
                            <div>
                              <button 
                                type="button" 
                                onClick={() => handleDeleteRole(index, values, setFieldValue)} 
                                className="text-red-500"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </FieldArray>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">Ajouter un nouveau rôle</h2>
                  <button
                    type="button"
                    onClick={() => handleAddRole(values, setFieldValue)}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                  >
                    <FaPlus className="mr-2" /> Ajouter le rôle
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="newRole.organisation" className="block mb-1">Organisation</label>
                    <Select
                      options={organisations}
                      value={values.newRole.organisation}
                      onChange={(selectedOption) => {
                        setFieldValue("newRole.organisation", selectedOption);
                        setFieldValue("newRole.equipe", null);
                        if (["teamBoss", "employee"].includes(values.newRole.role)) {
                          fetchTeams(selectedOption.value);
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="newRole.role" className="block mb-1">Rôle</label>
                    <Select
                    options={roleOptions}
                    value={roleOptions.find(option => option.value === values.newRole.role)}
                    onChange={(selectedOption) => {
                      setFieldValue("newRole.role", selectedOption.value);
                      if (["teamBoss", "employee"].includes(selectedOption.value) && values.newRole.organisation) {
                        fetchTeams(values.newRole.organisation.value);
                      }
                    }}
                    className="w-full"
                  />
                </div>
                {(values.newRole.role === "employee") && (
                  <div>
                    <label htmlFor="newRole.equipe" className="block mb-1">Équipe</label>
                    <Select
                      options={teams}
                      value={values.newRole.equipe}
                      onChange={(selectedOption) => setFieldValue("newRole.equipe", selectedOption)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-800 px-6 py-2 rounded">
                Annuler
              </button>
              <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded">
                Mettre à jour le compte
              </button>
            </div>

            {showDeleteConfirmation && (
              <div className="text-white fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-gray-700 rounded-lg shadow-lg p-6 relative">
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                    onClick={cancelDeleteRole}
                  >
                    <FaTimes color="white" />
                  </button>
                  <div className="mb-4 text-lg font-semibold">Confirmation</div>
                  <div className="mb-4">
                    Êtes-vous sûr de vouloir supprimer ce rôle ?
                    {roleToDelete !== null && values.roles[roleToDelete] && (
                      <div className="mt-2">
                        <p>Organisation : {values.roles[roleToDelete]?.organization?.Name || "Individuel"}</p>
                        <p>Rôle : {values.roles[roleToDelete]?.role || "Non défini"}</p>
                        {values.roles[roleToDelete]?.team && (
                          <p>Équipe : {values.roles[roleToDelete].team?.Name}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                      onClick={cancelDeleteRole}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      className="bg-[#fc4545] text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600"
                      onClick={() => confirmDeleteRole(values, setFieldValue)}
                    >
                      <FaTrash className="mr-1" /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showUpdateConfirmation && (
              <div className="text-white fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-gray-700 rounded-lg shadow-lg p-6 relative">
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                    onClick={() => setShowUpdateConfirmation(false)}
                  >
                    <FaTimes color="white" />
                  </button>
                  <div className="mb-4 text-lg font-semibold">Confirmation</div>
                  <div className="mb-4">
                    Êtes-vous sûr de vouloir mettre à jour ce compte ?
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                      onClick={() => setShowUpdateConfirmation(false)}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      onClick={() => confirmUpdate(values)}
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        )}
      </Formik>
    </div>
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
              handleCancel();
            }
            
            }
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

export default UpdateUserForm;