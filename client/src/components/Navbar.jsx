import { BsRobot } from "react-icons/bs";

export default function Navbar() {
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
        <span style={{ fontWeight: 700, fontSize: 17, color: "#f1f0f5", letterSpacing: "-0.3px" }}>InterviewIQ</span>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#a855f7",
          background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.35)",
          borderRadius: 999, padding: "2px 8px",
        }}>AI</span>
      </div>
    </nav>
  );
}
