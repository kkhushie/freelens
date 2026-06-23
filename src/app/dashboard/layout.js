'use client';

import React, { useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Award,
  FolderGit,
  LogOut,
  Sparkles,
  User
} from 'lucide-react';
import { GoalSettingsModal, AddClientModal, AddProjectModal } from '@/components/Modals';

// Modals component wrapped in Suspense because it uses useSearchParams
function DashboardModals() {
  const { clients, goals, addProject, addClient, updateGoal } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const showAddProject = searchParams.get('new-project') === 'true';
  const showAddClient = searchParams.get('new-client') === 'true';
  const showGoalSettings = searchParams.get('goal-settings') === 'true';

  const closeModal = () => {
    router.push(pathname);
  };

  return (
    <>
      <GoalSettingsModal
        isOpen={showGoalSettings}
        onClose={closeModal}
        currentTarget={goals.monthly_target}
        onUpdateGoal={updateGoal}
      />

      <AddClientModal
        isOpen={showAddClient}
        onClose={closeModal}
        clients={clients}
        onAddClient={addClient}
      />

      <AddProjectModal
        isOpen={showAddProject}
        onClose={closeModal}
        clients={clients}
        onAddProject={addProject}
      />
    </>
  );
}

export default function DashboardLayout({ children }) {
  const {
    user,
    loading,
    dbError,
    isSupabaseConfigured,
    signOut
  } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="auth-screen" style={{ flexDirection: 'column' }}>
        <div style={{ position: 'relative', width: '5rem', height: '5rem' }}>
          <div style={{ position: 'absolute', inset: 0, border: '4px solid rgba(128, 244, 116, 0.1)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', inset: 0, border: '4px solid transparent', borderTopColor: 'var(--accent-lime)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '1.25rem', fontFamily: 'var(--font-outfit)', letterSpacing: '0.1em' }}>LOADING FREELENS...</p>
        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const getPageTitle = () => {
    if (pathname.includes('/overview')) {
      const name = user?.user_metadata?.full_name || 'Creative';
      const hours = new Date().getHours();
      let greeting = 'Welcome back';
      if (hours < 12) {
        greeting = 'Good morning';
      } else if (hours < 18) {
        greeting = 'Good afternoon';
      } else {
        greeting = 'Good evening';
      }
      return `${greeting}, ${name}!`;
    }
    if (pathname.includes('/timeline')) return 'Project Timeline';
    if (pathname.includes('/leaderboard')) return 'Client Leaderboard';
    if (pathname.includes('/achievements')) return 'Achievements System';
    if (pathname.includes('/wrapped')) return 'Freelens Wrapped';
    if (pathname.includes('/profile')) return 'Profile Settings';
    return 'Dashboard';
  };

  const getPageDescription = () => {
    if (pathname.includes('/profile')) return 'Update your display name and profile avatar';
    if (pathname.includes('/wrapped')) return 'Your accomplishments rendered cinematically';
    const monthName = new Date().toLocaleDateString('en-US', { month: 'long' });
    const year = new Date().getFullYear();
    return `${monthName} ${year} Cohort • Live updates`;
  };

  return (
    <div className="dashboard-container">
      {/* Side Navigation — Desktop */}
      <aside className="sidebar hidden lg:flex">
        <div className="sidebar-brand-group">
          {/* Logo */}
          <div>
            <Link href="/dashboard/overview" className="sidebar-logo">
              <span className="sidebar-logo-icon">FL</span>
              Freelens
            </Link>

            {/* Status indicator inside Sidebar */}
            <div style={{ marginTop: '0.5rem', paddingLeft: '0.15rem' }}>
              {isSupabaseConfigured ? (
                <div className="status-indicator supabase">
                  <span className="status-dot"></span>
                  <span>Live</span>
                </div>
              ) : (
                <div className="status-indicator sandbox">
                  <span className="status-dot"></span>
                  <span>Local</span>
                </div>
              )}
            </div>
          </div>

          {/* Nav Links */}
          <nav className="sidebar-nav">
            <Link
              href="/dashboard/overview"
              className={`nav-link ${pathname === '/dashboard/overview' ? 'active' : ''}`}
            >
              <LayoutDashboard className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              Overview
            </Link>
            <Link
              href="/dashboard/timeline"
              className={`nav-link ${pathname === '/dashboard/timeline' ? 'active' : ''}`}
            >
              <FolderGit className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              Timeline
            </Link>
            <Link
              href="/dashboard/leaderboard"
              className={`nav-link ${pathname === '/dashboard/leaderboard' ? 'active' : ''}`}
            >
              <TrendingUp className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              Leaderboard
            </Link>
            <Link
              href="/dashboard/achievements"
              className={`nav-link ${pathname === '/dashboard/achievements' ? 'active' : ''}`}
            >
              <Award className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              Achievements
            </Link>
            <Link
              href="/dashboard/wrapped"
              className={`nav-link ${pathname === '/dashboard/wrapped' ? 'active' : ''}`}
            >
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-lime)' }} />
              Freelens Wrapped
            </Link>
            <Link
              href="/dashboard/profile"
              className={`nav-link ${pathname === '/dashboard/profile' ? 'active' : ''}`}
            >
              <User className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              Profile Settings
            </Link>
          </nav>
        </div>

        {/* User profile footer */}
        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <img
              src={user.user_metadata?.avatar_url}
              alt={user.user_metadata?.full_name}
              className="sidebar-profile-avatar"
            />
            <div className="sidebar-profile-info">
              <span className="sidebar-profile-name">{user.user_metadata?.full_name}</span>
              <span className="sidebar-profile-role">{user.user_metadata?.role}</span>
            </div>
          </div>
          <button
            onClick={signOut}
            className="sidebar-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ display: 'inline' }}>
                {getPageTitle()}
              </h1>

              {/* Status indicator on Header */}
              {isSupabaseConfigured ? (
                <div className="status-indicator supabase">
                  <span className="status-dot"></span>
                  <span>Connected</span>
                </div>
              ) : (
                <div className="status-indicator sandbox">
                  <span className="status-dot"></span>
                  <span>Local Mode</span>
                </div>
              )}
            </div>

            <p>
              {getPageDescription()}
            </p>
          </div>

          <div className="header-mobile-actions">
            <Link href="/dashboard/profile">
              <img
                src={user.user_metadata?.avatar_url}
                alt={user.user_metadata?.full_name}
                className="header-mobile-avatar"
                style={{ cursor: 'pointer' }}
              />
            </Link>
            <button
              onClick={signOut}
              className="header-mobile-logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Database setup warning banner if tables missing */}
        {pathname === '/dashboard/overview' && dbError && (
          <div className="warning-banner animate-fade-in">
            <div className="warning-banner-icon">⚠️</div>
            <div className="warning-banner-text">
              <h4>Supabase Database Tables Missing</h4>
              <p>
                A connection to Supabase was detected, but some database tables (<code>projects</code>, <code>clients</code>, or <code>goals</code>) could not be queried. Please run the SQL schema queries in <a href="file:///c:/Projects/freelens/supabase_setup.md" style={{ color: '#EF4444', textDecoration: 'underline', fontWeight: 600 }}>supabase_setup.md</a> inside your Supabase dashboard SQL editor.
              </p>
            </div>
          </div>
        )}

        {/* Subpage Route Children */}
        {children}
      </main>

      {/* Route-based Dialog Modals wrapped in Suspense */}
      <Suspense fallback={null}>
        <DashboardModals />
      </Suspense>

      {/* Bottom Navigation Bar — Mobile Devices */}
      <div className="mobile-nav">
        <Link
          href="/dashboard/overview"
          className={`mobile-nav-link ${pathname === '/dashboard/overview' ? 'active' : ''}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Overview</span>
        </Link>
        <Link
          href="/dashboard/timeline"
          className={`mobile-nav-link ${pathname === '/dashboard/timeline' ? 'active' : ''}`}
        >
          <FolderGit className="w-5 h-5" />
          <span>Timeline</span>
        </Link>
        <Link
          href="/dashboard/leaderboard"
          className={`mobile-nav-link ${pathname === '/dashboard/leaderboard' ? 'active' : ''}`}
        >
          <TrendingUp className="w-5 h-5" />
          <span>Clients</span>
        </Link>
        <Link
          href="/dashboard/achievements"
          className={`mobile-nav-link ${pathname === '/dashboard/achievements' ? 'active' : ''}`}
        >
          <Award className="w-5 h-5" />
          <span>Badges</span>
        </Link>
        <Link
          href="/dashboard/wrapped"
          className={`mobile-nav-link ${pathname === '/dashboard/wrapped' ? 'active' : ''}`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Wrapped</span>
        </Link>
      </div>
    </div>
  );
}
