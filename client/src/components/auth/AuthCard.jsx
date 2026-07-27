import { BsRobot } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react";

const TRUST_CHIPS = ["🔒 Encrypted", "🚫 No Spam", "✅ Free to Start"];

/**
 * Glass sign-in card — right panel of the auth page.
 * @param {{ onGoogleSignIn?: () => void }} props
 */
export default function AuthCard({ onGoogleSignIn }) {
  return (
    <div className="auth-right">
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

        {/* Google sign-in */}
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

        {/* Trust chips */}
        <div className="auth-trust">
          {TRUST_CHIPS.map((chip) => (
            <span key={chip} className="auth-trust-chip">
              {chip}
            </span>
          ))}
        </div>

        {/* Footer */}
        <p className="auth-card-footer">
          By continuing you agree to our{" "}
          <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );
}
