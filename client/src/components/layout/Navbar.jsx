import { BsRobot } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../utils/constants";

export default function Navbar() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(SERVER_URL + "/api/auth/logout", { withCredentials: true });
    } catch (error) {

      console.error("Logout error:", error);
    } finally {
      dispatch(setCurrentUser(null));
      navigate("/");
    }
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "rgba(8,8,16,0.8)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #a855f7, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
          boxShadow: "0 0 16px rgba(168,85,247,0.4)",
        }}>
          <BsRobot size={18} />
        </span>
        <span style={{ fontWeight: 700, fontSize: 17, color: "#f1f0f5", letterSpacing: "-0.3px" }}>PrepIQ</span>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#a855f7",
          background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.35)",
          borderRadius: 999, padding: "2px 8px",
        }}>AI</span>
      </div>


      {currentUser && (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{
            fontSize: 13, fontWeight: 500, color: "rgba(241,240,245,0.55)",
            maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {currentUser.name}
          </span>
          <button
            id="logout-btn"
            onClick={handleLogout}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 20px", borderRadius: 999,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.2s, border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.2)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.55)";
              e.currentTarget.style.color = "#fca5a5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.1)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
              e.currentTarget.style.color = "#f87171";
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

