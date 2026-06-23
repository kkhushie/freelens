'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, Users, Sparkles, Plus } from 'lucide-react';

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const monthNames = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
  '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
};

export default function OverviewTab({
  projects,
  clients,
  goals,
  triggerConfetti,
  onShowGoalSettings,
  onShowAddProject,
  onShowAddClient
}) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const getMonthOptions = () => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthVal = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value: monthVal, label });
    }
    return options;
  };

  const getMonthLabel = (monthVal) => {
    const [year, month] = monthVal.split('-');
    const d = new Date(Number(year), Number(month) - 1, 1);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Calculations for selected month
  const selectedMonthProjects = projects.filter(p => p.date.startsWith(selectedMonth));
  const completedSelectedMonthProjects = selectedMonthProjects.filter(p => p.status === 'Completed');

  const totalEarningsMonth = completedSelectedMonthProjects.reduce((sum, p) => sum + p.amount, 0);
  const totalProjectsCompletedMonth = completedSelectedMonthProjects.length;
  const avgProjectValueMonth = totalProjectsCompletedMonth > 0 ? Math.round(totalEarningsMonth / totalProjectsCompletedMonth) : 0;
  
  // active clients are those who had work logged or paid in this month
  const activeClientsMonthCount = new Set(selectedMonthProjects.map(p => p.client.toLowerCase())).size;

  const goalProgressPercentage = goals.monthly_target > 0 
    ? Math.min(Math.round((totalEarningsMonth / goals.monthly_target) * 100), 100) 
    : 0;

  // Generate 53 weeks of contribution heatmap data ending on Sunday of current week
  const getHeatmapGrid = () => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const daysToSunday = (7 - day) % 7;
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysToSunday);
    const dates = [];

    for (let i = 370; i >= 0; i--) {
      const d = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - i);
      const dateStr = getLocalDateString(d);
      
      const dayEarnings = projects
        .filter(p => p.date === dateStr && p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0);

      const dayCount = projects.filter(p => p.date === dateStr && p.status === 'Completed').length;

      let level = 0;
      if (dayEarnings > 0 && dayEarnings <= 3000) level = 1;
      else if (dayEarnings > 3000 && dayEarnings <= 7000) level = 2;
      else if (dayEarnings > 7000 && dayEarnings <= 12000) level = 3;
      else if (dayEarnings > 12000) level = 4;

      dates.push({
        date: dateStr,
        displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        earnings: dayEarnings,
        count: dayCount,
        level
      });
    }

    const grid = [];
    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        week.push(dates[w * 7 + d]);
      }
      grid.push(week);
    }
    return grid;
  };

  const getMonthHeaders = (grid) => {
    const headers = [];
    let lastMonth = '';
    let lastLabelWIdx = -10;

    grid.forEach((week, wIdx) => {
      const monthStr = week[0].date.slice(5, 7);
      if (monthStr !== lastMonth) {
        if (wIdx - lastLabelWIdx >= 3) {
          headers.push({
            wIdx,
            label: monthNames[monthStr]
          });
          lastLabelWIdx = wIdx;
        }
        lastMonth = monthStr;
      }
    });

    return headers;
  };

  const heatmapGrid = getHeatmapGrid();

  return (
    <div className="animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
      {/* Performance Dashboard Header with selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, fontFamily: 'var(--font-outfit)', color: 'var(--text-primary)' }}>
            Performance Dashboard
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
            Telemetry logs for creative income and deliverables
          </p>
        </div>
        
        {/* Month Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Inspect Month:
          </label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '8.5rem', padding: '0.45rem 1.5rem 0.45rem 0.75rem', fontSize: '0.75rem', height: '2.1rem' }}
          >
            {getMonthOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Metrics Cards Row */}
      <div className="stats-grid">
        <div className="glass-card">
          <span className="stat-card-label">Total Earnings</span>
          <span className="stat-card-value lime-text">
            ₹{totalEarningsMonth.toLocaleString()}
          </span>
          <div className="stat-card-trend trend-up">
            <TrendingUp className="w-3.5 h-3.5" /> +15.4% vs last month
          </div>
        </div>

        <div className="glass-card">
          <span className="stat-card-label">Projects Completed</span>
          <span className="stat-card-value">
            {totalProjectsCompletedMonth}
          </span>
          <div className="stat-card-trend trend-up">
            <CheckCircle className="w-3.5 h-3.5" /> 100% Delivery rate
          </div>
        </div>

        <div className="glass-card">
          <span className="stat-card-label">Active Clients</span>
          <span className="stat-card-value">
            {activeClientsMonthCount}
          </span>
          <div className="stat-card-trend trend-neutral">
            <Users className="w-3.5 h-3.5" style={{marginRight: '0.15rem'}} /> Inspecting monthly contacts
          </div>
        </div>

        <div className="glass-card">
          <span className="stat-card-label">Avg Project Value</span>
          <span className="stat-card-value lime-text">
            ₹{avgProjectValueMonth.toLocaleString()}
          </span>
          <div className="stat-card-trend trend-neutral">
            <Sparkles className="w-3.5 h-3.5" style={{color: 'var(--accent-lime)', marginRight: '0.15rem'}} /> Premium pricing
          </div>
        </div>
      </div>

      {/* Hero section: Fitness Rings Progress Card & Quick Actions */}
      <div className="hero-row">
        {/* Goal Rings Card */}
        <div className="glass-card accent-card">
          <div className="goal-card-wrapper">
            <div className="goal-card-info">
              <span className="goal-card-tag">
                Retainer Goal
              </span>
              <h2 className="goal-card-title">
                Monthly Target Revenue
              </h2>
              <p className="goal-card-desc">
                Track progress toward your monthly retainer targets. Completed deliverables are automatically aggregated in this target tracker ring.
              </p>
              
              <div className="goal-card-stats">
                <div className="goal-stat-box">
                  <span className="goal-stat-label">Current</span>
                  <span className="goal-stat-val lime-text">₹{totalEarningsMonth.toLocaleString()}</span>
                </div>
                <div className="goal-stat-divider"></div>
                <div className="goal-stat-box">
                  <span className="goal-stat-label">Target</span>
                  <span className="goal-stat-val">₹{goals.monthly_target.toLocaleString()}</span>
                </div>
                <button 
                  onClick={onShowGoalSettings}
                  className="btn-secondary"
                  style={{padding: '0.4rem 0.85rem', fontSize: '0.7rem', borderRadius: '8px'}}
                >
                  Modify Target
                </button>
              </div>
            </div>

            {/* SVG Circular Progress Ring */}
            <div className="goal-ring-container">
              <svg style={{width: '100%', height: '100%', transform: 'rotate(-90deg)'}}>
                <circle 
                  cx="80" 
                  cy="80" 
                  r="64" 
                  stroke="rgba(255, 255, 255, 0.03)" 
                  strokeWidth="12" 
                  fill="transparent"
                />
                <motion.circle 
                  cx="80" 
                  cy="80" 
                  r="64" 
                  stroke="url(#limeGradient)" 
                  strokeWidth="12" 
                  strokeDasharray={2 * Math.PI * 64}
                  strokeDashoffset={2 * Math.PI * 64 * (1 - goalProgressPercentage / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - goalProgressPercentage / 100) }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="limeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#80F474" />
                    <stop offset="100%" stopColor="#39D353" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="goal-ring-label">
                <span className="goal-ring-percent">{goalProgressPercentage}%</span>
                <span className="goal-ring-subtext">COMPLETED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Side Panel */}
        <div className="glass-card side-card">
          <div>
            <h3 className="side-card-title">
              <Sparkles className="w-4 h-4" style={{color: 'var(--accent-lime)'}} /> Revenue Insights
            </h3>
            <p className="side-card-desc">
              Your monthly yield is up <strong>15%</strong>. Register clients or log tasks below. Toggle deliverables in Timeline tab to completed to update stats.
            </p>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1rem'}}>
            <button 
              onClick={onShowAddProject}
              className="btn-primary w-full"
            >
              <Plus className="w-4 h-4" /> Track Deliverable
            </button>
            <button 
              onClick={onShowAddClient}
              className="btn-secondary w-full"
            >
              <Users className="w-4 h-4" /> Register Client
            </button>
          </div>
        </div>
      </div>

      {/* Daily Contribution Heatmap Card */}
      <div className="glass-card heatmap-card">
        <div>
          <h3 style={{fontSize: '1.1rem', color: 'var(--text-primary)'}}>Daily Creative Output</h3>
          <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem'}}>Contribution calendar mapping project deliveries (last 53 weeks)</p>
        </div>
        
        <div className="heatmap-container" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginTop: '1.25rem' }}>
          <div className="heatmap-day-labels" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '18px' }}>
            <span style={{ fontSize: '9px', height: '10px', lineHeight: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Mon</span>
            <span style={{ fontSize: '9px', height: '10px', lineHeight: '10px', visibility: 'hidden' }}>Tue</span>
            <span style={{ fontSize: '9px', height: '10px', lineHeight: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Wed</span>
            <span style={{ fontSize: '9px', height: '10px', lineHeight: '10px', visibility: 'hidden' }}>Thu</span>
            <span style={{ fontSize: '9px', height: '10px', lineHeight: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Fri</span>
            <span style={{ fontSize: '9px', height: '10px', lineHeight: '10px', visibility: 'hidden' }}>Sat</span>
            <span style={{ fontSize: '9px', height: '10px', lineHeight: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Sun</span>
          </div>
          
          <div className="heatmap-scroll-area" style={{ overflowX: 'auto', display: 'flex', flexDirection: 'column', flexGrow: 1, paddingBottom: '0.5rem', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}>
            {/* Heatmap Grid */}
            <div className="heatmap-grid" style={{ display: 'flex', gap: '4px', overflowX: 'visible' }}>
              {heatmapGrid.map((week, wIdx) => {
                const isNewMonth = wIdx > 0 && (week[0].date.slice(5, 7) !== heatmapGrid[wIdx - 1][0].date.slice(5, 7));
                const monthHeaders = getMonthHeaders(heatmapGrid);
                const hasMonthHeader = monthHeaders.some(h => h.wIdx === wIdx);
                const monthLabel = hasMonthHeader ? monthNames[week[0].date.slice(5, 7)] : '';
                return (
                  <div 
                    key={wIdx} 
                    className="heatmap-column" 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '4px',
                      marginLeft: wIdx > 0 && isNewMonth ? '8px' : '0px'
                    }}
                  >
                    <div style={{ height: '14px', fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600, position: 'relative' }}>
                      {(isNewMonth || wIdx === 0) && hasMonthHeader ? (
                        <span style={{ position: 'absolute', left: 0, bottom: 0, whiteSpace: 'nowrap' }}>
                          {monthLabel}
                        </span>
                      ) : null}
                    </div>
                    {week.map((day, dIdx) => (
                      <div
                        key={dIdx}
                        className={`heatmap-cell level-${day.level}`}
                        title={`${day.count} project${day.count !== 1 ? 's' : ''} (₹${day.earnings.toLocaleString()}) on ${day.displayDate}`}
                        onClick={() => triggerConfetti()}
                      ></div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="heatmap-legend-cell level-0"></div>
          <div className="heatmap-legend-cell level-1"></div>
          <div className="heatmap-legend-cell level-2"></div>
          <div className="heatmap-legend-cell level-3"></div>
          <div className="heatmap-legend-cell level-4"></div>
          <span>More</span>
        </div>
      </div>

      {/* SVG Revenue Sparkline Timeline */}
      <div className="glass-card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <div>
            <h3 style={{fontSize: '1.1rem', color: 'var(--text-primary)'}}>Earnings Timeline</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem'}}>Earnings profile visualizer for the last 7 project completions</p>
          </div>
          <span className="badge success">Q2 2026</span>
        </div>

        <div style={{height: '12rem', width: '100%', position: 'relative', paddingTop: '1rem'}}>
          <svg style={{width: '100%', height: '100%'}} viewBox="0 0 700 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#80F474" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#80F474" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path 
              d="M 20 120 Q 120 40 220 90 T 420 50 T 620 20 L 620 140 L 20 140 Z" 
              fill="url(#chartGradient)"
            />
            <path 
              d="M 20 120 Q 120 40 220 90 T 420 50 T 620 20" 
              fill="none" 
              stroke="#80F474" 
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="20" cy="120" r="4.5" fill="#111418" stroke="#80F474" strokeWidth="2" />
            <circle cx="120" cy="40" r="4.5" fill="#111418" stroke="#80F474" strokeWidth="2" />
            <circle cx="220" cy="90" r="4.5" fill="#111418" stroke="#80F474" strokeWidth="2" />
            <circle cx="320" cy="70" r="4.5" fill="#111418" stroke="#80F474" strokeWidth="2" />
            <circle cx="420" cy="50" r="4.5" fill="#111418" stroke="#80F474" strokeWidth="2" />
            <circle cx="520" cy="35" r="4.5" fill="#111418" stroke="#80F474" strokeWidth="2" />
            <circle cx="620" cy="20" r="4.5" fill="#111418" stroke="#80F474" strokeWidth="2" />
          </svg>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginTop: '0.5rem', padding: '0 1rem'}}>
            <span>PROJECT 1</span>
            <span>PROJECT 2</span>
            <span>PROJECT 3</span>
            <span>PROJECT 4</span>
            <span>PROJECT 5</span>
            <span>PROJECT 6</span>
            <span>PROJECT 7</span>
          </div>
        </div>
      </div>

      {/* Completed Deliverables in Selected Month */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Deliverables Logged ({getMonthLabel(selectedMonth)})
        </h3>
        
        {completedSelectedMonthProjects.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {completedSelectedMonthProjects.map((project) => (
              <div 
                key={project.id} 
                className="timeline-item"
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '1rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>
                    {project.category === 'Video Editing' ? '🎬' : project.category === 'Motion Design' ? '✨' : '🎨'}
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{project.name}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{project.client} • {project.category}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-lime)' }}>
                    +₹{project.amount.toLocaleString()}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {new Date(project.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              No completed deliverables found in this month.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
