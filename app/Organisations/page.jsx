"use client"
import React, { useState, useEffect } from 'react';
import Navigation from "@/components/Navbar/index"
import OrganisationsTable from '@/components/Tables/OrganisationTable';
import { auth} from '../Firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import axios from "axios";

const Organisations = () => {
  const [organisationsData, setOrganisationsData] = useState([]);
  const [userSession, setUserSession] = useState(null);
  const [reload, setReload] = useState(false)
  const router = useRouter();
  const axiosInstance = axios.create({
    baseURL: "https://back-pfe-master.vercel.app",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const recharge = () => {
    setReload(!reload)
  }

  const getAllOrganizations = async () => {
    try{
      const response = await axiosInstance.get("/organization/AllOrganizations")
      console.log("organisations = ", response.data)
      setOrganisationsData(response.data)
    } catch(error) {
      console.error("Erreur lors de la récuperation des organisations :", error);
    }
  }

  useEffect(() => {
    getAllOrganizations();
  }, []);

  useEffect(() => {
    getAllOrganizations();    
  }, [reload]);


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
    <div className="min-h-screen bg-cover bg-center">
      <Navigation activeTab="tab2"/>
      <div className="mx-auto h-screen bg-white rounded-b-lg p-4">
        <OrganisationsTable organisations={organisationsData} recharge={recharge}/>
      </div>
    </div>
  );
};

export default Organisations;