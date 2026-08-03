export default function Footer() {
  return (
    <footer style={{
      position: "relative", zIndex: 1,
      padding: "32px 40px", textAlign: "center",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      color: "rgba(241,240,245,0.3)", fontSize: 13,
    }}>
      © {new Date().getFullYear()} InterviewIQ · All rights reserved
    </footer>
  );
}
