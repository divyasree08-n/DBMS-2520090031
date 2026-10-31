import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Check, 
  Zap, 
  Upload, 
  Image as ImageIcon,
  Building2
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useCollege } from '../context/CollegeContext';
import { classifyComplaintText } from '../utils/aiClassifier';

export function ComplaintForm({ onSubmit, onClose, activeUser }) {
  const { selectedCollege } = useCollege();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [priority, setPriority] = useState('MEDIUM');
  const [location, setLocation] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasAppliedAi, setHasAppliedAi] = useState(false);

  // Real-time AI Triage: derived directly during render
  const aiPrediction = (title.length > 3 || description.length > 5)
    ? classifyComplaintText(title, description)
    : null;

  const handleApplyAi = () => {
    if (aiPrediction) {
      setCategoryId(aiPrediction.categoryId);
      setPriority(aiPrediction.recommendedPriority);
      setHasAppliedAi(true);
    }
  };

  // Realistic Campus Locations for selected college
  const campusLocations = [
    `${selectedCollege.shortName}, R&D Complex, Level 3, Room 302 (IoT Lab)`,
    `${selectedCollege.shortName}, Central Library & Knowledge Centre, 2nd Floor`,
    `${selectedCollege.shortName}, Department of CSE, Software Lab 1`,
    `${selectedCollege.shortName}, Mechanical Engineering Block, CAD Lab 202`,
    `${selectedCollege.shortName}, Boys Hostel Wing B, Room 304`,
    `${selectedCollege.shortName}, Girls Hostel Wing A, 2nd Floor`,
    `${selectedCollege.shortName}, Student Activity Centre (SAC) & Food Court`,
    `${selectedCollege.shortName}, Main Administrative Complex, Room 104`
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachment({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          url: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadSamplePhoto = () => {
    setAttachment({
      name: 'switchboard_overheat_evidence.jpg',
      size: '215.4 KB',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim() || title.length < 5) {
      newErrors.title = 'Please provide a descriptive title (at least 5 characters).';
    }
    if (!description.trim() || description.length < 15) {
      newErrors.description = 'Please detail the problem and impact (at least 15 characters).';
    }
    if (!location.trim()) {
      newErrors.location = 'Please specify the exact campus location or room.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedCategoryObj = CATEGORIES.find(c => c.id === Number(categoryId)) || CATEGORIES[0];

    const newComplaint = {
      title,
      description,
      category: selectedCategoryObj.name,
      categoryId: selectedCategoryObj.id,
      priority,
      location,
      collegeId: selectedCollege.id,
      attachmentUrl: attachment?.url || null,
      attachmentName: attachment?.name || null,
      aiSuggestedPriority: aiPrediction?.recommendedPriority || priority,
      aiConfidenceScore: aiPrediction?.confidence || 0.85,
      aiHazardKeywords: aiPrediction?.hazardKeywords || [],
      complainantId: activeUser.id,
      complainantName: activeUser.name,
      complainantEmail: activeUser.email
    };

    onSubmit(newComplaint);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Zap size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Report Campus Issue
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {selectedCollege.shortName} • Complainant: <strong>{activeUser.name}</strong> ({activeUser.idNumber || activeUser.roleLabel})
              </div>
            </div>
          </div>
          <button 
            id="btn-close-complaint-modal"
            className="btn btn-secondary btn-sm" 
            onClick={onClose}
            style={{ borderRadius: '50%', padding: '0.4rem', width: 32, height: 32 }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Active College Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 'var(--radius-md)',
            padding: '0.6rem 0.85rem',
            fontSize: '0.8rem',
            color: 'var(--primary)',
            fontWeight: 600
          }}>
            <Building2 size={16} />
            <span>LODGING TO: {selectedCollege.name} ({selectedCollege.city})</span>
          </div>

          {/* Issue Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="complaint-title">
              Complaint Subject / Title <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="complaint-title"
              type="text"
              className="form-input"
              placeholder="e.g., Short circuit sparks in Physics Lab switchboard or Water pipe burst in Hostel Wing B"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            {errors.title && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.title}</div>}
          </div>

          {/* Live AI Triage Recommendation Banner */}
          {aiPrediction && (
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #86EFAC',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Sparkles size={18} color="#16A34A" style={{ marginTop: '0.15rem' }} />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#166534' }}>
                    AI Fast-Triage Suggestion ({(aiPrediction.confidence * 100).toFixed(0)}% confidence)
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#15803D', marginTop: '0.15rem' }}>
                    Suggested Category: <strong>{aiPrediction.category}</strong> | Urgency: <strong style={{ color: aiPrediction.recommendedPriority === 'CRITICAL' ? '#DC2626' : '#B45309' }}>{aiPrediction.recommendedPriority}</strong>
                    {aiPrediction.hazardKeywords?.length > 0 && (
                      <span style={{ display: 'block', fontSize: '0.725rem', color: '#166534', marginTop: '0.15rem' }}>
                        Detected keywords: {aiPrediction.hazardKeywords.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!hasAppliedAi ? (
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={handleApplyAi}
                  style={{
                    background: '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    padding: '0.35rem 0.75rem'
                  }}
                >
                  Apply AI Suggestion
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#15803D', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Check size={14} />
                  <span>Applied</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="complaint-desc">
              Detailed Description <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <textarea
              id="complaint-desc"
              className="form-input"
              rows={3}
              placeholder="Describe the exact infrastructure fault, safety hazard, affected classroom/lab/hostel room, and operational impact..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical' }}
            />
            {errors.description && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.description}</div>}
          </div>

          {/* Two-Column: Category & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                id="complaint-category"
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name} (SLA: {cat.slaHours}h)</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select
                id="complaint-priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">Low (Cosmetic / routine)</option>
                <option value="MEDIUM">Medium (Normal daily operations)</option>
                <option value="HIGH">High (Substantial disruption)</option>
                <option value="CRITICAL">Critical (Immediate safety hazard)</option>
              </select>
            </div>
          </div>

          {/* Campus Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="complaint-location">
              Campus Location / Hall / Room <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="complaint-location"
              type="text"
              className="form-input"
              placeholder="e.g., Central Library, 2nd Floor Reference Hall or Boys Hostel Wing B Room 304"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {/* Quick Location Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-faint)', alignSelf: 'center' }}>Quick Suggestions:</span>
              {campusLocations.slice(0, 3).map((loc, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setLocation(loc)}
                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
                >
                  {loc.split(',')[1]?.trim() || loc}
                </button>
              ))}
            </div>
            {errors.location && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.location}</div>}
          </div>

          {/* Photo / Attachment Evidence */}
          <div className="form-group">
            <label className="form-label">Photo Evidence (Optional)</label>
            
            {attachment ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                background: '#F8FAFC'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {attachment.url && (
                    <img 
                      src={attachment.url} 
                      alt="Preview" 
                      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                    />
                  )}
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                      {attachment.name}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      Size: {attachment.size} • Attached
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setAttachment(null)}
                  style={{ color: '#DC2626' }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div style={{
                border: '2px dashed var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                textAlign: 'center',
                background: '#FAFAFA'
              }}>
                <ImageIcon size={28} color="var(--text-faint)" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Upload photo of damaged equipment, burst pipeline, or broken furniture
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    <Upload size={14} />
                    <span>Choose File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleFileUpload} 
                    />
                  </label>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleLoadSamplePhoto}
                    style={{ fontSize: '0.75rem' }}
                  >
                    + Attach Sample Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-light)',
            marginTop: '0.5rem'
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ fontWeight: 800, padding: '0.6rem 1.5rem' }}
            >
              Submit Issue to Campus Helpdesk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
