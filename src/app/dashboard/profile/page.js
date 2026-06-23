'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Image as ImageIcon, Save, Sparkles } from 'lucide-react';

const PRESET_AVATARS = [
  {
    name: 'Video Editor',
    url: 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?auto=format&fit=crop&w=150&h=150&q=80',
    emoji: '🎥'
  },
  {
    name: '3D Artist',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80',
    emoji: '🎨'
  },
  {
    name: 'Motion Creator',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    emoji: '🎬'
  },
  {
    name: 'Tech Pro',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    emoji: '💻'
  }
];

export default function ProfileSettingsPage() {
  const { user, updateProfile } = useAuth();
  
  const [username, setUsername] = useState(user?.user_metadata?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsSaving(true);
    await updateProfile(username.trim(), avatarUrl.trim());
    setIsSaving(false);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
      <div className="glass-card profile-card-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-lime)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-outfit)', textTransform: 'uppercase' }}>
            Modify Profile
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Avatar Preview Section */}
          <div className="profile-avatar-preview-box">
            <div style={{ position: 'relative', width: '5.5rem', height: '5.5rem', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-lime)', flexShrink: 0, backgroundColor: 'rgba(0,0,0,0.2)' }}>
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80';
                  }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'var(--text-secondary)' }}>
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600 }}>Avatar Live Preview</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Your avatar will update instantly across the sidebar, timeline, and mobile hubs.
              </p>
            </div>
          </div>

          {/* Form Input: Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-secondary)' }}>
              Display Username
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User 
                className="w-4 h-4" 
                style={{ position: 'absolute', left: '1rem', color: 'var(--text-secondary)' }} 
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-lime)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          </div>

          {/* Form Input: Avatar URL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-secondary)' }}>
              Profile Image URL
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ImageIcon 
                className="w-4 h-4" 
                style={{ position: 'absolute', left: '1rem', color: 'var(--text-secondary)' }} 
              />
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-lime)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          </div>

          {/* Preset Avatar Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-secondary)' }}>
              Quick Preset Avatars
            </span>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {PRESET_AVATARS.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAvatarUrl(preset.url)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: avatarUrl === preset.url ? 'rgba(163, 255, 18, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: avatarUrl === preset.url ? '1px solid var(--accent-lime)' : '1px solid rgba(255,255,255,0.05)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '20px',
                    color: 'var(--text-primary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{preset.emoji}</span>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={isSaving || !username.trim()}
              className="btn-lime"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: isSaving || !username.trim() ? 0.6 : 1,
                cursor: isSaving || !username.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
