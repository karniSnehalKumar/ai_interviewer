/* Circular countdown timer — dark glassmorphic theme */
function Timer({ timeLeft, totalTime = 60 }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, timeLeft / totalTime));
  const dashOffset = circumference * (1 - progress);

  // Colour shifts: purple → cyan → red as time runs out
  const strokeColor =
    progress > 0.5
      ? "#a855f7"
      : progress > 0.25
      ? "#06b6d4"
      : "#ef4444";

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const label = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" aria-label={`${label} remaining`}>
      {/* Track */}
      <circle
        cx="50" cy="50" r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="7"
      />
      {/* Progress arc */}
      <circle
        cx="50" cy="50" r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.5s ease" }}
      />
      {/* Time label */}
      <text
        x="50" y="54"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#f1f0f5"
        fontSize="16"
        fontWeight="700"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}

export default Timer;
