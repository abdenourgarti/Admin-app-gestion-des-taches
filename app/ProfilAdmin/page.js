"use client";
import Navigation from "@/components/Navbar";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import { FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";
import { auth} from '../Firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import axios from "axios";



const AdminAccountPage = () => {
  const [userSession, setUserSession] = useState(null);
  const [adminInfo, setAdminInfo] = useState();
  const router = useRouter();
  const getAdmin = async (email) => {
    if (email) {
      try {
        const response = await axiosInstance.get("/user/me", {
          params: { email: email },
        });
        setAdminInfo(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations admin:", error);
      }
    }
  }
  
  const axiosInstance = axios.create({
    baseURL: "https://back-pfe-master.vercel.app",
    headers: {
      "Content-Type": "application/json",
    },
  });
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Rediriger vers la page d'accueil si l'utilisateur n'est pas connecté
        router.push('/');
      } else {
        setUserSession(user);
        // Appeler getAdmin avec l'email de l'utilisateur
        getAdmin(user.email);
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
        <div className="w-full max-w-2xl">
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
                <span className="font-bold">Nom :</span> {adminInfo?.nom} {adminInfo?.prenom}
              </p>
              <p className="mb-2">
                <span className="font-bold">Email :</span> {adminInfo?.email || userSession?.email}
              </p>
              <p className="mb-2">
                <span className="font-bold">Rôle :</span> {adminInfo?.roles[0].role}
              </p>
            </div>

            <div className="flex justify-center">
              
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