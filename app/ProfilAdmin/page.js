"use client";
import Navigation from "@/components/Navbar";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import { FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";
import { auth} from '../Firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';




const AdminAccountPage = () => {
  const [userSession, setUserSession] = useState(null);
  const router = useRouter();
  // Supposons que les informations de l'administrateur sont récupérées depuis une API ou un état global
  const adminInfo = {
    nom: "John Doe",
    email: "john.doe@example.com",
    role: "Administrateur",
  };
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
          <div className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="flex justify-center mb-6">
              <h1 className="text-2xl font-bold">Compte Administrateur</h1>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-bold mb-2">
                <FaUserCircle className="mr-2 inline" />
                Informations personnelles
              </h2>
              <p className="mb-2">
                <span className="font-bold">Nom :</span> {adminInfo.nom}
              </p>
              <p className="mb-2">
                <span className="font-bold">Email :</span> {adminInfo.email}
              </p>
              <p className="mb-2">
                <span className="font-bold">Rôle :</span> {adminInfo.role}
              </p>
            </div>

            <div className="flex justify-center">
              <Link
                href="/ProfilAdmin/EditEmail"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 focus:outline-none focus:shadow-outline"
              >
                <FaEnvelope className="mr-2 inline" />
                Modifier l'email
              </Link>
              <Link
                href="/ProfilAdmin/EditPassword"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                <FaLock className="mr-2 inline" />
                Modifier le mot de passe
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccountPage;