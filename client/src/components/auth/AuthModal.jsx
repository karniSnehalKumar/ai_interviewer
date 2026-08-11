import "./AuthModal.css";
import AuthCard from "./AuthCard";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";
import axios from "axios";
import { SERVER_URL } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/userSlice";

export default function AuthModal({ onClose }) {
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const IDtoken = await response.user.getIdToken();
      console.log(IDtoken);
      const result = await axios.post(
        SERVER_URL + "/api/auth/google",
        { IDtoken },
        { withCredentials: true }
      );
      dispatch(setCurrentUser(result.data));
      onClose();
    } catch (error) {
      console.error("Google sign-in error:", error?.response?.data || error?.message || error);
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
      <div onClick={(e) => e.stopPropagation()}>
        <AuthCard onGoogleSignIn={handleGoogleSignIn} />
      </div>
    </div>
  );
}
