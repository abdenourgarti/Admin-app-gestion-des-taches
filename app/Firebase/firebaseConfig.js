import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyALWQfHmjyVkdIPtNluVegmNx45t_tV2Y8",
    authDomain: "pfemaster-ad550.firebaseapp.com",
    projectId: "pfemaster-ad550",
    storageBucket: "pfemaster-ad550.appspot.com",
    messagingSenderId: "628982579083",
    appId: "1:628982579083:web:9a02257a277b788770798e",
    measurementId: "G-5PD6LW3QY5"
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const firestore = getFirestore();

  export const user = uid => doc(firestore, `users/${uid}`)
  