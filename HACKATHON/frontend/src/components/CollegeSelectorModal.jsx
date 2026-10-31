import React, { useState } from 'react';
import { useCollege } from '../context/CollegeContext';
import { Building2, Check, Search, X, MapPin } from 'lucide-react';

export function CollegeSelectorModal() {
  const { colleges, selectedCollege, selectCollege, isCollegeModalOpen, setIsCollegeModalOpen } = useCollege();
  const [query, setQuery] = useState('');

  if (!isCollegeModalOpen) return null;

  const filtered = colleges.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.shortName.toLowerCase().includes(query.toLowerCase()) ||
    c.city.toLowerCase().includes(query.toLowerCase()) ||
    c.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-backdrop">
      <div 
        className="modal-container" 
        style={{ maxWidth: 640, width: '100%', padding: 0, overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: '#FEF2F2',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Select Your College / University
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Choose an institution to navigate infrastructure reports and services
              </p>
            </div>
          </div>

          <button 
            className="btn btn-secondary btn-icon" 
            onClick={() => setIsCollegeModalOpen(false)}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '1rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ position: 'relative' }}>
            <Search 
              size={16} 
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} 
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search by college name, short code or city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
              autoFocus
            />
          </div>
        </div>

        {/* College List */}
        <div style={{ maxHeight: 380, overflowY: 'auto', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filtered.map(college => {
            const isSelected = college.id === selectedCollege.id;
            return (
              <div
                key={college.id}
                onClick={() => selectCollege(college.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                  background: isSelected ? '#FEF2F2' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                className="college-choice-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--primary)' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {college.code}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-heading)' }}>
                      {college.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      <MapPin size={12} color="var(--primary)" />
                      <span>{college.city}</span>
                      <span style={{ color: 'var(--border-dark)' }}>•</span>
                      <span style={{ color: 'var(--text-faint)' }}>{college.banner}</span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={14} />
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              No colleges match your search. Try searching for "NIT", "IIT", or "Delhi".
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.5rem',
          background: '#F8FAFC',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Selected: <strong style={{ color: 'var(--primary)' }}>{selectedCollege.shortName}</strong>
          </span>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setIsCollegeModalOpen(false)}
          >
            Confirm & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

