"use client"
import React, { useState, useEffect } from 'react';
import Navigation from "@/components/Navbar/index"
import OrganisationsTable from '@/components/Tables/OrganisationTable';
import { auth} from '../Firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';


const organisations = [
  { id: 1, nom: 'Organisation 1', proprietaireNom: 'John', proprietairePrenom: 'Doe', pays: 'DZ', province: 'Alger', rue: 'Bab Ezzouar', email: 'exemple@gmail.com', telephone: '+21300000000', password:'123456' },
  { id: 2, nom: 'Organisation 2', proprietaireNom: 'John', proprietairePrenom: 'Doe', pays: 'DZ', province: 'Alger', rue: 'Bab Ezzouar', email: 'exemple@gmail.com', telephone: '+21300000000', password:'123456' },
];


const Organisations = () => {
  const [organisationsData, setOrganisationsData] = useState(organisations);
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

  const handleDeleteOrganisation = (organisation) => {
    const updatedOrganisations = organisationsData.filter((c) => c.id !== organisation.id);
    setOrganisationsData(updatedOrganisations);
  };

  return  userSession === null ? 
  (
    <Loader /> 
  ) : (
    <div className="min-h-screen bg-cover bg-center">
      <Navigation activeTab="tab2"/>
      <div className="mx-auto h-screen bg-white rounded-b-lg p-4">
        <OrganisationsTable organisations={organisationsData} onDeleteOrganisation={handleDeleteOrganisation}/>
      </div>
    </div>
  );
};

export default Organisations;