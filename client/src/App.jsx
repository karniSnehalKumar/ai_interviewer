import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import InterviewPage from "./pages/InterviewPage";
import InterviewHistory from "./pages/InterviewHistory";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "./redux/userSlice";
import { SERVER_URL } from "./utils/constants";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(SERVER_URL + "/api/user/current-user", {
          withCredentials: true,
        });
        dispatch(setCurrentUser(response.data));
      } catch (error) {
        dispatch(setCurrentUser(null));
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#080810",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#a855f7",
        fontFamily: "sans-serif"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <InterviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <InterviewHistory />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

