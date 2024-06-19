"use client";

import React, { useEffect, useState } from 'react';
import Navigation from "@/components/Navbar/index"
import CompteTable from "@/components/Tables/CompteTable/index"
import { auth} from '../Firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
 

// Données factices pour les différentes tables
const comptes = [
  { id: 1, nom: 'Dupont', prenom: 'Jean', role: 'admin', email:'exemple@gmail.com', telephone: '+213000000000', organisation: 'Organisation 1', sexe: 'homme', password: '123456' },
  { id: 2, nom: 'Martin', prenom: 'Sophie', role: 'user', email:'exemple@gmail.com', telephone: '+213000000000', organisation: 'Organisation 2', sexe: 'femme', password: '123456' },
  { id: 3, nom: 'Lefebvre', prenom: 'Luc', role: 'manager', email:'exemple@gmail.com', telephone: '+213000000000', organisation: 'Organisation 1', sexe: 'homme', password: '123456' },
];

const Comptes = () => {
  const [comptesData, setComptesData] = useState(comptes);
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

  const handleDeleteCompte = (compte) => {
    const updatedComptes = comptesData.filter((c) => c.id !== compte.id);
    setComptesData(updatedComptes);
  };

  return userSession === null ? 
  (
    <Loader /> 
  ) : (
    <div className="min-h-screen bg-cover bg-center">
      <Navigation activeTab="tab1" />
      <div className="mx-auto h-screen bg-white rounded-b-lg p-4">
        <CompteTable comptes={comptesData} onDeleteCompte={handleDeleteCompte} />
      </div>
    </div>
  );
};

export default Comptes;