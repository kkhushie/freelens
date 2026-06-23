'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  Briefcase,
  Sparkles,
  Users,
  ArrowRight
} from 'lucide-react';

export default function RootPage() {
  const { user, loading } = useAuth();

  // Interactive Simulator State
  const [simTarget, setSimTarget] = useState(50000);
  
  // Calculate simulated values based on target slider
  const getSimulatedStats = (target) => {
    let viability = 'Optimized';
    let xpGain = '2.0x';
    let tierLevel = 'Rising Pro';
    let percentage = Math.min(Math.round((42800 / target) * 100), 100);

    if (target > 90000) {
      viability = 'Apex';
      xpGain = '3.5x';
      tierLevel = 'Apex Studio';
    } else if (target > 50000) {
      viability = 'Accelerated';
      xpGain = '2.5x';
      tierLevel = 'Retainer King';
    }
    
    return { viability, xpGain, tierLevel, percentage };
  };

  const { viability, xpGain, tierLevel, percentage } = getSimulatedStats(simTarget);

  if (loading) {
    return (
      <div className="auth-screen">
        <div style={{position: 'relative', width: '5rem', height: '5rem'}}>
          <div style={{position: 'absolute', inset: 0, border: '4px solid rgba(128, 244, 116, 0.1)', borderRadius: '50%'}}></div>
          <div style={{position: 'absolute', inset: 0, border: '4px solid transparent', borderTopColor: 'var(--accent-lime)', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
        </div>
        <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '1.25rem', fontFamily: 'var(--font-outfit)', letterSpacing: '0.1em'}}>LOADING FREELENS...</p>
        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="landing-container animate-fade-in">
      {/* Navigation Bar */}
      <nav className="landing-navbar">
        <Link href="/" className="landing-logo">
          <span className="sidebar-logo-icon">FL</span>
          Freelens
        </Link>
        <div className="landing-nav-links">
          <Link href="#features" className="landing-nav-link">
            Features
          </Link>
          <Link href="#pricing" className="landing-nav-link">
            Simulate
          </Link>
          <Link href="#leaderboard" className="landing-nav-link">
            Leaderboard
          </Link>
          {user ? (
            <Link href="/dashboard/overview" className="btn-lime">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/signup" className="btn-lime">
              Start Free
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="hero-text-content">
          <div className="hero-badge-mock">
            📈 VISUAL TELEMETRY FOR CREATIVE FREELANCERS
          </div>
          <h1 className="hero-title-mock">
            YOUR CREATIVE REVENUE,<br />
            <span>FULLY VISUALIZED</span>
          </h1>
          <p className="hero-desc-mock">
            Freelens replaces dry spreadsheets with a high-fidelity visual dashboard designed for video editors, motion creators, and designers. Track your active retainers, monitor monthly targets, and see exactly where your revenue comes from.
          </p>

          <div className="hero-cta-buttons">
            {user ? (
              <Link href="/dashboard/overview" className="btn-lime">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/signup" className="btn-lime">
                  Start Tracking For Free
                </Link>
                <Link href="#features" className="btn-dark-outline">
                  Explore Features
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 3D Angled Preview Panel */}
        <div className="hero-mockup-3d-scene">
          <div className="hero-mockup-3d-card">
            <div className="card-top-header">
              <span className="mono-label">MATRIX DEPLOYED</span>
              <div className="active-dot-wrapper">
                <span className="active-dot"></span>
                <span className="mono-label-lime">ONLINE</span>
              </div>
            </div>

            <div className="mockup-circular-section">
              <div className="mockup-big-ring">
                <svg style={{transform: 'rotate(-90deg)', width: '150px', height: '150px'}}>
                  <circle cx="75" cy="75" r="60" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                  <circle cx="75" cy="75" r="60" stroke="#A3FF12" strokeWidth="8" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60 * (1 - 0.86)} strokeLinecap="round" fill="transparent" />
                </svg>
                <div className="sim-circle-inner-text">
                  <span className="mockup-ring-percentage">86%</span>
                  <span className="mockup-ring-subtext">TARGET SECURED</span>
                </div>
              </div>
            </div>

            <div className="mockup-chart-bars">
              <div className="mockup-bar" style={{height: '35%'}}></div>
              <div className="mockup-bar" style={{height: '55%'}}></div>
              <div className="mockup-bar" style={{height: '45%'}}></div>
              <div className="mockup-bar active" style={{height: '80%'}}></div>
              <div className="mockup-bar" style={{height: '50%'}}></div>
              <div className="mockup-bar" style={{height: '30%'}}></div>
            </div>

            <div className="mockup-footer-badge">
              <span className="mono-label-lime">TIER: ELITE PRO</span>
              <span className="mono-label">REVENUE: ₹1,42,800</span>
            </div>
          </div>
        </div>
      </header>

      {/* The Arsenal (Features Section) */}
      <section id="features" className="landing-features-arsenal">
        <div className="arsenal-header">
          <div>
            <div className="mono-label-lime" style={{marginBottom: '0.5rem'}}>THE GIG MATRIX</div>
            <h2 className="arsenal-title">THE ARSENAL</h2>
          </div>
          <div className="mono-label">[ SYSTEM LOADED: 3 TOOLS ]</div>
        </div>

        <div className="arsenal-grid">
          <div className="arsenal-card">
            <div className="arsenal-card-icon-box">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="arsenal-card-title">Retainer Trackers</h3>
            <p className="arsenal-card-desc">
              Log active clients, invoice amounts, and monthly revenue targets. Watch your goal progress rings fill up dynamically as you complete deliverables.
            </p>
            {user ? (
              <Link href="/dashboard/overview" className="arsenal-card-link">
                EXPLORE MODULE →
              </Link>
            ) : (
              <Link href="/signup" className="arsenal-card-link">
                EXPLORE MODULE →
              </Link>
            )}
          </div>

          <div className="arsenal-card">
            <div className="arsenal-card-icon-box">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="arsenal-card-title">Project Recaps</h3>
            <p className="arsenal-card-desc">
              Generate cinematic, shareable data slideshows at the end of each month. Showcase your total revenue output, MVP clients, and unlocked career milestones in seconds.
            </p>
            {user ? (
              <Link href="/dashboard/wrapped" className="arsenal-card-link">
                GENERATE RECAP →
              </Link>
            ) : (
              <Link href="/signup" className="arsenal-card-link">
                GENERATE RECAP →
              </Link>
            )}
          </div>

          <div className="arsenal-card">
            <div className="arsenal-card-icon-box">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="arsenal-card-title">Client Revenue Arenas</h3>
            <p className="arsenal-card-desc">
              Visualize your primary partnerships. Rank client contributions automatically based on project volume and revenue yield to double down on high-value retainers.
            </p>
            {user ? (
              <Link href="/dashboard/leaderboard" className="arsenal-card-link">
                ENTER THE ARENA →
              </Link>
            ) : (
              <Link href="/signup" className="arsenal-card-link">
                ENTER THE ARENA →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section id="pricing" className="landing-simulator-section">
        <div className="sim-container">
          {/* Left Preview Card */}
          <div className="sim-preview-panel">
            <div className="sim-preview-card">
              <svg style={{transform: 'rotate(-90deg)', width: '220px', height: '220px'}}>
                <circle cx="110" cy="110" r="90" stroke="rgba(255,255,255,0.03)" strokeWidth="10" fill="transparent" />
                <circle cx="110" cy="110" r="90" stroke="#A3FF12" strokeWidth="10" strokeDasharray={2 * Math.PI * 90} strokeDashoffset={2 * Math.PI * 90 * (1 - percentage / 100)} strokeLinecap="round" fill="transparent" />
              </svg>
              <div className="sim-circle-inner-text">
                <span className="sim-amount-value">₹{simTarget.toLocaleString()}</span>
                <span className="sim-amount-sub">EST TO BE SECURED</span>
              </div>
            </div>
          </div>

          {/* Right Inputs Card */}
          <div className="sim-text-content">
            <div className="mono-label-lime" style={{marginBottom: '0.5rem'}}>EARNINGS MATRIX SIMULATOR</div>
            <h2 className="sim-title-mock">SIMULATE YOUR REVENUE</h2>
            <p className="sim-desc-mock">
              Set your target monthly income and see your simulated progress, viability rating, and milestone thresholds update in real-time.
            </p>

            <div className="sim-dashboard-control-card">
              <div className="sim-control-header">
                <span className="sim-control-title">Monthly Income Goal</span>
                <span className="sim-control-amount">₹{simTarget.toLocaleString()}</span>
              </div>
              
              <input 
                type="range"
                min="10000"
                max="150000"
                step="5000"
                value={simTarget}
                onChange={(e) => setSimTarget(Number(e.target.value))}
                className="sim-slider-range"
              />

              <div className="sim-mini-stats-grid">
                <div className="sim-stat-box-mock">
                  <span className="mono-label" style={{fontSize: '0.55rem', letterSpacing: '0.08em'}}>GOAL VIABILITY</span>
                  <span className="sim-stat-box-val-mock">{viability}</span>
                </div>
                <div className="sim-stat-box-mock">
                  <span className="mono-label" style={{fontSize: '0.55rem', letterSpacing: '0.08em'}}>REVENUE MULTIPLIER</span>
                  <span className="sim-stat-box-val-mock lime-text">{xpGain}</span>
                </div>
                <div className="sim-stat-box-mock">
                  <span className="mono-label" style={{fontSize: '0.55rem', letterSpacing: '0.08em'}}>TIER THRESHOLD</span>
                  <span className="sim-stat-box-val-mock">{tierLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Deploy section */}
      <section className="landing-deploy-section">
        <div className="deploy-banner-card">
          <h2 className="deploy-title">READY TO TRACK RETAINERS?</h2>
          <p className="deploy-desc">
            Reclaim your time and get full visibility into your monthly client income. Stop fighting with spreadsheet formulas and start managing your freelance business with a dedicated cockpit.
          </p>
          {user ? (
            <Link href="/dashboard/overview" className="btn-lime">
              START TRACKING FOR FREE
            </Link>
          ) : (
            <Link href="/signup" className="btn-lime">
              START TRACKING FOR FREE
            </Link>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="landing-footer-container">
        <div className="footer-inner">
          <div className="footer-logo-group">
            <span className="footer-logo-text">FREELENS</span>
            <div className="footer-links-grid">
              <Link href="#" className="footer-link-mock">Terms of Service</Link>
              <Link href="#" className="footer-link-mock">Privacy Protocol</Link>
              <Link href="#" className="footer-link-mock">API Docs</Link>
              <Link href="#" className="footer-link-mock">System Status</Link>
            </div>
          </div>
          <span className="footer-copyright-mock">
            © 2026 FREELENS. THE ULTIMATE PROGRESSION HUB FOR CREATORS.
          </span>
        </div>
      </footer>
    </div>
  );
}
