"use client";
import React, { useState, useEffect } from 'react';
import Navigation from "@/components/Navbar/index"
import CompteTable from "@/components/Tables/CompteTable/index"
import AddUserForm from '@/components/AddUser';
import { auth} from '../Firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';


const AddUser = () => {
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
      <AddUserForm />
    </div>
  );
};

export default AddUser;