import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from '../utils/constants';
import { FaArrowLeft, FaTrophy, FaClock, FaChartBar, FaBriefcase } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { BsRobot } from 'react-icons/bs';
import './InterviewHistory.css';

function getScoreClass(score) {
  if (score >= 8) return 'excellent';
  if (score >= 5) return 'good';
  return 'low';
}

function getScoreLabel(score) {
  if (score >= 8) return 'Outstanding';
  if (score >= 5) return 'Good';
  return 'Practice';
}

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const result = await axios.get(
          SERVER_URL + '/api/interview/get-interview',
          { withCredentials: true }
        );
        setInterviews(result.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load interview history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const completed = interviews.filter((i) => i.status === 'completed');
  const avgScore = completed.length
    ? (completed.reduce((acc, i) => acc + (i.finalScore ?? 0), 0) / completed.length).toFixed(1)
    : null;
  const bestScore = completed.length
    ? Math.max(...completed.map((i) => i.finalScore ?? 0))
    : null;

  if (loading) {
    return (
      <div className="ih-root">
        <div className="ih-loading">
          <div className="ih-loading-spinner" />
          <span>Loading your interviews…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ih-root">
        <div className="ih-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ih-root">
      <div className="ih-blobs" aria-hidden="true">
        <div className="ih-blob ih-blob-1" />
        <div className="ih-blob ih-blob-2" />
        <div className="ih-blob ih-blob-3" />
      </div>

      <div className="ih-content">
        <div className="ih-header">
          <div className="ih-header-left">
            <button className="ih-back-btn" onClick={() => navigate('/')}>
              <FaArrowLeft size={14} />
            </button>
            <div>
              <h1 className="ih-title">Interview History</h1>
              <p className="ih-subtitle">Track your performance across every session</p>
            </div>
          </div>

          <button className="ih-new-btn" onClick={() => navigate('/interview')}>
            <HiSparkles size={15} />
            New Interview
          </button>
        </div>

        {interviews.length > 0 && (
          <div className="ih-stats-row">
            <div className="ih-stat-card">
              <span className="ih-stat-icon"><FaChartBar /></span>
              <span className="ih-stat-value">{interviews.length}</span>
              <span className="ih-stat-label">Total Sessions</span>
            </div>
            <div className="ih-stat-card">
              <span className="ih-stat-icon"><FaTrophy /></span>
              <span className="ih-stat-value">{bestScore !== null ? `${bestScore}/10` : '—'}</span>
              <span className="ih-stat-label">Best Score</span>
            </div>
            <div className="ih-stat-card">
              <span className="ih-stat-icon"><HiSparkles /></span>
              <span className="ih-stat-value">{avgScore !== null ? `${avgScore}/10` : '—'}</span>
              <span className="ih-stat-label">Avg Score</span>
            </div>
            <div className="ih-stat-card">
              <span className="ih-stat-icon"><FaBriefcase /></span>
              <span className="ih-stat-value">{completed.length}</span>
              <span className="ih-stat-label">Completed</span>
            </div>
          </div>
        )}

        {interviews.length === 0 ? (
          <div className="ih-empty">
            <div className="ih-empty-icon">
              <BsRobot size={40} />
            </div>
            <h2 className="ih-empty-title">No interviews yet</h2>
            <p className="ih-empty-text">
              Take your first AI-powered mock interview and unlock detailed analytics.
            </p>
            <button className="ih-start-btn" onClick={() => navigate('/interview')}>
              <HiSparkles />
              Start First Interview
            </button>
          </div>
        ) : (
          <div className="ih-grid">
            {interviews.map((item, index) => {
              const scoreClass = getScoreClass(item.finalScore ?? 0);
              const scoreLabel = getScoreLabel(item.finalScore ?? 0);
              const date = new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              });
              const progressWidth = `${((item.finalScore ?? 0) / 10) * 100}%`;

              return (
                <div key={item._id || index} className="ih-card">
                  <div className="ih-card-top">
                    <div className="ih-card-icon">
                      <FaBriefcase size={16} />
                    </div>

                    <div className="ih-card-info">
                      <h3 className="ih-card-role">{item.role || 'Untitled Role'}</h3>
                      <div className="ih-card-meta">
                        <span>{item.experience}</span>
                        {item.mode && (
                          <>
                            <span className="ih-meta-dot">·</span>
                            <span>{item.mode}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <span className={`ih-status-badge ${item.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                      {item.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  <div className="ih-card-divider" />

                  <div className="ih-card-bottom">
                    <div className="ih-card-date">
                      <FaClock size={11} />
                      {date}
                    </div>

                    <div className="ih-card-score-area">
                      <span className={`ih-score-badge ${scoreClass}`}>
                        {item.finalScore ?? 0}/10
                      </span>
                      <span className={`ih-score-label ${scoreClass}`}>
                        {scoreLabel}
                      </span>
                    </div>
                  </div>

                  <div className="ih-progress-track">
                    <div
                      className={`ih-progress-fill ${scoreClass}`}
                      style={{ width: progressWidth }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewHistory;
