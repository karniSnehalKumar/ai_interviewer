// AuthCard is the pure UI sign-in card shown inside the AuthModal overlay.
// It is a presentational component — all logic lives in AuthModal.

import { BsRobot } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react";

// Pill badges shown below the sign-in button to build user trust
const TRUST_BADGES = ["🔒 Encrypted", "🚫 No Spam", "✅ Free to Start"];

/**
 * Glass sign-in card displayed inside the AuthModal.
 * @param {{ onGoogleSignIn?: () => void }} props
 */
export default function AuthCard({ onGoogleSignIn }) {
  return (
    <motion.div
      className="auth-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
    >
      {/* Inner glow accent */}
      <div className="auth-card-glow" />

      {/* Header */}
      <div className="auth-card-header">
        <div className="auth-card-icon">
          <BsRobot size={26} />
        </div>
        <p className="auth-card-eyebrow">Get started free</p>
        <h2 className="auth-card-title">Sign in to continue</h2>
        <p className="auth-card-subtitle">
          One click to unlock AI mock interviews, feedback &amp; more.
        </p>
      </div>

      {/* Google sign-in button */}
      <button
        id="google-signin-btn"
        className="auth-google-btn"
        onClick={onGoogleSignIn}
        aria-label="Continue with Google"
      >
        <FcGoogle size={22} aria-hidden="true" />
        Continue with Google
      </button>

      {/* Divider */}
      <div className="auth-divider">
        <hr />
        <span>Secured by OAuth 2.0</span>
        <hr />
      </div>

      {/* Trust badges */}
      <div className="auth-trust">
        {TRUST_BADGES.map((badge) => (
          <span key={badge} className="auth-trust-chip">
            {badge}
          </span>
        ))}
      </div>

      {/* Footer */}
      <p className="auth-card-footer">
        By continuing you agree to our{" "}
        <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>.
      </p>
    </motion.div>
  );
}
