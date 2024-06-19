"use client";
import React, { useState, useEffect } from 'react';
import Navigation from "@/components/Navbar/index"
import AddOrganisationForm from '@/components/AddOrganisation';
import { auth} from '../Firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';


const AddOrganisation = () => {
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
    <div className='flex flex-col min-h-screen'>
      <Navigation activeTab="" />
      <AddOrganisationForm />
    </div>
  );
};

export default AddOrganisation;