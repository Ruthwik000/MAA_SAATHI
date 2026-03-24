import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaEnvelope, FaUsers, FaArrowLeft, FaLink, FaEdit, FaCamera, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const CaretakerProfile = () => {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  
  const initials = (profile?.name || 'Lakshmi').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
      // Fallback for demo
      navigate('/login');
    }
  };

  const [rel, setRel] = useState('Daughter');

  const fields = [
    { label: 'Full Name', value: profile?.name || 'Lakshmi Devi', icon: FaUser, readonly: false },
    { label: 'Phone', value: profile?.phone || '+91 9876543210', icon: FaPhone, readonly: true },
    { label: 'Email', value: profile?.email || 'lakshmi@example.com', icon: FaEnvelope, readonly: true },
  ];

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', padding: '32px 24px 96px 24px', fontFamily: '"DM Sans", sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => navigate(-1)}
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              <FaArrowLeft />
            </button>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Profile Settings</h1>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, fontSize: '15px' }}><FaEdit size={18} /></button>
      </header>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ position: 'relative', width: '88px', height: '88px', margin: '0 auto' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--accent-light)', border: '3px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800, color: 'var(--accent)' }}>
            {initials}
          </div>
          <button style={{ position: 'absolute', bottom: 0, right: 0, width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <FaCamera size={14} />
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '24px', marginBottom: '32px' }}>
        {fields.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: i === fields.length - 1 ? 'none' : '1px solid var(--border)' }}>
            <f.icon color="var(--text-tertiary)" size={18} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>{f.label}</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: f.readonly ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>{f.value}</div>
            </div>
          </div>
        ))}
        
        <div style={{ padding: '16px 0', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: '8px' }}>Relationship to Patient</div>
          <select 
            value={rel} 
            onChange={(e) => setRel(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
          >
            {['Son', 'Daughter', 'Spouse', 'Professional Caretaker', 'Other'].map(r => (
               <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>My Patients</h3>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700 }}>SR</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Saraswathi Reddy</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Elderly Care • Diabetic</div>
          </div>
          <FaLink color="var(--accent)" />
        </div>
      </section>

      <button 
        onClick={handleLogout}
        style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--danger)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', cursor: 'pointer' }}
      >
        <FaSignOutAlt /> Log Out
      </button>
    </div>
  );
};

export default CaretakerProfile;
