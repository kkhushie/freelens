'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function WrappedSlideshow({
  projects,
  clients,
  goals,
  achievements,
  onClose,
  triggerConfetti
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Calculations for stats
  const totalEarningsAllTime = projects
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalProjectsCompleted = projects.filter(p => p.status === 'Completed').length;
  const avgProjectValue = totalProjectsCompleted > 0 ? Math.round(totalEarningsAllTime / totalProjectsCompleted) : 0;
  
  const goalProgressPercentage = goals.monthly_target > 0 
    ? Math.min(Math.round((goals.current / goals.monthly_target) * 100), 100) 
    : 0;

  const topClient = clients.length > 0 ? clients[0] : null;
  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });

  // Slide content for Freelancer Wrapped
  const wrappedSlides = [
    {
      title: "Freelens Wrapped",
      subtitle: "2026 Creative Journey",
      content: (
        <div>
          <div className="wrapped-intro-badge">
            🎬
          </div>
          <h3 className="wrapped-slide-title">Your Year in Creative Flow</h3>
          <p className="wrapped-slide-p">
            {"You've edited, animated, designed, and launched your way to new milestones. Let's look at the reels of your success."}
          </p>
        </div>
      )
    },
    {
      title: "Total Output",
      subtitle: "Crushing creative deliverables",
      content: (
        <div>
          <div className="wrapped-stats-grid">
            <div className="wrapped-stat-box">
              <span className="wrapped-stat-box-label">Earnings</span>
              <span className="wrapped-stat-box-val lime-text">₹{totalEarningsAllTime.toLocaleString()}</span>
            </div>
            <div className="wrapped-stat-box">
              <span className="wrapped-stat-box-label">Completed</span>
              <span className="wrapped-stat-box-val">{totalProjectsCompleted}</span>
            </div>
          </div>
          <p className="wrapped-slide-p">
            {"That's an average of "}
            <strong style={{color: 'var(--text-primary)'}}>₹{avgProjectValue.toLocaleString()}</strong>
            {" per asset delivered. Outstanding output!"}
          </p>
        </div>
      )
    },
    {
      title: "MVP Client",
      subtitle: "Your strongest partnership",
      content: (
        <div>
          {topClient ? (
            <>
              <div className="wrapped-mvp-badge" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {topClient.avatar && topClient.avatar.startsWith('http') ? (
                  <img src={topClient.avatar} alt={topClient.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {topClient.avatar || topClient.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <h4 className="wrapped-mvp-name">{topClient.name}</h4>
              <p className="wrapped-mvp-rev">₹{topClient.revenue.toLocaleString()} Revenue</p>
              <p className="wrapped-slide-p">
                Responsible for <span className="wrapped-mvp-percent">{Math.round((topClient.revenue / (totalEarningsAllTime || 1)) * 100)}%</span> of your total creative income. Build on this relationship!
              </p>
            </>
          ) : (
            <p className="wrapped-slide-p">No clients tracked yet. Add projects to identify your MVP client!</p>
          )}
        </div>
      )
    },
    {
      title: "Milestones Unlocked",
      subtitle: "Milestones achieved along the way",
      content: (
        <div>
          <div className="wrapped-badges-row">
            {achievements.slice(0, 3).map((ach) => (
              <div 
                key={ach.id} 
                className={`wrapped-badge-item ${ach.unlocked ? 'unlocked' : ''}`}
              >
                <span className="wrapped-badge-item-icon">{ach.unlocked ? ach.icon : '🔒'}</span>
                <span className="wrapped-badge-item-name">{ach.name}</span>
              </div>
            ))}
          </div>
          <p className="wrapped-slide-p">
            {"You've unlocked "}
            <span className="lime-text" style={{fontWeight: 600}}>{achievements.filter(a => a.unlocked).length} of {achievements.length}</span>
            {" career achievements. Keep pushing limits!"}
          </p>
        </div>
      )
    },
    {
      title: "The Next Level",
      subtitle: "Focusing on what's next",
      content: (
        <div>
          <p className="wrapped-slide-p" style={{marginBottom: '0.5rem', fontWeight: 500}}>Your current {currentMonthName} monthly goal progress:</p>
          <div className="wrapped-slide-title" style={{fontSize: '2.5rem', color: 'var(--accent-lime)'}}>{goalProgressPercentage}%</div>
          <p className="wrapped-slide-p" style={{marginBottom: '1.5rem'}}>
            ₹{goals.current.toLocaleString()} of your ₹{goals.monthly_target.toLocaleString()} monthly target secured.
          </p>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <button 
              onClick={() => { onClose(); triggerConfetti(); }}
              className="btn-primary"
            >
              Back to Dashboard <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < wrappedSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="wrapped-slideshow-overlay" style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      <div className="wrapped-card">
        <div className="wrapped-glow"></div>
        
        {/* Slide Header */}
        <div className="wrapped-card-header">
          <div>
            <span>{wrappedSlides[currentSlide].title}</span>
            <h2>{wrappedSlides[currentSlide].subtitle}</h2>
          </div>
          <button 
            onClick={onClose}
            className="modal-close-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Progress Bar Indicator */}
        <div className="wrapped-progress-bar">
          {wrappedSlides.map((_, idx) => (
            <div 
              key={idx}
              className="wrapped-progress-tick"
            >
              <div 
                className="wrapped-progress-tick-fill"
                style={{ width: idx < currentSlide ? '100%' : idx === currentSlide ? '100%' : '0%' }}
              ></div>
            </div>
          ))}
        </div>

        {/* Slide content container */}
        <div className="wrapped-card-body">
          {wrappedSlides[currentSlide].content}
        </div>

        {/* Slide Navigation footer */}
        <div className="wrapped-slideshow-footer">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="btn-secondary"
            style={{padding: '0.5rem 1rem', opacity: currentSlide === 0 ? 0.3 : 1}}
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          <span className="wrapped-slide-count">
            Slide {currentSlide + 1} of {wrappedSlides.length}
          </span>

          {currentSlide < wrappedSlides.length - 1 ? (
            <button
              onClick={nextSlide}
              className="btn-primary"
              style={{padding: '0.5rem 1rem'}}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => { onClose(); triggerConfetti(); }}
              className="btn-primary"
              style={{padding: '0.5rem 1rem'}}
            >
              Finish ✨
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
