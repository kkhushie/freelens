'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const { user, signUp, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('Khushal');
  const [role, setRole] = useState('Motion Designer & Video Creator');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  // If already authenticated, redirect to overview
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard/overview');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBtnLoading(true);

    try {
      const { error: signUpError } = await signUp(email, password, name, role);
      if (signUpError) {
        setError(signUpError.message || 'Failed to create account.');
      } else {
        router.push('/dashboard/overview');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-glow-top"></div>
      <div className="auth-glow-bottom"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="auth-card"
      >
        <div className="auth-logo-group">
          <div className="auth-logo">
            <span className="auth-logo-icon">FL</span>
            Freelens
          </div>
          <p>Creative Freelancer Portfolio & Goals Analytics</p>
        </div>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <div className="form-field-group">
            <label><User className="w-3.5 h-3.5" style={{marginRight: '0.25rem', verticalAlign: 'middle'}} /> Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="e.g. Khushal"
            />
          </div>

          <div className="form-field-group">
            <label><Briefcase className="w-3.5 h-3.5" style={{marginRight: '0.25rem', verticalAlign: 'middle'}} /> Creative Specialty</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
              placeholder="e.g. Video Editor / Motion Designer"
            />
          </div>

          <div className="form-field-group">
            <label><Mail className="w-3.5 h-3.5" style={{marginRight: '0.25rem', verticalAlign: 'middle'}} /> Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="creator@freelens.co"
            />
          </div>

          <div className="form-field-group">
            <label><Lock className="w-3.5 h-3.5" style={{marginRight: '0.25rem', verticalAlign: 'middle'}} /> Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={btnLoading}
            className="btn-primary w-full"
            style={{marginTop: '1rem', padding: '0.85rem'}}
          >
            {btnLoading ? 'Creating Account...' : 'Create Creator Account'}
          </button>
        </form>

        <div className="auth-footer">
          <Link href="/login" className="auth-footer-toggle">
            Already have an account? Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
