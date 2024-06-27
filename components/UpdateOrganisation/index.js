"use client";
import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { FaUserTie, FaBriefcase, FaLock, FaEdit, FaTimes, FaEyeSlash, FaEye, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import Countries from "../Countries";
import * as Yup from 'yup';
import axios from "axios";

const countries = Countries;

const UpdateOrganisationForm = ({ organisation, handleCancel }) => {
  const parseJSON = (jsonString) => {
    try {
      return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    } catch (e) {
      return jsonString;
    }
  };
  const axiosInstance = axios.create({
    baseURL: "https://back-pfe-master.vercel.app",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const [phoneValue, setPhoneValue] = useState(organisation.Boss.phoneNumber || "");
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const countryName = parseJSON(organisation?.country)?.name || organisation?.country;
    return countries.find(country => country.name === countryName) || null;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  useEffect(() => {
    const countryName = parseJSON(organisation?.country)?.name || organisation?.country;
    const country = countries.find(c => c.name === countryName);
    if (country) {
      setSelectedCountry(country);
    }
  }, [organisation]);

  console.log("organisation.country:", organisation?.country);
  console.log("selectedCountry:", selectedCountry);

  const validationSchema = Yup.object().shape({
    prenom: Yup.string().required("Le prénom est requis"),
    nom: Yup.string().required("Le nom est requis"),
    nomEntreprise: Yup.string().required("Le nom de l'entreprise est requis"),
    email: Yup.string().email("Email invalide").required("L'email est requis"),
    telephone: Yup.string().required("Le numéro de téléphone est requis"),
    pays: Yup.string().required("Le pays est requis"),
    province: Yup.string().required("La province est requise"),
    rue: Yup.string().required("La rue est requise"),
    nouveauMotDePasse: Yup.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmNouveauMotDePasse: Yup.string().oneOf([Yup.ref('nouveauMotDePasse'), null], 'Les mots de passe doivent correspondre')
  });

  const handleSubmit = (values) => {
    setShowUpdateConfirmation(true);
  };

  const confirmUpdate = async (values) => {
    console.log(values);
    setShowUpdateConfirmation(false);
    try {  
      const userData = {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        phoneNumber: values.phoneNumber,
      };
  
      if (values.newPassword) {
        userData.password = values.newPassword;
      }
  
      const response = await axiosInstance.patch(`/user/updateUser?id=${organisation.Boss._id}`, userData);
      console.log("pays = ", values.pays);

      const orgData = {
        Name : values.nomEntreprise,
        country : values.pays,
        province : values.province,
        street : values.rue
      }
      const response1 = await axiosInstance.patch(`/organization/organizations/${organisation._id}`, orgData);
  
      if (response.status === 200 && response1.status === 200) {
        setPopupMessage("Organisation mise à jour avec succès !");
        setPopupType("success");
        setShowPopup(true);
      } else {
        if (response.status !== 200){
          setPopupMessage("Erreur lors de la mise à jour de l'utilisateur.");
          setPopupType("error");
          setShowPopup(true);
        }
        if (response1.status !== 200){
          setPopupMessage("Erreur lors de la mise à jour de l'organisation.");
          setPopupType("error");
          setShowPopup(true);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      setPopupMessage("Erreur de connexion au serveur.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('/BG.jpeg')]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <Formik
          initialValues={{
            prenom: organisation?.Boss.prenom || "",
            nom: organisation?.Boss.nom || "",
            nomEntreprise: organisation?.Name || "",
            email: organisation?.Boss.email || "",
            telephone: organisation?.Boss.phoneNumber || "",
            pays: selectedCountry?.name || "",
            province: organisation?.province || "",
            rue: organisation?.street || "",
            nouveauMotDePasse: "",
            confirmNouveauMotDePasse: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center mb-6">
                <h1 className="flex text-2xl">
                  <FaEdit className="mr-4 text-2xl" />
                  {`Modifier l'organisation`}
                </h1>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">
                  <FaUserTie className="mr-2 inline" />
                  {`Propriétaire de l'entreprise`}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prenom" className="block mb-1">Prénom</label>
                    <Field name="prenom" type="text" className="w-full p-2 border rounded" />
                    <ErrorMessage name="prenom" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="nom" className="block mb-1">Nom</label>
                    <Field name="nom" type="text" className="w-full p-2 border rounded" />
                    <ErrorMessage name="nom" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">
                  <FaBriefcase className="mr-2 inline" />
                  {`Informations sur l'entreprise`}
                </h2>
                <div className="mb-2">
                  <label htmlFor="nomEntreprise" className="block mb-1">{`Nom de l'entreprise`}</label>
                  <Field name="nomEntreprise" type="text" className="w-full p-2 border rounded" />
                  <ErrorMessage name="nomEntreprise" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-2">
                  <label htmlFor="email" className="block mb-1 flex items-center">
                    <FaEnvelope className="mr-2" /> Email
                  </label>
                  <Field name="email" type="email" className="w-full p-2 border rounded" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-2">
                  <label htmlFor="telephone" className="block mb-1 flex items-center">
                    <FaPhoneAlt className="mr-2" /> Numéro de téléphone
                  </label>
                  <PhoneInput
                    value={phoneValue}
                    onChange={(value) => {
                      setPhoneValue(value);
                      setFieldValue("telephone", value);
                    }}
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage name="telephone" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <label htmlFor="pays" className="block mb-1">Pays</label>
                    <Select
                      options={countries}
                      value={selectedCountry}
                      onChange={(selectedOption) => {
                        setSelectedCountry(selectedOption);
                        setFieldValue("pays", selectedOption.name);
                      }}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.code}
                      className="w-full"
                    />
                    <ErrorMessage name="pays" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="province" className="block mb-1">Province</label>
                    <Field name="province" type="text" className="w-full p-2 border rounded" />
                    <ErrorMessage name="province" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
                <div className="mb-2">
                  <label htmlFor="rue" className="block mb-1 flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> Rue
                  </label>
                  <Field name="rue" type="text" className="w-full p-2 border rounded" />
                  <ErrorMessage name="rue" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">
                  <FaLock className="mr-2 inline" />
                  Sécurité
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nouveauMotDePasse" className="block mb-1">Nouveau mot de passe (optionnel)</label>
                    <div className="relative">
                      <Field
                        name="nouveauMotDePasse"
                        type={showPassword ? "text" : "password"}
                        className="w-full p-2 border rounded pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <ErrorMessage name="nouveauMotDePasse" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="confirmNouveauMotDePasse" className="block mb-1">Confirmer le nouveau mot de passe</label>
                    <div className="relative">
                      <Field
                        name="confirmNouveauMotDePasse"
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full p-2 border rounded pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <ErrorMessage name="confirmNouveauMotDePasse" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-800 px-6 py-2 rounded">
                  Annuler
                </button>
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">
                  {`Mettre à jour l'organisation`}
                </button>
              </div>

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
                if (popupType === 'success') {
                  handleCancel();
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

export default UpdateOrganisationForm;