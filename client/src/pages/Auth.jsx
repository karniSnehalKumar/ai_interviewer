import "./Auth.css";
import AuthBackground from "../components/auth/AuthBackground";
import AuthLeftPanel from "../components/auth/AuthLeftPanel";
import AuthCard from "../components/auth/AuthCard";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { ServerUrl } from "../App";



export default function Auth() {
   const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth,provider)
            let User = response.user
            let name = User.displayName
            let email = User.email
            const result = await axios.post(ServerUrl + "/api/auth/google" , {name , email} , {withCredentials:true})
            console.log(result.data)


            
        } catch (error) {
            console.log(error)
            
        }
    }

  return (
    <div className="auth-root">
      <AuthBackground />
      <AuthLeftPanel />
      <AuthCard onGoogleSignIn={handleGoogleAuth} />
    </div>
  );
}