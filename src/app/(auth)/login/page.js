'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { user, signIn, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('creator@freelens.co');
  const [password, setPassword] = useState('password123');
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
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message || 'Invalid email or password.');
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
            {btnLoading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="auth-footer">
          <Link href="/signup" className="auth-footer-toggle">
            {"Don't have an account? Sign up"}
          </Link>
        </div>
        
        <div className="auth-demo-tag">
          <p>Demo Credentials Pre-filled. Click Access Dashboard to enter.</p>
        </div>
      </motion.div>
    </div>
  );
}
