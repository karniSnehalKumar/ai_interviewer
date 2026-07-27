import { BsRobot } from "react-icons/bs";
import {
  IoSparklesSharp,
  IoShieldCheckmarkSharp,
  IoBarChartSharp,
  IoFlashSharp,
} from "react-icons/io5";
import { motion } from "motion/react";

const FEATURES = [
  {
    Icon: IoSparklesSharp,
    color: "#a855f7",
    bg: "rgba(168,85,247,0.12)",
    border: "rgba(168,85,247,0.25)",
    label: "AI-Powered Questions",
    desc: "Tailored mock interviews that adapt to your role and experience.",
  },
  {
    Icon: IoBarChartSharp,
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.25)",
    label: "Instant Feedback",
    desc: "Real-time analysis and actionable tips after every answer.",
  },
  {
    Icon: IoFlashSharp,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.25)",
    label: "Track Progress",
    desc: "Visual dashboard showing your growth session by session.",
  },
  {
    Icon: IoShieldCheckmarkSharp,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.25)",
    label: "Private & Secure",
    desc: "Your data is encrypted and never shared with anyone.",
  },
];

/**
 * Left panel — branding, headline, and feature grid.
 */
export default function AuthLeftPanel() {
  return (
    <motion.div
      className="auth-left"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Logo */}
      <div className="auth-logo">
        <span className="auth-logo-icon">
          <BsRobot size={20} />
        </span>
        <span className="auth-logo-name">InterviewIQ</span>
        <span className="auth-logo-badge">AI</span>
      </div>

      {/* Headline */}
      <div className="auth-headline">
        <h1>
          Ace every interview
          <br />
          <span className="auth-gradient-text">with AI by your side.</span>
        </h1>
        <p>
          Practice smarter with adaptive mock interviews, instant expert
          feedback, and a dashboard that tracks every step of your progress.
        </p>
      </div>

      {/* Feature grid */}
      <div className="auth-features">
        {FEATURES.map(({ Icon, color, bg, border, label, desc }, i) => (
          <motion.div
            key={label}
            className="auth-feature-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
          >
            <span
              className="auth-feature-icon"
              style={{ background: bg, border: `1px solid ${border}`, color }}
            >
              <Icon size={16} />
            </span>
            <div>
              <p className="auth-feature-label">{label}</p>
              <p className="auth-feature-desc">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
