"use client"
import React, { Fragment } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { signOut } from 'firebase/auth';
import { auth } from './Firebase/firebaseConfig';
import { useRouter } from "next/navigation";


export default function NotFound() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Rediriger vers la page de connexion après avoir fermé la session
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <Fragment>
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <FaExclamationTriangle className="text-yellow-500 w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-black mb-4">Erreur 404</h2>
          <p className="text-lg mb-4">
            La page que vous recherchez est introuvable.
          </p>
          <p className="mb-4">
            Veuillez vérifier l&aposURL ou retourner à la{" "}
            <button
              onClick={handleSignOut}
              className="underline hover:no-underline text-blue-600">
              page d'accueil
            </button>
            .
          </p>
        </div>
      </div>
    </Fragment>
  );
}

