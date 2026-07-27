import { motion } from "motion/react";

/**
 * Animated ambient gradient blobs for the auth page background.
 */
export default function AuthBackground() {
  return (
    <div className="auth-blobs" aria-hidden="true">
      {/* Purple blob — top-left */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Cyan blob — bottom-right */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Amber blob — center */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          position: "absolute",
          top: "40%",
          left: "40%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}
