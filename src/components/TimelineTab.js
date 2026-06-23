'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar } from 'lucide-react';

export default function TimelineTab({ projects, onToggleProjectStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Calculate project list filtered
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      {/* Search & Filter Options */}
      <div className="timeline-header-bar">
        {/* Search */}
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filter tabs */}
        <div className="filter-tabs-wrapper">
          <span className="filter-label"><Filter className="w-3.5 h-3.5" /> Category:</span>
          {['All', 'Video Editing', 'Motion Design', 'Thumbnails'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`filter-tab ${categoryFilter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Project List */}
      <div className="timeline-list">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card timeline-item"
            >
              <div className="timeline-item-left">
                <div className="timeline-item-icon">
                  {project.category === 'Video Editing' ? '🎬' : project.category === 'Motion Design' ? '✨' : '🎨'}
                </div>
                <div className="timeline-item-details">
                  <h4>{project.name}</h4>
                  <div className="timeline-item-sub">
                    <span>{project.client}</span>
                    <span>•</span>
                    <span>{project.category}</span>
                  </div>
                </div>
              </div>

              <div className="timeline-item-right">
                <div className="timeline-item-financials">
                  <span className="timeline-item-amount" style={{color: project.status === 'Completed' ? 'var(--accent-lime)' : 'var(--text-secondary)'}}>
                    ₹{project.amount.toLocaleString()}
                  </span>
                  <span className="timeline-item-date"><Calendar className="w-3 h-3" /> {project.date}</span>
                </div>
                
                <button
                  onClick={() => onToggleProjectStatus(project.id)}
                  className={`badge status-toggle-btn ${project.status === 'Completed' ? 'status-completed' : 'status-pending'}`}
                  title="Click to toggle status (Done vs Pending)"
                  style={{border: 'none'}}
                >
                  {project.status === 'Completed' ? 'Done' : 'Pending'}
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="glass-card" style={{textAlign: 'center', padding: '4rem 2rem'}}>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>No creative projects match your filters.</p>
            <button 
              onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
              className="btn-secondary"
              style={{marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.75rem'}}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
