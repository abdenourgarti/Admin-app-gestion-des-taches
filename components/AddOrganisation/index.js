import React, { useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { FaUserTie, FaBriefcase, FaLock, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import Countries from "../Countries";
import * as Yup from 'yup';
import Organisations from "@/app/Organisations/page";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth } from '../../app/Firebase/firebaseConfig'
import axios from "axios";

const countries = Countries;

const AddOrganisationForm = ({ handleCancel }) => {
  const [phoneValue, setPhoneValue] = useState();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const axiosInstance = axios.create({
    baseURL: "https://back-pfe-master.vercel.app",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const initialValues = {
    prenom: "",
    nom: "",
    nomEntreprise: "",
    email: "",
    telephone: "",
    pays: "",
    province: "",
    rue: "",
    motDePasse: "",
    confirmMotDePasse: "",
  };

  const validationSchema = Yup.object().shape({
    prenom: Yup.string().required("Le prénom est requis"),
    nom: Yup.string().required("Le nom est requis"),
    nomEntreprise: Yup.string().required("Le nom de l'entreprise est requis"),
    email: Yup.string().email("Email invalide").required("L'email est requis"),
    telephone: Yup.string().required("Le numéro de téléphone est requis"),
    pays: Yup.string().required("Le pays est requis"),
    province: Yup.string().required("La province est requise"),
    rue: Yup.string().required("La rue est requise"),
    motDePasse: Yup.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").required("Le mot de passe est requis"),
    confirmMotDePasse: Yup.string().oneOf([Yup.ref('motDePasse'), null], 'Les mots de passe doivent correspondre').required("La confirmation du mot de passe est requise")
  });

  const deleteUser = async (email) => {
    try {
      const response = await axiosInstance.delete(`/user/users?email=${email}`);
      if (response.status === 200) {
        console.log("User deleted successfully");
      } else {
        console.error("Error deleting user:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const sendOrgData = async (values, userInfo) => {
    // Créer l'organisation
    const orgResponse = await axiosInstance.post(
      "/organization/organizations",
      {
        email: values.email,
        Name: values.nomEntreprise,
        Boss: userInfo._id,
        country: values.pays,
        province: values.province,
        street: values.rue,
      }
    );
    return orgResponse.data;
  }

  const sendUserData = async (values) => {
    try {
      const response = await axiosInstance.post("/user/users", {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        roles: [],
        phoneNumber: values.telephone,
        password: values.motDePasse,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message || "Email ou numéro de téléphone déjà utilisé ");
    }
  };

  const signUPFireBase = async (values) => {
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.motDePasse);
      console.log("Succès");
    } catch (error) {
      await deleteUser(values.email);
      throw new Error(error.message || "Erreur lors de la création du compte Firebase");
    }
  };

  const handleError = (errorMessage) => {
    setPopupType('error');
    setPopupMessage(errorMessage);
    setShowPopup(true);
  };

  const handleSuccess = (message) => {
    setPopupType('success');
    setPopupMessage(message);
    setShowPopup(true);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Vérifier si l'organisation existe
      const orgExistsResponse = await axiosInstance.get(
        "/organization/organizations",
        {
          params: { Name: values.nomEntreprise },
        }
      );

      if (orgExistsResponse.data.length > 0) {
        setPopupMessage("Organization with this name exists");
        setPopupType("error");
        setShowPopup(true);
      
      return;
    }

      // Vérifier si l'utilisateur existe
      const userExistsResponse = await axiosInstance.post(
        "/user/check-user-exists",
        {
          email: values.email,
          phoneNumber: values.telephone,
        }
      );

      if (userExistsResponse.data.exists) {
        setPopupMessage("User with this email or phone number exists");
          setPopupType("error");
          setShowPopup(true);
        
        return;
      }
      const userInfo = await sendUserData(values);
      await signUPFireBase(values);
      const organizationInfo = await sendOrgData(values, userInfo)
      const updatedUserResponse = await axiosInstance.patch(
        `/user/users?id=${userInfo._id}`,
        {
          roles: [{ role: "orgBoss", organization: organizationInfo._id }],
        }
      );
      handleSuccess("Organisation créé avec succès !");
    } catch (error) {
      handleError(error.message || "Une erreur est survenue lors de la création de l'organisation.");
    } finally {
      setSubmitting(false);
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('/BG.jpeg')]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center mb-6">
                <h1 className="flex text-2xl">
                  <FaBriefcase className="mr-4 text-2xl" />
                  Ajouter une entreprise
                </h1>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">
                  <FaUserTie className="mr-2 inline" />
                  Propriétaire de l&aposentreprise
                </h2>
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
                <h2 className="text-xl font-semibold mb-2">
                  <FaBriefcase className="mr-2 inline" />
                  Informations sur l&aposentreprise
                </h2>
                <div className="mb-2">
                  <label htmlFor="nomEntreprise" className="block mb-1">Nom de l&aposentreprise</label>
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
                    <label htmlFor="motDePasse" className="block mb-1">Mot de passe</label>
                    <div className="relative">
                      <Field
                        name="motDePasse"
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
                    <ErrorMessage name="motDePasse" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="confirmMotDePasse" className="block mb-1">Confirmer le mot de passe</label>
                    <div className="relative">
                      <Field
                        name="confirmMotDePasse"
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
                    <ErrorMessage name="confirmMotDePasse" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-800 px-6 py-2 rounded">
                  Annuler
                </button>
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">
                  Ajouter l&aposentreprise
                </button>
              </div>
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

export default AddOrganisationForm;