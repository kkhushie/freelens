'use client';

import React from 'react';
import { Plus, TrendingUp, Edit2, Trash2 } from 'lucide-react';

export default function LeaderboardTab({ clients, onShowAddClient, onEditClient, onDeleteClient }) {
  return (
    <div className="animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      {/* Header card */}
      <div className="glass-card accent-card leaderboard-intro-card">
        <div>
          <h3>Partnership Valuation</h3>
          <p>Ranking your active creative directors and agencies by net payout value.</p>
        </div>
        <button 
          onClick={onShowAddClient}
          className="btn-primary"
          style={{padding: '0.5rem 1rem', fontSize: '0.75rem'}}
        >
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      {/* Leaderboard Table Card */}
      <div className="glass-card leaderboard-card">
        <div className="leaderboard-header">
          <span>Rank</span>
          <span>Client</span>
          <span style={{textAlign: 'center'}}>Projects</span>
          <span style={{textAlign: 'center'}}>Satisfaction</span>
          <span style={{textAlign: 'right'}}>Total Earnings</span>
          <span style={{textAlign: 'right', paddingRight: '0.25rem'}}>Actions</span>
        </div>

        <div>
          {clients.length > 0 ? (
            clients.map((client, idx) => (
              <div key={client.id} className="leaderboard-row">
                {/* Rank */}
                <div className="leaderboard-rank">
                  {idx + 1}
                </div>

                {/* Client Avatar / Name */}
                <div className="leaderboard-client-profile">
                  <div className="leaderboard-client-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {client.avatar && client.avatar.startsWith('http') ? (
                      <img src={client.avatar} alt={client.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        {client.avatar || client.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="leaderboard-client-name">{client.name}</span>
                </div>

                {/* Projects count */}
                <div className="leaderboard-projects-count" style={{textAlign: 'center'}}>
                  {client.projects} items
                </div>

                {/* Growth percentage */}
                <div className="leaderboard-growth" style={{justifyContent: 'center'}}>
                  <TrendingUp className="w-3.5 h-3.5" /> +{client.growth}%
                </div>

                {/* Total Revenue */}
                <div className="leaderboard-revenue">
                  ₹{client.revenue.toLocaleString()}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => onEditClient(client)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s ease',
                    }}
                    title="Edit Client Name"
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-lime)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => onDeleteClient(client.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s ease',
                    }}
                    title="Delete Client"
                    onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>
              No clients registered yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
