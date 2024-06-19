import Image from 'next/image';
import React from 'react';

const Loader = () => {
    
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h2 className="text-2xl font-bold mb-4">Authentification</h2>
      <Image width={200} height={200} src="/loader.svg" alt="Loader" />
    </div>
  );
};

export default Loader;