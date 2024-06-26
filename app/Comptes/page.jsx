"use client";

import React, { useEffect, useState } from 'react';
import Navigation from "@/components/Navbar/index"
import CompteTable from "@/components/Tables/CompteTable/index"
import { auth} from '../Firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import axios from "axios";
 

const Comptes = () => {
  const [comptesData, setComptesData] = useState([]);
  const [userSession, setUserSession] = useState(null);
  const [reload, setReload] = useState(false)
  const router = useRouter();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:1937",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const recharge = () => {
    setReload(!reload)
  }

  const getAllUsers = async () => {
    try{
      const response = await axiosInstance.get("/user/Allusers")
      console.log("users = ", response.data)
      setComptesData(response.data)
    } catch(error) {
      console.error("Erreur lors de la récuperation des utilisateurs :", error);
    }
  }

  useEffect(() => {
    getAllUsers();
  }, []);

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

  useEffect(() => {
    getAllUsers();    
  }, [reload]);

  return userSession === null ? 
  (
    <Loader /> 
  ) : (
    <div className="min-h-screen bg-cover bg-center">
      <Navigation activeTab="tab1" />
      <div className="mx-auto h-screen bg-white rounded-b-lg p-4">
        <CompteTable comptes={comptesData} recharge={recharge}/>
      </div>
    </div>
  );
};

export default Comptes;