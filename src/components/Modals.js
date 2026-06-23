'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Goal, X, Users, Briefcase, Image as ImageIcon } from 'lucide-react';

const CLIENT_PRESET_AVATARS = [
  {
    name: 'Tech Logo',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80',
    emoji: '🔵'
  },
  {
    name: 'Creative Logo',
    url: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=80&h=80&q=80',
    emoji: '🟢'
  },
  {
    name: 'Studio Logo',
    url: 'https://images.unsplash.com/photo-1618005198143-d5a803e5c9f7?auto=format&fit=crop&w=80&h=80&q=80',
    emoji: '🟣'
  },
  {
    name: 'Agency Logo',
    url: 'https://images.unsplash.com/photo-1618005198140-5e581c7ffcb9?auto=format&fit=crop&w=80&h=80&q=80',
    emoji: '🟠'
  }
];

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function GoalSettingsModal({ isOpen, onClose, currentTarget, onUpdateGoal }) {
  const [goalAmount, setGoalAmount] = useState('');

  useEffect(() => {
    if (currentTarget) {
      setGoalAmount(currentTarget.toString());
    }
  }, [currentTarget]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goalAmount || isNaN(Number(goalAmount))) return;
    onUpdateGoal(Number(goalAmount));
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="modal-content"
      >
        <div className="modal-header">
          <h3 className="modal-title">
            <Goal className="w-4.5 h-4.5" style={{color: 'var(--accent-lime)', marginRight: '0.25rem'}} /> Change Goal Target
          </h3>
          <button 
            onClick={onClose}
            className="modal-close-btn"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field-group">
            <label>Monthly Retainer Target (₹)</label>
            <input
              type="number"
              required
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              className="input-field"
              placeholder="e.g. 50000"
            />
          </div>

          <div className="modal-actions-footer">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              Save Target
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function AddClientModal({ isOpen, onClose, onAddClient, clients }) {
  const [newClientName, setNewClientName] = useState('');
  const [newClientAvatar, setNewClientAvatar] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newClientName) return;
    onAddClient(newClientName, newClientAvatar);
    setNewClientName('');
    setNewClientAvatar('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80');
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="modal-content"
      >
        <div className="modal-header">
          <h3 className="modal-title">
            <Users className="w-4.5 h-4.5" style={{color: 'var(--accent-lime)', marginRight: '0.25rem'}} /> Register Client
          </h3>
          <button 
            onClick={onClose}
            className="modal-close-btn"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field-group">
            <label>Client / Brand Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Studio"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', width: '3rem', height: '3rem', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--accent-lime)', flexShrink: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {newClientAvatar && newClientAvatar.startsWith('http') ? (
                <img 
                  src={newClientAvatar} 
                  alt="Client Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  {newClientName ? newClientName.slice(0, 2).toUpperCase() : 'CL'}
                </span>
              )}
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }}>Client Profile Preview</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>
                Use a preset color pattern or custom URL.
              </p>
            </div>
          </div>

          <div className="form-field-group">
            <label>Client Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/logo.jpg"
              value={newClientAvatar}
              onChange={(e) => setNewClientAvatar(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-field-group">
            <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Preset Colors</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
              {CLIENT_PRESET_AVATARS.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setNewClientAvatar(preset.url)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: newClientAvatar === preset.url ? 'rgba(163, 255, 18, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: newClientAvatar === preset.url ? '1px solid var(--accent-lime)' : '1px solid rgba(255,255,255,0.05)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.7rem',
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

          <div className="modal-actions-footer" style={{ marginTop: '1.5rem' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              Register Client
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function AddProjectModal({ isOpen, onClose, onAddProject, clients }) {
  const [projectName, setProjectName] = useState('');
  const [projectAmount, setProjectAmount] = useState('');
  const [projectClient, setProjectClient] = useState('');
  const [projectCategory, setProjectCategory] = useState('Video Editing');
  const [projectDate, setProjectDate] = useState('');
  const [projectStatus, setProjectStatus] = useState('Completed');

  useEffect(() => {
    if (isOpen) {
      setProjectDate(getLocalDateString());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName || !projectAmount || !projectClient) return;

    onAddProject({
      name: projectName,
      amount: parseFloat(projectAmount),
      client: projectClient,
      category: projectCategory,
      date: projectDate,
      status: projectStatus
    });

    setProjectName('');
    setProjectAmount('');
    setProjectClient('');
    setProjectCategory('Video Editing');
    setProjectStatus('Completed');
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="modal-content"
      >
        <div className="modal-header">
          <h3 className="modal-title">
            <Briefcase className="w-4.5 h-4.5" style={{color: 'var(--accent-lime)', marginRight: '0.25rem'}} /> Track New Deliverable
          </h3>
          <button 
            onClick={onClose}
            className="modal-close-btn"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field-group">
            <label>Deliverable / Asset Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Podcast Edit - Episode 13"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-field-group">
              <label>Earnings (₹)</label>
              <input
                type="number"
                required
                placeholder="e.g. 3500"
                value={projectAmount}
                onChange={(e) => setProjectAmount(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-field-group">
              <label>Date Delivered</label>
              <input
                type="date"
                required
                value={projectDate}
                onChange={(e) => setProjectDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field-group">
              <label>Client Name</label>
              <input
                type="text"
                required
                placeholder="Type to find or create client..."
                value={projectClient}
                onChange={(e) => setProjectClient(e.target.value)}
                className="input-field"
                list="client-suggestions"
              />
              <datalist id="client-suggestions">
                {clients.map(c => <option key={c.id} value={c.name} />)}
              </datalist>
            </div>

            <div className="form-field-group">
              <label>Category</label>
              <select
                value={projectCategory}
                onChange={(e) => setProjectCategory(e.target.value)}
                className="input-field"
              >
                <option value="Video Editing">🎬 Video Editing</option>
                <option value="Motion Design">✨ Motion Design</option>
                <option value="Thumbnails">🎨 Thumbnails</option>
              </select>
            </div>
          </div>

          <div className="form-field-group">
            <label>Status</label>
            <select
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              className="input-field"
            >
              <option value="Completed">Done (Adds directly to earnings)</option>
              <option value="Pending">Pending (Adds to pipeline only)</option>
            </select>
          </div>

          <div className="modal-actions-footer">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              Publish Deliverable
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function EditClientModal({ isOpen, onClose, client, onUpdateClient }) {
  const [clientName, setClientName] = useState('');
  const [clientAvatar, setClientAvatar] = useState('');

  useEffect(() => {
    if (client) {
      setClientName(client.name);
      setClientAvatar(client.avatar || '');
    }
  }, [client]);

  if (!isOpen || !client) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    onUpdateClient(client.id, clientName.trim(), clientAvatar);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="modal-content"
      >
        <div className="modal-header">
          <h3 className="modal-title">
            <Users className="w-4.5 h-4.5" style={{color: 'var(--accent-lime)', marginRight: '0.25rem'}} /> Update Client
          </h3>
          <button 
            onClick={onClose}
            className="modal-close-btn"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field-group">
            <label>Client / Brand Name</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', width: '3rem', height: '3rem', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--accent-lime)', flexShrink: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {clientAvatar && clientAvatar.startsWith('http') ? (
                <img 
                  src={clientAvatar} 
                  alt="Client Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  {clientName ? clientName.slice(0, 2).toUpperCase() : 'CL'}
                </span>
              )}
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }}>Client Profile Preview</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>
                Use a preset color pattern or custom URL.
              </p>
            </div>
          </div>

          <div className="form-field-group">
            <label>Client Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/logo.jpg"
              value={clientAvatar}
              onChange={(e) => setClientAvatar(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-field-group">
            <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Preset Colors</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
              {CLIENT_PRESET_AVATARS.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setClientAvatar(preset.url)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: clientAvatar === preset.url ? 'rgba(163, 255, 18, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: clientAvatar === preset.url ? '1px solid var(--accent-lime)' : '1px solid rgba(255,255,255,0.05)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.7rem',
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

          <div className="modal-actions-footer" style={{ marginTop: '1.5rem' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
