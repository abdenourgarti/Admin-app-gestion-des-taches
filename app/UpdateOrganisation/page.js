"use client"
import React, { useState, useEffect } from 'react';
import UpdateUserForm from '@/components/UpdateUser';
import Navigation from '@/components/Navbar';
import { useSearchParams } from 'next/navigation';
import UpdateOrganisationForm from '@/components/UpdateOrganisation';
import { auth} from '../Firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';


const UpdateOrganisation = () => {
  const searchParams = useSearchParams();
  const organisationDetails = searchParams.get("organisationDetails");
  const organisation = organisationDetails ? JSON.parse(decodeURIComponent(organisationDetails)) : null;

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
    router.push('/Organisations');
  }
  

  return  userSession === null ? 
  (
    <Loader /> 
  ) : (
    <div className='flex flex-col min-h-screen'>
      <Navigation activeTab="" />
      <div className="">
        {organisationDetails ? (
          <UpdateOrganisationForm organisation={organisation} handleCancel={handleCancel}/>
        ) : (
          <p>Aucune Organisation à modifier</p>
        )}
      </div>
    </div>
  );
};

export default UpdateOrganisation;