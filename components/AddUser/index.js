import React, { useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { FaEye, FaEyeSlash, FaEnvelope, FaPhoneAlt, FaVenusMars } from "react-icons/fa";
import { createUserWithEmailAndPassword } from "firebase/auth";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import * as Yup from 'yup';
import axios from "axios";
import { auth } from '../../app/Firebase/firebaseConfig'

const AddCompteForm = ({ handleCancel }) => {
  const [phoneValue, setPhoneValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [popupMessage, setPopupMessage] = useState('');

  const axiosInstance = axios.create({
    baseURL: "https://back-pfe-master.vercel.app",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const initialValues = {
    nom: "",
    prenom: "",
    email: "",
    phoneNumber: "",
    gender: "",
    motDePasse: "",
    confirmMotDePasse: "",
  };

  const validationSchema = Yup.object().shape({
    nom: Yup.string().required("Le nom est requis"),
    prenom: Yup.string().required("Le prénom est requis"),
    email: Yup.string().email("Email invalide").required("L'email est requis"),
    phoneNumber: Yup.string().required("Le numéro de téléphone est requis"),
    gender: Yup.string().required("Le genre est requis"),
    motDePasse: Yup.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").required("Le mot de passe est requis"),
    confirmMotDePasse: Yup.string().oneOf([Yup.ref('motDePasse'), null], 'Les mots de passe doivent correspondre').required("La confirmation du mot de passe est requise")
  });

  const genderOptions = [
    { value: "male", label: "Homme" },
    { value: "female", label: "Femme" }
  ];

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

  const sendUserData = async (values) => {
    try {
      const response = await axiosInstance.post("/user/users", {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        roles: [{ role: "individual", organization: null }],
        phoneNumber: values.phoneNumber,
        gender: values.gender,
        password: values.motDePasse,
      });
      console.log(response.data);
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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await sendUserData(values);
      await signUPFireBase(values);
      handleSuccess("Compte créé avec succès !");
    } catch (error) {
      handleError(error.message || "Une erreur est survenue lors de la création du compte.");
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
                <h2 className="text-xl font-semibold mb-2">Sécurité</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="motDePasse" className="block mb-1">Mot de passe</label>
                    <Field name="motDePasse" type={showPassword ? "text" : "password"} className="w-full p-2 border rounded pr-10" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <ErrorMessage name="motDePasse" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="relative">
                    <label htmlFor="confirmMotDePasse" className="block mb-1">Confirmer le mot de passe</label>
                    <Field name="confirmMotDePasse" type={showConfirmPassword ? "text" : "password"} className="w-full p-2 border rounded pr-10" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <ErrorMessage name="confirmMotDePasse" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-800 px-6 py-2 rounded">
                  Annuler
                </button>
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">
                  Ajouter le compte
                </button>
              </div>
            </form>
          )}
        </Formik>
        
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
    </div>
  );
};

export default AddCompteForm;
