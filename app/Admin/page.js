"use client";
import React from "react";
import { Formik } from "formik";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Firebase/firebaseConfig'
import { useRouter } from "next/navigation";

const AdminLoginForm = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-screen bg-[url('/BG.jpeg')]">
      <div className="w-full max-w-md">
        <Formik
          initialValues={{
            email: "",
            motDePasse: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "L'email est requis";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Adresse email invalide";
            }
            if (!values.motDePasse) {
              errors.motDePasse = "Le mot de passe est requis";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              signInWithEmailAndPassword(auth, values.email, values.motDePasse)
                .then(user => {
                  router.push('/Comptes');
                  setSubmitting(false);
                })
                .catch(error => {
                  console.log(error);
                  setSubmitting(false);
                })
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
                <h1 className="text-2xl font-bold">Connexion Administrateur</h1>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="email"
                >
                  <FaEnvelope className="mr-2 inline" />
                  Email
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

              <div className="mb-6">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="motDePasse"
                >
                  <FaLock className="mr-2 inline" />
                  Mot de passe
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.motDePasse && touched.motDePasse
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  id="motDePasse"
                  type="password"
                  name="motDePasse"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.motDePasse}
                />
                {errors.motDePasse && touched.motDePasse && (
                  <p className="text-red-500 text-xs italic">
                    {errors.motDePasse}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Se connecter
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AdminLoginForm;