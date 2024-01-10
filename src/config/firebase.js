import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5H4qFCe1cwxS8Pft4FTuQbvv-hq5KWaE",
  authDomain: "fir-project-80725.firebaseapp.com",
  projectId: "fir-project-80725",
  storageBucket: "fir-project-80725.appspot.com",
  messagingSenderId: "700327616569",
  appId: "1:700327616569:web:8df02782a3c6e86d6bade8",
  measurementId: "G-9ZSP93K8BJ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
