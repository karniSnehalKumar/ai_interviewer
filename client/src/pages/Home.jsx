
import "./Home.css";
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthModal from '../components/AuthModal';
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from '../components/Footer';


function Home() {
  const { currentUser } = useSelector((state) => state.user)

  // Controls visibility of the authentication modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate()

  return (
    
    <div className="home-root">

      {/* ── Animated ambient blobs (same as AuthBackground) ── */}
      <div className="home-blobs" aria-hidden="true">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.65, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-15%", left: "-10%",
            width: 600, height: 600, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute", bottom: "-20%", right: "5%",
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          style={{
            position: "absolute", top: "40%", left: "40%",
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <Navbar />

      <div className="home-content">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="hero-section">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-badge"
          >
            <HiSparkles size={16} />
            AI Powered Smart Interview Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-title"
          >
            Practice Interviews with{" "}
            <span className="hero-highlight">AI Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-desc"
          >
            Role-based mock interviews with smart follow-ups,
            adaptive difficulty and real-time performance evaluation.
          </motion.p>

          <div className="hero-actions">
            <motion.button
              id="start-interview-btn"
              onClick={() => {
                if (!currentUser) { setIsAuthModalOpen(true); return; }
                navigate("/interview");
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary"
            >
              Start Interview
            </motion.button>

            <motion.button
              id="view-history-btn"
              onClick={() => {
                if (!currentUser) { setIsAuthModalOpen(true); return; }
                navigate("/history");
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-outline"
            >
              View History
            </motion.button>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        <section className="steps-section">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            How It <span className="accent">Works</span>
          </motion.h2>

          <div className="steps-row">
            {[
              {
                icon: <BsRobot size={22} />,
                step: "STEP 1",
                title: "Role & Experience Selection",
                desc: "AI adjusts difficulty based on selected job role.",
              },
              {
                icon: <BsMic size={22} />,
                step: "STEP 2",
                title: "Smart Voice Interview",
                desc: "Dynamic follow-up questions based on your answers.",
              },
              {
                icon: <BsClock size={22} />,
                step: "STEP 3",
                title: "Timer Based Simulation",
                desc: "Real interview pressure with time tracking.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ scale: 1.04 }}
                className="step-card"
              >
                <div className="step-icon-wrap">{item.icon}</div>
                <div className="step-label">{item.step}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-desc">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CAPABILITIES ─────────────────────────────────────── */}
        <section className="capabilities-section">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            Advanced AI <span className="accent">Capabilities</span>
          </motion.h2>

          <div className="capabilities-grid">
            {[
              {
                image: evalImg,
                icon: <BsBarChart size={18} />,
                title: "AI Answer Evaluation",
                desc: "Scores communication, technical accuracy and confidence.",
              },
              {
                image: resumeImg,
                icon: <BsFileEarmarkText size={18} />,
                title: "Resume Based Interview",
                desc: "Project-specific questions based on uploaded resume.",
              },
              {
                image: pdfImg,
                icon: <BsFileEarmarkText size={18} />,
                title: "Downloadable PDF Report",
                desc: "Detailed strengths, weaknesses and improvement insights.",
              },
              {
                image: analyticsImg,
                icon: <BsBarChart size={18} />,
                title: "History & Analytics",
                desc: "Track progress with performance graphs and topic analysis.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="capability-card"
              >
                <div className="capability-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="capability-info">
                  <div className="capability-icon">{item.icon}</div>
                  <h3 className="capability-title">{item.title}</h3>
                  <p className="capability-desc">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── INTERVIEW MODES ───────────────────────────────────── */}
        <section className="modes-section">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            Multiple Interview <span className="accent">Modes</span>
          </motion.h2>

          <div className="modes-grid">
            {[
              {
                img: hrImg,
                title: "HR Interview Mode",
                desc: "Behavioral and communication based evaluation.",
              },
              {
                img: techImg,
                title: "Technical Mode",
                desc: "Deep technical questioning based on selected role.",
              },
              {
                img: confidenceImg,
                title: "Confidence Detection",
                desc: "Basic tone and voice analysis insights.",
              },
              {
                img: creditImg,
                title: "Credits System",
                desc: "Unlock premium interview sessions easily.",
              },
            ].map((mode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="mode-card"
              >
                <div className="mode-text">
                  <h3 className="mode-title">{mode.title}</h3>
                  <p className="mode-desc">{mode.desc}</p>
                </div>
                <div className="mode-img-wrap">
                  <img src={mode.img} alt={mode.title} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>

      {/* Render the auth modal when the user tries to access a protected route */}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
      <Footer />

    </div>
  );
}

export default Home
