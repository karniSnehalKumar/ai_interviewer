import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaBrain, FaTrophy } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import './Step3Report.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15,15,25,0.92)',
        border: '1px solid rgba(168,85,247,0.3)',
        borderRadius: '12px',
        padding: '10px 14px',
        color: '#f1f0f5',
        fontSize: '13px',
        backdropFilter: 'blur(12px)',
      }}>
        <p style={{ margin: '0 0 4px', color: 'rgba(196,181,253,0.7)', fontWeight: 600 }}>{label}</p>
        <p style={{ margin: 0, color: '#c4b5fd', fontWeight: 700 }}>Score: {payload[0].value}/10</p>
      </div>
    );
  }
  return null;
};

function getScoreBadgeClass(score) {
  if (score >= 7) return 'high';
  if (score >= 4) return 'mid';
  return 'low';
}

function getVerdict(score) {
  if (score >= 8) return { cls: 'excellent', icon: '🏆', text: 'Outstanding' };
  if (score >= 5) return { cls: 'good', icon: '⚡', text: 'Good Progress' };
  return { cls: 'needs-work', icon: '🎯', text: 'Keep Practicing' };
}

function getAdvice(score) {
  if (score >= 8)
    return 'Excellent performance! You demonstrate strong communication, clear thinking, and confident delivery. Continue supporting answers with real-world examples and stay consistent.';
  if (score >= 5)
    return 'Good foundation shown. Focus on structuring your responses more clearly and back your answers with concrete examples. Regular practice will sharpen your delivery.';
  return 'Significant improvement needed. Work on structured thinking (STAR method), speak with more confidence, and practice answering aloud daily to build fluency.';
}

function getPerformanceText(score) {
  if (score >= 8) return 'Ready for job opportunities.';
  if (score >= 5) return 'Needs minor improvement before interviews.';
  return 'Significant improvement required.';
}

function Step3Report({ report }) {
  const navigate = useNavigate();
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  if (!report) {
    return (
      <div className="report-loading">
        <div className="report-loading-spinner" />
        Generating your report…
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const percentage = (finalScore / 10) * 100;
  const verdict = getVerdict(finalScore);
  const advice = getAdvice(finalScore);
  const performanceText = getPerformanceText(finalScore);

  const questionScoreData = questionWiseScore.map((q, i) => ({
    name: `Q${i + 1}`,
    score: q.score ?? 0,
  }));

  const skills = [
    { label: 'Confidence', value: confidence, cls: 'confidence' },
    { label: 'Communication', value: communication, cls: 'communication' },
    { label: 'Correctness', value: correctness, cls: 'correctness' },
  ];

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="report-root">
      <div className="report-blobs">
        <div className="report-blob report-blob-1" />
        <div className="report-blob report-blob-2" />
        <div className="report-blob report-blob-3" />
      </div>

      <div className="report-content">
        <motion.div {...fadeUp(0)} className="report-header">
          <div className="report-header-left">
            <button
              className="report-back-btn"
              onClick={() => navigate('/')}
              aria-label="Go back"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="report-title">Interview Analytics</h1>
              <p className="report-subtitle">AI-powered performance insights</p>
            </div>
          </div>
        </motion.div>

        <div className="report-grid">
          <div className="report-col-left">
            <motion.div {...fadeUp(0.1)} className="report-card report-score-card">
              <p className="report-card-title">Overall Performance</p>

              <div className="report-score-ring-wrapper">
                <CircularProgressbar
                  value={percentage}
                  text={`${finalScore}/10`}
                  styles={buildStyles({
                    textSize: '20px',
                    pathColor: '#a855f7',
                    textColor: '#f1f0f5',
                    trailColor: 'rgba(255,255,255,0.07)',
                    pathTransitionDuration: 1.2,
                  })}
                />
              </div>

              <p className="report-score-label">Out of 10</p>

              <div className={`report-verdict ${verdict.cls}`}>
                <span>{verdict.icon}</span>
                <span>{verdict.text}</span>
              </div>

              <p className="report-tagline">{performanceText}</p>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="report-card">
              <p className="report-card-title">Skill Evaluation</p>
              <div className="report-skills-list">
                {skills.map((s) => (
                  <div key={s.label} className="report-skill-item">
                    <div className="report-skill-header">
                      <span className="report-skill-name">{s.label}</span>
                      <span className="report-skill-value">{s.value}/10</span>
                    </div>
                    <div className="report-skill-track">
                      <div
                        className={`report-skill-fill ${s.cls}`}
                        style={{ width: barsVisible ? `${s.value * 10}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.3)} className="report-card report-advice-card">
              <div className="report-advice-icon">
                <HiSparkles />
              </div>
              <p className="report-card-title" style={{ marginBottom: '10px' }}>AI Recommendation</p>
              <p className="report-advice-text">{advice}</p>
            </motion.div>
          </div>

          <div className="report-col-right">
            <motion.div {...fadeUp(0.1)}>
              <div className="report-stats-row">
                {[
                  { label: 'Questions', value: questionWiseScore.length },
                  { label: 'Final Score', value: `${finalScore}/10` },
                  {
                    label: 'Avg Q Score', value: questionWiseScore.length
                      ? (questionWiseScore.reduce((a, q) => a + (q.score ?? 0), 0) / questionWiseScore.length).toFixed(1)
                      : '—'
                  },
                ].map((stat) => (
                  <div key={stat.label} className="report-stat-mini">
                    <span className="report-stat-mini-value">{stat.value}</span>
                    <span className="report-stat-mini-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="report-card">
              <p className="report-card-title">Performance Trend</p>
              <div className="report-chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={questionScoreData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(241,240,245,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fill: 'rgba(241,240,245,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      fill="url(#scoreGrad)"
                      dot={{ fill: '#c4b5fd', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: '#c4b5fd', strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.3)} className="report-card">
              <p className="report-card-title">Question Breakdown</p>
              <div className="report-questions-list">
                {questionWiseScore.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.07, duration: 0.4 }}
                    className="report-question-item"
                  >
                    <div className="report-question-top">
                      <div>
                        <p className="report-question-meta">Question {i + 1}</p>
                        <p className="report-question-text">
                          {q.question || 'Question not available'}
                        </p>
                      </div>
                      <span className={`report-question-score-badge ${getScoreBadgeClass(q.score ?? 0)}`}>
                        {q.score ?? 0}/10
                      </span>
                    </div>

                    <div className="report-feedback-box">
                      <p className="report-feedback-label">AI Feedback</p>
                      <p className="report-feedback-text">
                        {q.feedback?.trim() || 'No feedback available for this question.'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step3Report;
