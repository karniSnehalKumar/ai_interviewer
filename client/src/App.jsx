import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InterviewPage from "./pages/InterviewPage";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./redux/userSlice";
import { SERVER_URL } from "./utils/constants";

export const App = () => {
  const dispatch = useDispatch();
 

  // On mount, attempt to restore the user's session from the server cookie.
  // If the cookie is valid, the server returns the user object and we store it in Redux.
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(SERVER_URL + "/api/user/current-user", {
          withCredentials: true,
        });
        dispatch(setCurrentUser(response.data));
      } catch (error) {
        // No valid session — keep currentUser as null (logged-out state)
        console.log("No active session:", error);
        dispatch(setCurrentUser(null));
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/interview" element={<InterviewPage />} />
     
    </Routes>
  );
};
