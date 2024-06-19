"use client";
import React, { useState } from "react";
import { Formik, useFormikContext } from "formik";
import {
  FaPlus,
  FaUser,
  FaEdit,
  FaLock,
  FaUserCircle,
  FaPhone,
  FaVenusMars,
  FaEyeSlash,
  FaEye,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import Countries from "../Countries";
import Link from "next/link";

const countries = Countries;

const UpdateUserForm = ({ compte, handleSubmitSuccess }) => {
  const [selectedCountry, setSelectedCountry] = useState(compte.pays);
  const [value, setValue] = useState(compte.telephone);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const getOptionLabel = (option) => option.name;
  const getOptionValue = (option) => JSON.stringify(option);

  const handleChangeCountry = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };

  const handleChangePhoneNumber = (value, setFieldValue) => {
    setValue(value);
    setFieldValue('telephone', value); // Mettre à jour la valeur de telephone dans Formik
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleConfirmUpdate = () => {
    setShowConfirmationModal(true);
  };

  const cancelUpdate = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-white">
      <div className="w-full max-w-2xl">
        <Formik
          className="w-full"
          initialValues={{
            nom: compte.nom || "",
            prenom: compte.prenom || "",
            email: compte.email || "",
            role: compte.role || "",
            motDePasse: compte.password || "",
            confirmMotDePasse: compte.password || "",
            telephone: compte.telephone || "",
            sexe: compte.sexe || "",
          }}
          validate={(values) => {
            const errors = {};
            // Ajoutez vos règles de validation ici
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(async () => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
              cancelUpdate();
              window.location.replace('/Comptes');
            }, 400);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <form
              className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={handleSubmit}
            >
              <div className="flex justify-center mb-6">
                <h1 className="flex text-2xl">
                  <FaEdit className="mr-4 text-2xl" />
                  Modifier le compte
                </h1>
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-bold mb-2">
                  <FaUser className="mr-2 inline" />
                  Informations personnelles
                </h2>
                <div className="flex mb-2">
                  <div className="w-1/2 mr-2">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="nom"
                    >
                      Nom
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="nom"
                      type="text"
                      name="nom"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.nom}
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="prenom"
                    >
                      Prénom
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="prenom"
                      type="text"
                      name="prenom"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.prenom}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </div>
                <div className="mb-2">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="telephone"
                  >
                    Numéro de téléphone
                  </label>
                  <PhoneInput
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Entrez le numéro de téléphone"
                    value={value}
                    onChange={(value) => handleChangePhoneNumber(value, setFieldValue)} // Passer setFieldValue à handleChangePhoneNumber
                  />
                </div>
                <div className="mb-2">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="sexe"
                  >
                    Sexe
                  </label>
                  <div className="flex">
                    <div className="mr-4 flex items-center">
                      <input
                        type="radio"
                        name="sexe"
                        value="homme"
                        checked={values.sexe === "homme"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="form-radio"
                      />
                      <div className="ml-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 -960 960 960"
                          width="24"
                        >
                          <path d="M220-80v-300h-60v-220q0-33 23.5-56.5T240-680h120q33 0 56.5 23.5T440-600v220h-60v300H220Zm80-640q-33 0-56.5-23.5T220-800q0-33 23.5-56.5T300-880q33 0 56.5 23.5T380-800q0 33-23.5 56.5T300-720Z" />
                        </svg>
                        <span className="ml-2">Homme</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="sexe"
                        value="femme"
                        checked={values.sexe === "femme"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="form-radio"
                      />
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
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className="mb-4">
                  <h2 className="text-lg font-bold mb-2">
                    <FaUserCircle className="mr-2 inline" />
                    Rôle
                  </h2>
                  <div className="mb-2">
                    <select
                      value={values.role}
                      name="role"
                      id="role"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" disabled>
                        Sélectionnez un rôle
                      </option>
                      <option value="admin">Administrateur</option>
                      <option value="manager">Gestionnaire</option>
                      <option value="user">Utilisateur</option>
                    </select>
                  </div>
                </div>
  
                <div className="mb-4">
                  <h2 className="text-lg font-bold mb-2">
                    <FaLock className="mr-2 inline" />
                    Sécurité
                  </h2>
                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="motDePasse"
                    >
                      Mot de passe
                    </label>
                    <div className="flex row w-full">
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="motDePasse"
                        type={showPassword ? "text" : "password"}
                        name="motDePasse"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.motDePasse}
                      />
                      <button
                        type="button"
                        className="flex items-center text-gray-500 ml-1"
                        onClick={toggleShowPassword}
                      >
                        {!showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="confirmMotDePasse"
                    >
                      Confirmer le mot de passe
                    </label>
                    <div className="flex row w-full">
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="confirmMotDePasse"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmMotDePasse"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirmMotDePasse}
                      />
                      <button
                        type="button"
                        className="flex items-center text-gray-500 ml-1"
                        onClick={toggleShowConfirmPassword}
                      >
                        {!showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>
                
  
                <div className="flex row w-full">
                  <Link
                    className="bg-gray-400 ml-4 hover:bg-gray-500 text-black font-medium mr-2 py-2 px-4 rounded-md mt-12 w-1/2 flex items-center justify-center"
                    type="button"
                    href={"/Comptes"}
                  >
                    Annuler
                  </Link>
                  <button
                    className="bg-blue-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md mt-12 w-1/2 flex items-center justify-center"
                    type="button"
                    onClick={handleConfirmUpdate}
                  >
                    Mettre à jour le compte
                  </button>
                </div>
                {showConfirmationModal && (
                  <div className="text-white fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-gray-700 rounded-lg shadow-lg p-6 relative">
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                        onClick={cancelUpdate}
                      >
                        <FaTimes color="white" />
                      </button>
                      <div className="mb-4 text-lg font-semibold">Confirmation</div>
                      <div className="mb-4">
                        Êtes-vous sûr de vouloir mettre à jour le compte {compte.nom}{" "}
                        {compte.prenom} ?
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                          onClick={cancelUpdate}
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-[#fc4545] text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600"
                        >
                          <FaEdit className="mr-1" /> Mettre à jour
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            )}
          </Formik>
        </div>
        
      </div>
    );
  };
  
  export default UpdateUserForm;