
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-interviewer-35d66.firebaseapp.com",
  projectId: "ai-interviewer-35d66",
  storageBucket: "ai-interviewer-35d66.firebasestorage.app",
  messagingSenderId: "242364075615",
  appId: "1:242364075615:web:4ce1586eff4eb8ce9195ea",
  measurementId: "G-S1HQBDM8PT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };