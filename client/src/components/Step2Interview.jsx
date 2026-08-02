import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash, FaBrain } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { BsArrowRight, BsSpeaker } from "react-icons/bs";
import axios from "axios";
import { SERVER_URL } from "../utils/constants";
import Timer from "./Timer";
import "./Step2Interview.css";

/* ─────────────────────────────────────────────────────────
   BACKEND ENDPOINTS (connect these once your server is ready)
   ─────────────────────────────────────────────────────────
   POST  /api/interview/submit-answer
         body: { interviewId, questionIndex, answer, timeTaken }
         expects: { feedback: string }

   POST  /api/interview/finish
         body: { interviewId }
         expects: { ...finalReportData }
   ───────────────────────────────────────────────────────── */

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;

  /* ── State ── */
  const [isIntroPhase, setIsIntroPhase]   = useState(true);
  const [isMicOn, setIsMicOn]             = useState(true);
  const [isAIPlaying, setIsAIPlaying]     = useState(false);
  const [currentIndex, setCurrentIndex]  = useState(0);
  const [answer, setAnswer]               = useState("");
  const [feedback, setFeedback]           = useState("");
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [subtitle, setSubtitle]           = useState("");
  const [timeLeft, setTimeLeft]           = useState(questions[0]?.timeLimit || 60);

  /* ── Refs ── */
  const recognitionRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  /* ════════════════════════════
     VOICE LOADING
     ════════════════════════════ */
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // the above gives us a array not a promise thats why we have to add a eventlistner to it in the below code.

      if (!voices.length) return;

      const preferred =
        voices.find((v) =>
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("female")
        ) || voices[0];

      setSelectedVoice(preferred);
    };

    loadVoices();
    // we are adding this even listner because the when we getVoices it return an empty array from the browsers cache because the browser is not does asking for voices from the OS , so when the browser gets the voices we ask for voices again and then it gives us a array of voices.
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  /* ════════════════════════════
     SPEAK HELPER
     ════════════════════════════ */
  const speakText = (text) =>
    new Promise((resolve) => {
      // if the browser does not support the text to speach or if the voice is not selected it returns.
      if (!window.speechSynthesis || !selectedVoice) { resolve(); return; }
     // this line stops any previous tts going on.
      window.speechSynthesis.cancel();
      //this line is to make the speech more human like.
      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");
      // this creates an object that need everything for speech.
      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice  = selectedVoice;
      utterance.rate   = 0.92;
      utterance.pitch  = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
      };

      utterance.onend = () => {
        setIsAIPlaying(false);
        if (isMicOn) startMic();
        setTimeout(() => { setSubtitle(""); resolve(); }, 300);
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });

  /* ════════════════════════════
     INTRO + QUESTION FLOW
     ════════════════════════════ */
  useEffect(() => {
    if (!selectedVoice) return;

    const runFlow = async () => {
      if (isIntroPhase) {
       
        await speakText(`Hi ${userName}, great to meet you! I hope you're feeling confident and ready.`);
        await speakText("I'll ask you a few questions. Answer naturally and take your time. Let's begin.");
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this last one might be a bit more challenging.");
        }
        await speakText(currentQuestion.question);
        if (isMicOn) startMic();
      }
    };

    runFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoice, isIntroPhase, currentIndex]);

  /* ════════════════════════════
     TIMER
     ════════════════════════════ */
  useEffect(() => {
    if (isIntroPhase || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);

  /* Auto-submit on timeout */
  useEffect(() => {
    if (!isIntroPhase && currentQuestion && timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  /* ════════════════════════════
     SPEECH RECOGNITION
     ════════════════════════════ */
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang            = "en-US";
    recognition.continuous      = true;
    recognition.interimResults  = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try { recognitionRef.current.start(); } catch {}
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
  };

  const toggleMic = () => {
    if (isMicOn) { stopMic(); } else { startMic(); }
    setIsMicOn(!isMicOn);
  };

  /* ════════════════════════════
     SUBMIT ANSWER
     ════════════════════════════
     ENDPOINT: POST /api/interview/submit-answer
  ════════════════════════════ */
  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        SERVER_URL + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true }
      );
      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
    } catch (error) {
      console.error("[submit-answer]", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ════════════════════════════
     NEXT / FINISH
     ════════════════════════════ */
  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");
    setCurrentIndex(currentIndex + 1);
    setTimeout(() => { if (isMicOn) startMic(); }, 500);
  };

  /* ════════════════════════════
     FINISH INTERVIEW
     ════════════════════════════
     ENDPOINT: POST /api/interview/finish
  ════════════════════════════ */
  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        SERVER_URL + "/api/interview/finish",
        { interviewId },
        { withCredentials: true }
      );
      onFinish(result.data);
    } catch (error) {
      console.error("[finish]", error);
    }
  };

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      try { recognitionRef.current?.stop(); recognitionRef.current?.abort(); } catch {}
      window.speechSynthesis.cancel();
    };
  }, []);

  /* ════════════════════════════
     AI STATUS LABEL
     ════════════════════════════ */
  const statusLabel = isIntroPhase
    ? "Introducing"
    : isAIPlaying
    ? "AI Speaking"
    : isMicOn
    ? "Listening"
    : "Paused";

  const statusClass = isAIPlaying ? "speaking" : isMicOn ? "idle" : "";

  /* ════════════════════════════
     RENDER
     ════════════════════════════ */
  return (
    <div className="interview-root">
      {/* ── Ambient blobs ── */}
      <div className="interview-blobs" aria-hidden="true">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-15%", left: "-10%",
            width: 480, height: 480, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute", bottom: "-20%", right: "5%",
            width: 420, height: 420, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.22) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* ── Main card ── */}
      <motion.div
        className="interview-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        {/* ══════════════ LEFT PANEL ══════════════ */}
        <div className="interview-left">

          {/* AI Orb Avatar */}
          <div className={`ai-avatar-wrap${isAIPlaying ? " speaking" : ""}`}>
            <motion.div
              className={`ai-orb${isAIPlaying ? " speaking" : ""}`}
              animate={isAIPlaying
                ? { scale: [1, 1.04, 1] }
                : { scale: 1 }
              }
              transition={isAIPlaying
                ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                : {}
              }
            >
              <FaBrain className="ai-orb-icon" />
            </motion.div>

            {/* Sound wave under orb */}
            <div className={`ai-soundwave${isAIPlaying ? " active" : ""}`}>
              <span /><span /><span /><span /><span />
            </div>
          </div>

          {/* Status badge */}
          <div className={`ai-status-badge ${statusClass}`}>
            <span className="ai-status-dot" />
            {statusLabel}
          </div>

          {/* Subtitle / what AI is saying */}
          <AnimatePresence mode="wait">
            {subtitle ? (
              <motion.div
                className="ai-subtitle"
                key="subtitle"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                &ldquo;{subtitle}&rdquo;
              </motion.div>
            ) : (
              <div className="ai-subtitle" style={{ color: "rgba(241,240,245,0.25)" }}>
                {isIntroPhase ? "Getting ready…" : isAIPlaying ? "Speaking…" : "Awaiting your answer…"}
              </div>
            )}
          </AnimatePresence>

          {/* Stats card */}
          <div className="interview-stats">
            <div className="timer-label">Time Remaining</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
            </div>

            <div className="iv-divider" />

            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-value">{currentIndex + 1}</span>
                <span className="stat-label">Current Q</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{questions.length}</span>
                <span className="stat-label">Total Qs</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════ RIGHT PANEL ══════════════ */}
        <div className="interview-right">
          {/* Header */}
          <div className="interview-header">
            <h2 className="interview-title">AI Smart Interview</h2>
            <span className="interview-badge">
              <HiSparkles size={13} />
              AI-Powered
            </span>
          </div>

          {/* Question / Intro placeholder */}
          <AnimatePresence mode="wait">
            {isIntroPhase ? (
              <motion.div
                key="intro"
                className="intro-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FaBrain className="intro-icon" />
                <p className="intro-text">
                  The AI interviewer is introducing itself…
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`q-${currentIndex}`}
                className="question-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <p className="question-meta">
                  Question {currentIndex + 1} of {questions.length}
                </p>
                <p className="question-text">{currentQuestion?.question}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Answer textarea */}
          <textarea
            className="interview-textarea"
            placeholder="Type or speak your answer here…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isIntroPhase}
          />

          {/* Actions */}
          {!feedback ? (
            <div className="interview-actions">
              {/* Mic toggle */}
              <motion.button
                className={`mic-btn ${isMicOn ? "active" : "muted"}`}
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                title={isMicOn ? "Mute microphone" : "Unmute microphone"}
              >
                {isMicOn ? <FaMicrophone size={18} /> : <FaMicrophoneSlash size={18} />}
              </motion.button>

              {/* Submit */}
              <motion.button
                className="submit-btn"
                onClick={submitAnswer}
                disabled={isSubmitting || isIntroPhase}
                whileTap={{ scale: 0.97 }}
              >
                {isSubmitting ? (
                  <>
                    <span className="iv-spinner" />
                    Evaluating…
                  </>
                ) : (
                  "Submit Answer"
                )}
              </motion.button>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                className="feedback-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className="feedback-label">AI Feedback</p>
                <p className="feedback-text">{feedback}</p>

                <button className="next-btn" onClick={handleNext}>
                  {currentIndex + 1 >= questions.length
                    ? "Finish Interview"
                    : "Next Question"}
                  <BsArrowRight size={16} />
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Step2Interview;
