'use client';

import React from 'react';

export default function AchievementsTab({ achievements }) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      {/* Overview Card */}
      <div className="glass-card achievements-overview">
        <div className="achievements-overview-text">
          <h3>Career Milestones</h3>
          <p>Professional accomplishments unlocked by completing and billing freelance projects.</p>
        </div>
        <div className="achievements-ratio">
          <span className="achievements-ratio-numbers">
            {unlockedCount} / {totalCount}
          </span>
          <span className="achievements-ratio-label">Unlocked</span>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        {achievements.map((ach) => (
          <div 
            key={ach.id}
            className={`glass-card achievement-card ${ach.unlocked ? 'unlocked' : ''}`}
          >
            {/* Icon wrapper */}
            <div className="achievement-badge-icon">
              {ach.unlocked ? ach.icon : '🔒'}
            </div>

            {/* Content */}
            <div className="achievement-details">
              <h4 className="achievement-name">
                {ach.name}
              </h4>
              <p className="achievement-desc">
                {ach.desc}
              </p>
              {ach.unlocked && (
                <span className="achievement-unlocked-date">
                  Unlocked {ach.date}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
