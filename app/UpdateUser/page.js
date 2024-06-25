"use client"
import React, { useState, useEffect } from 'react';
import UpdateUserForm from '@/components/UpdateUser';
import Navigation from '@/components/Navbar';
import { useSearchParams } from 'next/navigation';
import { auth} from '../Firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';


const UpdateUser = () => {
  const searchParams = useSearchParams();
  const compteDetails = searchParams.get("compteDetails");
  const compte = compteDetails ? JSON.parse(decodeURIComponent(compteDetails)) : null;

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

  const handleCancel = () => {
    router.push('/Comptes');
  }
  

  return  userSession === null ? 
  (
    <Loader /> 
  ) : (
    <div className='flex flex-col min-h-screen'>
      <Navigation activeTab="" />
      <div className="">
        {compteDetails ? (
          <UpdateUserForm compte={compte} handleCancel={handleCancel}/>
        ) : (
          <p>Aucun compte à modifier</p>
        )}
      </div>
    </div>
  );
};

export default UpdateUser;