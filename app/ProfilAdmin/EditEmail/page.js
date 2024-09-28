// "use client";
// import React, { useState, useEffect } from 'react';
// import { Formik } from "formik";
// import { FaEnvelope, FaLock } from "react-icons/fa";
// import Navigation from "@/components/Navbar";
// import { auth } from '../../Firebase/firebaseConfig';
// import { useRouter } from 'next/navigation';
// import Loader from '@/components/Loader';
// import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
// import axios from "axios";

// const AdminEditEmailForm = () => {
//   const [userSession, setUserSession] = useState(null);
//   const [generalError, setGeneralError] = useState("");
//   const router = useRouter();
//   const axiosInstance = axios.create({
//     baseURL: "https://back-pfe-master.vercel.app",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (!user) {
//         router.push('/');
//       } else {
//         setUserSession(user);
//       }
//     });

//     return unsubscribe;
//   }, [router]);

//   const handleCancel = () => {
//     router.push('/ProfilAdmin');
//   };

//   if (userSession === null) {
//     return <Loader />;
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-white">
//       <Navigation activeTab="" />
//       <div className="flex-grow flex items-center justify-center">
//         <div className="w-full max-w-md">
//           <Formik
//             initialValues={{
//               currentPassword: "",
//               email: "",
//             }}
//             validate={(values) => {
//               const errors = {};
//               if (!values.currentPassword) {
//                 errors.currentPassword = "Le mot de passe actuel est requis";
//               }
//               if (!values.email) {
//                 errors.email = "L'email est requis";
//               } else if (
//                 !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
//               ) {
//                 errors.email = "Adresse email invalide";
//               }
//               return errors;
//             }}
//             onSubmit={async (values, { setSubmitting, setFieldError }) => {
//               try {
//                 // Réauthentifier l'utilisateur
//                 const credential = EmailAuthProvider.credential(
//                   auth.currentUser.email,
//                   values.currentPassword
//                 );
//                 await reauthenticateWithCredential(auth.currentUser, credential);
            
//                 // Mettre à jour l'email dans Firebase
//                 await updateEmail(auth.currentUser, values.email);
            
//                 // Mettre à jour l'email dans votre base de données
//                 await axiosInstance.patch('/user/update-compte', {
//                   currentEmail: auth.currentUser.email,
//                   newEmail: values.email
//                 });
            
//                 // Informer l'utilisateur
//                 alert("Votre email a été mis à jour avec succès.");
            
//                 // Rediriger l'utilisateur vers son profil
//                 router.push('/ProfilAdmin');
            
//               } catch (error) {
//                 console.error("Erreur lors de la mise à jour de l'email:", error);
//                 if (error.code === "auth/wrong-password") {
//                   setFieldError("currentPassword", "Mot de passe incorrect");
//                 } else if (error.code === "auth/email-already-in-use") {
//                   setFieldError("email", "Cet email est déjà utilisé");
//                 } else if (error.code === "auth/requires-recent-login") {
//                   setGeneralError("Pour des raisons de sécurité, veuillez vous reconnecter avant de changer votre email.");
//                 } else {
//                   setGeneralError("Une erreur s'est produite lors de la mise à jour de l'email");
//                 }
//               } finally {
//                 setSubmitting(false);
//               }
//             }}
//           >
//             {({
//               values,
//               errors,
//               touched,
//               handleChange,
//               handleBlur,
//               handleSubmit,
//               isSubmitting,
//             }) => (
//               <form
//                 className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4"
//                 onSubmit={handleSubmit}
//               >
//                 <div className="flex justify-center mb-6">
//                   <h1 className="text-2xl font-bold">{`Modifier l'email`}l</h1>
//                 </div>

//                 <div className="mb-4">
//                   <label
//                     className="block text-gray-700 font-bold mb-2"
//                     htmlFor="currentPassword"
//                   >
//                     <FaLock className="mr-2 inline" />
//                     Mot de passe actuel
//                   </label>
//                   <input
//                     className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                       errors.currentPassword && touched.currentPassword
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                     id="currentPassword"
//                     type="password"
//                     name="currentPassword"
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     value={values.currentPassword}
//                   />
//                   {errors.currentPassword && touched.currentPassword && (
//                     <p className="text-red-500 text-xs italic">
//                       {errors.currentPassword}
//                     </p>
//                   )}
//                 </div>

//                 <div className="mb-4">
//                   <label
//                     className="block text-gray-700 font-bold mb-2"
//                     htmlFor="email"
//                   >
//                     <FaEnvelope className="mr-2 inline" />
//                     Nouvel email
//                   </label>
//                   <input
//                     className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                       errors.email && touched.email
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                     id="email"
//                     type="email"
//                     name="email"
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     value={values.email}
//                   />
//                   {errors.email && touched.email && (
//                     <p className="text-red-500 text-xs italic">{errors.email}</p>
//                   )}
//                 </div>

//                 {generalError && (
//                   <div className="mb-4 text-red-500 text-center">{generalError}</div>
//                 )}

//                 <div className="flex items-center justify-between">
//                   <button
//                     type="button"
//                     onClick={handleCancel}
//                     className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                     type="submit"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Mise à jour..." : "Changer l'email"}
//                   </button>
//                 </div>
//               </form>
//             )}
//           </Formik>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminEditEmailForm;