// AuthModal renders a full-screen backdrop overlay with the AuthCard centred inside.
// It handles the Google OAuth sign-in flow and dispatches the user to Redux on success.

import "./AuthModal.css";
import AuthCard from "./auth/AuthCard";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { SERVER_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/userSlice";

export default function AuthModal({ onClose }) {
  const dispatch = useDispatch();

  // Triggers the Google sign-in popup, sends the user's details to the server,
  // and stores the returned user object in Redux. Closes the modal on success.
  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const firebaseUser = response.user;
      const name = firebaseUser.displayName;
      const email = firebaseUser.email;

      const result = await axios.post(
        SERVER_URL + "/api/auth/google",
        { name, email },
        { withCredentials: true }
      );

      dispatch(setCurrentUser(result.data));
      onClose();
    } catch (error) {
      console.log("Google sign-in failed:", error);
      dispatch(setCurrentUser(null));
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      {/* Stop click propagation so clicking the card doesn't close the modal */}
      <div onClick={(e) => e.stopPropagation()}>
        <AuthCard onGoogleSignIn={handleGoogleSignIn} />
      </div>
    </div>
  );
}
