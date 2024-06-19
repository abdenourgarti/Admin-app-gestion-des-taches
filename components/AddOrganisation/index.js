"use client";
import React, { useState } from "react";
import { Formik } from "formik";
import { FaUserTie, FaBriefcase, FaLock } from "react-icons/fa";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import Countries from "../Countries";

const countries = Countries;

const AddOrganisationForm = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [value, setValue] = useState();

  const getOptionLabel = (option) => option.name;
  const getOptionValue = (option) => JSON.stringify(option);

  const handleChangeCountry = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };

  const handleChangePhoneNumber = (value) => {
    setValue(value);
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-white">
      <div className="w-full max-w-2xl">
        <Formik
          className="w-full"
          initialValues={{
            // Propriétaire de l'entreprise
            prenom: "",
            nom: "",
            // Informations sur l'entreprise
            nomEntreprise: "",
            email: "",
            telephone: "",
            pays: "",
            province: "",
            rue: "",
            // Sécurité
            motDePasse: "",
            confirmMotDePasse: "",
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
          }) => (
            <form
              className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={handleSubmit}
            >
              <div className="flex justify-center mb-6">
                <h1 className="flex text-2xl">
                  <FaBriefcase className="mr-4 text-2xl" />
                  Ajouter une entreprise
                </h1>
              </div>

              {/* Propriétaire de l'entreprise */}
              <div className="mb-4">
                <h2 className="text-lg font-bold mb-2">
                  <FaUserTie className="mr-2 inline" />
                  Propriétaire de l'entreprise
                </h2>
                <div className="flex mb-2">
                  <div className="w-1/2 mr-2">
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
                  <div className="w-1/2">
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
                </div>
              </div>

              {/* Informations sur l'entreprise */}
              <div className="mb-4">
                <h2 className="text-lg font-bold mb-2">
                  <FaBriefcase className="mr-2 inline" />
                  Informations sur l'entreprise
                </h2>
                <div className="mb-2">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="nomEntreprise"
                  >
                    Nom de l'entreprise
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="nomEntreprise"
                    type="text"
                    name="nomEntreprise"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nomEntreprise}
                  />
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
                    onChange={handleChangePhoneNumber}
                  />
                </div>
                <div className="flex mb-2">
                  <div className="w-1/2 mr-2">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="pays"
                    >
                      Pays
                    </label>
                    <div className="flex justify-start items-center px-2 input rounded-xl h-10 ">
                      {!selectedCountry ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 -960 960 960"
                          width="24"
                        >
                          <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q20-22 36-47.5t26.5-53q10.5-27.5 16-56.5t5.5-59q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z" />
                        </svg>
                      ) : (
                        <img
                          className="h-6 w-6"
                          alt="United States"
                          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedCountry.code}.svg`}
                        />
                      )}
                      <Select
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderWidth: state.isFocused ? 0 : 0,
                          }),
                        }}
                        placeholder="Pays"
                        className="w-full"
                        options={countries}
                        onChange={handleChangeCountry}
                        getOptionLabel={getOptionLabel}
                        getOptionValue={getOptionValue}
                      />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="province"
                    >
                      Province
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="province"
                      type="text"
                      name="province"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.province}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="rue"
                  >
                    Rue
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="rue"
                    type="text"
                    name="rue"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.rue}
                  />
                </div>
              </div>

              {/* Sécurité */}
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
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="motDePasse"
                    type="password"
                    name="motDePasse"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.motDePasse}
                  />
                </div>
                <div className="mb-2">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="confirmMotDePasse"
                  >
                    Confirmer le mot de passe
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="confirmMotDePasse"
                    type="password"
                    name="confirmMotDePasse"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirmMotDePasse}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Ajouter une entreprise
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddOrganisationForm;