"use client";
import React, { useState, useEffect } from 'react';
import { Formik } from "formik";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Navigation from "@/components/Navbar";
import { auth} from '../../Firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

const AdminEditEmailForm = () => {
  const [userSession, setUserSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Rediriger vers la page d'accueil si l'utilisateur n'est pas connecté
        router.push('/');
      }else{
        setUserSession(user);
      }
    });

    return unsubscribe;
  }, [router]);
  

  return  userSession === null ? 
  (
    <Loader /> 
  ) : (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation activeTab="" />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <Formik
            initialValues={{
              currentPassword: "",
              email: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.currentPassword) {
                errors.currentPassword = "Le mot de passe actuel est requis";
              }
              if (!values.email) {
                errors.email = "L'email est requis";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Adresse email invalide";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
                window.location.replace('/ProfilAdmin');
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
                  <h1 className="text-2xl font-bold">Modifier l'email</h1>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="currentPassword"
                  >
                    <FaLock className="mr-2 inline" />
                    Mot de passe actuel
                  </label>
                  <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.currentPassword && touched.currentPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    id="currentPassword"
                    type="password"
                    name="currentPassword"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.currentPassword}
                  />
                  {errors.currentPassword && touched.currentPassword && (
                    <p className="text-red-500 text-xs italic">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="email"
                  >
                    <FaEnvelope className="mr-2 inline" />
                    Nouvel email
                  </label>
                  <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    id="email"
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-xs italic">{errors.email}</p>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Enregistrer le nouvel email
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AdminEditEmailForm;