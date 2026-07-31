import { useState } from 'react';
import axios from "axios";
import { SERVER_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../redux/userSlice';
import { motion } from "motion/react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
  FaBrain,
  FaStar,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import "./Step1SetUp.css";

function Step1SetUp({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);
    const formdata = new FormData();
    formdata.append("resume", resumeFile);
    try {
      const result = await axios.post(SERVER_URL + "/api/interview/resume", formdata, {
        withCredentials: true,
      });
      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
    } catch (error) {
      console.log(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        SERVER_URL + "/api/interview/generate-questions",
        { role, experience, mode, resumeText, projects, skills },
        { withCredentials: true }
      );
      if (userData) {
        dispatch(setCurrentUser({ ...userData, credits: result.data.creditsLeft }));
      }
      onStart(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <FaUserTie size={16} />, text: "Choose Role & Experience" },
    { icon: <FaMicrophoneAlt size={16} />, text: "Smart Voice Interview" },
    { icon: <FaChartLine size={16} />, text: "Performance Analytics" },
    { icon: <FaBrain size={16} />, text: "AI-Powered Evaluation" },
  ];

  return (
    <motion.div
      className="setup-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── Ambient background blobs ── */}
      <div className="setup-blobs" aria-hidden="true">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.65, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-15%", left: "-10%",
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute", bottom: "-20%", right: "5%",
            width: 450, height: 450, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          style={{
            position: "absolute", top: "40%", left: "40%",
            width: 350, height: 350, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ── Main card ── */}
      <motion.div
        className="setup-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* ── LEFT PANEL ── */}
        <motion.div
          className="setup-left"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <div className="setup-badge">
            <HiSparkles size={13} />
            AI-Powered Interview
          </div>

          <h2 className="setup-left-title">
            Start Your <span className="accent">AI Interview</span>
          </h2>

          <p className="setup-left-desc">
            Practice real interview scenarios powered by AI.
            Improve communication, technical skills, and confidence.
          </p>

          <div className="setup-feature-list">
            {features.map((item, index) => (
              <motion.div
                key={index}
                className="setup-feature-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="setup-feature-icon">{item.icon}</div>
                <span className="setup-feature-text">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT PANEL (form) ── */}
        <motion.div
          className="setup-right"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <h2 className="setup-form-title">Interview Setup</h2>

          <div className="setup-form">
            {/* Mode select */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="setup-select"
            >
              <option value="Technical">Technical Interview</option>
              <option value="HR">HR Interview</option>
            </select>

            {/* Resume upload zone */}
            {!analysisDone && (
              <motion.div
                className="setup-upload-zone"
                whileHover={{ scale: 1.01 }}
                onClick={() => document.getElementById("resumeUpload").click()}
              >
                <div className="setup-upload-icon">
                  <FaFileUpload />
                </div>

                <input
                  type="file"
                  accept="application/pdf"
                  id="resumeUpload"
                  style={{ display: "none" }}
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />

                {resumeFile ? (
                  <p className="setup-upload-filename">{resumeFile.name}</p>
                ) : (
                  <p className="setup-upload-text">
                    Click to upload resume{" "}
                    <span style={{ opacity: 0.6 }}>(Optional · PDF only)</span>
                  </p>
                )}

                {resumeFile && (
                  <motion.button
                    className="setup-analyze-btn"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                  >
                    {analyzing ? (
                      <>
                        <span className="setup-btn-spinner" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Resume"
                    )}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Analysis result */}
            {analysisDone && (
              <motion.div
                className="setup-analysis-box"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className="setup-analysis-title">Resume Analysis</p>

                {/* Role & Experience detected by AI */}
                <div className="setup-analysis-meta">
                  {role && (
                    <div className="setup-analysis-meta-item">
                      <FaUserTie className="setup-meta-icon" />
                      <span>{role}</span>
                    </div>
                  )}
                  {experience && (
                    <div className="setup-analysis-meta-item">
                      <FaBriefcase className="setup-meta-icon" />
                      <span>{experience}</span>
                    </div>
                  )}
                </div>

                {projects.length > 0 && (
                  <>
                    <p className="setup-analysis-label">Projects</p>
                    <ul className="setup-analysis-items">
                      {projects.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </>
                )}

                {skills.length > 0 && (
                  <>
                    <p className="setup-analysis-label">Skills</p>
                    <div className="setup-skill-tags">
                      {skills.map((s, i) => (
                        <span key={i} className="setup-skill-tag">{s}</span>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Start button */}
            <motion.button
              className="setup-start-btn"
              onClick={handleStart}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <>
                  <span className="setup-btn-spinner" />
                  Starting...
                </>
              ) : (
                "Start Interview →"
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Step1SetUp;