import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaEdit, FaCamera, FaSignOutAlt,
  FaChartBar, FaCheck, FaTimes, FaSpinner
} from 'react-icons/fa';
import { FaUserMd } from 'react-icons/fa';
import DoctorLayout from '../../layouts/DoctorLayout';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';

const DoctorProfileScreen = () => {
  const navigate = useNavigate();
  const { user, profile, logout, updateProfile } = useAuth();
  const { language } = useLanguage();

  const [isEditing, setIsEditing]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [photoError, setPhotoError]   = useState(false);
  const [toast, setToast]             = useState('');

  const [formData, setFormData] = useState({
    name:           profile?.name           || 'Dr. Sharma',
    phone:          profile?.email          || '+91 9999988888',
    regNum:         profile?.regNum         || 'MED-2018-9842',
    phc:            profile?.phc            || 'Main Ramgarh',
    specialization: profile?.specialization || 'Obstetrics & Gynaecology',
    experience:     profile?.experience     || '8 Years',
  });
  const [saved, setSaved] = useState({ ...formData });

  const stats = { resolved: 142, reviewed: 856, monitored: 412 };

  const photoURL   = !photoError && (profile?.photoURL || '') || '';
  const initials   = formData.name.replace('Dr.', '').trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const t = {
    en: {
      title: 'Doctor Profile', edit: 'Edit',
      cName: 'Full Name', cPhone: 'Contact', cReg: 'Registration Number',
      cPhc: 'PHC Assigned', cSpec: 'Specialization', cExp: 'Years of Experience',
      profDetails: 'Professional Details',
      save: 'Save Changes', cancel: 'Cancel', saving: 'Saving...',
      impact: 'Your Clinical Impact',
      sResolved: 'Alerts\nResolved', sReviewed: 'Reports\nReviewed', sMonitored: 'Patients\nMonitored',
      logout: 'Logout',
      toastOk: 'Profile updated!', toastErr: 'Error saving profile',
      spec: 'Obstetrician',
    },
    te: {
      title: 'డాక్టర్ ప్రొఫైల్', edit: 'మార్చండి',
      cName: 'పూర్తి పేరు', cPhone: 'సంప్రదించండి', cReg: 'నమోదు సంఖ్య',
      cPhc: 'PHC', cSpec: 'స్పెషలైజేషన్', cExp: 'అనుభవం',
      profDetails: 'వృత్తిపరమైన వివరాలు',
      save: 'సేవ్ చేయండి', cancel: 'రద్దు', saving: 'సేవ్ అవుతోంది...',
      impact: 'మీ క్లినికల్ ఇంపాక్ట్',
      sResolved: 'హెచ్చరికలు\nపరిష్కరించబడ్డాయి', sReviewed: 'నివేదికలు\nసమీక్షించబడ్డాయి', sMonitored: 'రోగులు\nపర్యవేక్షించబడ్డారు',
      logout: 'లాగ్అవుట్',
      toastOk: 'ప్రొఫైల్ అప్‌డేట్ చేయబడింది!', toastErr: 'లోపం సంభవించింది',
      spec: 'ప్రసూతి వైద్యుడు',
    }
  };
  const text = t[language] || t.en;

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleEdit   = () => { setSaved({ ...formData }); setIsEditing(true); };
  const handleCancel = () => { setFormData({ ...saved }); setIsEditing(false); };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (user && updateProfile) await updateProfile(formData);
      setSaved({ ...formData });
      showToast(text.toastOk);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      showToast(text.toastErr);
    } finally { setLoading(false); }
  };

  const handleLogout = async () => {
    try { if (logout) await logout(); navigate('/welcome', { replace: true }); }
    catch (e) { console.error('Logout error', e); }
  };

  const handlePhotoUpload = () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = e => {
      const f = e.target.files[0];
      if (f) {
        setPhotoError(false);
        // In a real app, upload to Firebase Storage here
        // For now just show local preview via URL.createObjectURL
      }
    };
    inp.click();
  };

  /* ── shared styles ── */
  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '1px',
    color: 'var(--text-tertiary)', marginBottom: '4px'
  };
  const valueStyle = { fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)' };
  const inputStyle = {
    width: '100%', height: '44px', background: 'var(--bg-secondary)',
    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
    padding: '0 12px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif',
    color: 'var(--text-primary)', boxSizing: 'border-box', outline: 'none',
    transition: 'border-color 0.15s'
  };
  const sectionHeader = {
    padding: '16px 24px 12px 24px',
    display: 'flex', alignItems: 'center', gap: '8px',
    borderBottom: '1px solid var(--border-subtle)'
  };

  /* ── field grid row component ── */
  const FieldRow = ({ label, field, readOnly = false, half = false, colSpan = 1 }) => (
    <div style={{
      padding: '14px 0',
      borderBottom: '1px solid var(--border-subtle)',
      gridColumn: colSpan === 2 ? '1 / -1' : 'auto'
    }}>
      <label style={labelStyle}>{label}</label>
      {isEditing && !readOnly ? (
        <input
          type="text"
          value={formData[field]}
          onChange={e => handleChange(field, e.target.value)}
          style={inputStyle}
        />
      ) : (
        <span style={{ ...valueStyle, color: readOnly ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
          {formData[field]}
        </span>
      )}
    </div>
  );

  return (
    <DoctorLayout>
      <style dangerouslySetInnerHTML={{__html: `
        .dp-input:focus { border-color: var(--info) !important; }
        .dp-logout:hover { background: var(--danger-light) !important; }
      `}} />

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: '76px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text-primary)', color: 'white',
          padding: '10px 22px', borderRadius: '100px',
          fontSize: '13px', fontWeight: 600, zIndex: 200,
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)', whiteSpace: 'nowrap'
        }}>
          {toast}
        </div>
      )}

      {/* ── STICKY HEADER ── */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0
            }}
          >
            <FaArrowLeft size={16} color="var(--text-primary)" />
          </button>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {text.title}
          </span>
        </div>

        {/* Edit button — info coloured, never a square */}
        {!isEditing && (
          <button
            onClick={handleEdit}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'var(--info-light)', color: 'var(--info)',
              border: 'none', borderRadius: 'var(--radius-md)',
              padding: '8px 14px', fontSize: '13px', fontWeight: 600,
              fontFamily: 'inherit', cursor: 'pointer'
            }}
          >
            <FaEdit size={14} />{text.edit}
          </button>
        )}
      </header>

      {/* ── HERO SECTION ── */}
      <div style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '28px 24px', marginBottom: '16px', textAlign: 'center'
      }}>
        {/* Circular avatar — NEVER a square */}
        <div style={{
          width: '88px', height: '88px', borderRadius: '50%',
          background: 'var(--info-light)', border: '3px solid var(--info)',
          margin: '0 auto 12px auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', position: 'relative'
        }}>
          {photoURL ? (
            <img
              src={photoURL}
              alt="Doctor"
              onError={() => setPhotoError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--info)' }}>
              {initials}
            </span>
          )}

          {/* Camera button — circle, positioned absolute */}
          <button
            onClick={handlePhotoUpload}
            title="Change photo"
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'var(--info)', border: '2px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0
            }}
          >
            <FaCamera size={12} color="white" />
          </button>
        </div>

        {/* Name */}
        <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {formData.name.startsWith('Dr') ? formData.name : `Dr. ${formData.name}`}
        </div>

        {/* Specialization badge */}
        <div style={{
          display: 'inline-block', background: 'var(--info-light)', color: 'var(--info)',
          padding: '4px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 600
        }}>
          {formData.specialization || text.spec}
        </div>
      </div>

      {/* ── PROFESSIONAL DETAILS CARD ── */}
      <div style={{
        background: 'var(--surface)', borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)', marginBottom: '16px'
      }}>
        <div style={sectionHeader}>
          <FaUserMd size={16} color="var(--info)" />
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {text.profDetails}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0 24px' }}>
          {/* Full Name — full width */}
          <div style={{ gridColumn: '1 / -1', padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <label style={labelStyle}>{text.cName}</label>
            {isEditing
              ? <input type="text" className="dp-input" value={formData.name} onChange={e => handleChange('name', e.target.value)} style={inputStyle} />
              : <span style={valueStyle}>{formData.name}</span>}
          </div>

          {/* Phone — read only, full width */}
          <div style={{ gridColumn: '1 / -1', padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <label style={labelStyle}>{text.cPhone}</label>
            <span style={{ ...valueStyle, color: 'var(--text-secondary)' }}>{formData.phone}</span>
          </div>

          {/* Reg | PHC */}
          <div style={{ padding: '14px 12px 14px 0', borderBottom: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
            <label style={labelStyle}>{text.cReg}</label>
            {isEditing
              ? <input type="text" className="dp-input" value={formData.regNum} onChange={e => handleChange('regNum', e.target.value)} style={inputStyle} />
              : <span style={valueStyle}>{formData.regNum}</span>}
          </div>
          <div style={{ padding: '14px 0 14px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
            <label style={labelStyle}>{text.cPhc}</label>
            {isEditing
              ? <input type="text" className="dp-input" value={formData.phc} onChange={e => handleChange('phc', e.target.value)} style={inputStyle} />
              : <span style={valueStyle}>{formData.phc}</span>}
          </div>

          {/* Specialization | Experience */}
          <div style={{ padding: '14px 12px 14px 0', borderRight: '1px solid var(--border-subtle)' }}>
            <label style={labelStyle}>{text.cSpec}</label>
            {isEditing
              ? <input type="text" className="dp-input" value={formData.specialization} onChange={e => handleChange('specialization', e.target.value)} style={inputStyle} />
              : <span style={valueStyle}>{formData.specialization}</span>}
          </div>
          <div style={{ padding: '14px 0 14px 12px' }}>
            <label style={labelStyle}>{text.cExp}</label>
            {isEditing
              ? <input type="text" className="dp-input" value={formData.experience} onChange={e => handleChange('experience', e.target.value)} style={inputStyle} />
              : <span style={valueStyle}>{formData.experience}</span>}
          </div>
        </div>
      </div>

      {/* ── SAVE / CANCEL bar ── */}
      {isEditing && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--surface)', borderTop: '1px solid var(--border)',
          padding: '12px 24px 24px 24px', zIndex: 80,
          display: 'flex', flexDirection: 'column', gap: '10px'
        }}>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              width: '100%', height: '52px', background: 'var(--info)', color: 'white',
              border: 'none', borderRadius: 'var(--radius-md)', fontSize: '16px', fontWeight: 700,
              fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 16px rgba(2,132,199,0.25)'
            }}
          >
            {loading ? <FaSpinner size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <FaCheck size={16} />}
            {loading ? text.saving : text.save}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            style={{
              width: '100%', height: '44px', background: 'transparent',
              color: 'var(--text-secondary)', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 600,
              fontFamily: 'inherit', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <FaTimes size={14} />{text.cancel}
          </button>
        </div>
      )}

      {/* ── CLINICAL IMPACT CARD ── */}
      {!isEditing && (
        <div style={{
          background: 'var(--surface)', borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)', padding: '20px 24px', marginBottom: '16px'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FaChartBar size={16} color="var(--accent)" />
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {text.impact}
            </span>
          </div>

          {/* 3-column stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { value: stats.resolved,  label: text.sResolved,  color: 'var(--danger)'  },
              { value: stats.reviewed,  label: text.sReviewed,  color: 'var(--accent)'  },
              { value: stats.monitored, label: text.sMonitored, color: 'var(--success)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
                padding: '14px 12px', textAlign: 'center',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{
                  fontSize: '11px', fontWeight: 500, textTransform: 'uppercase',
                  letterSpacing: '0.8px', color: 'var(--text-tertiary)',
                  marginTop: '6px', lineHeight: 1.3, whiteSpace: 'pre-line'
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LOGOUT ── */}
      {!isEditing && (
        <div style={{ margin: '0 24px 24px 24px' }}>
          <button
            onClick={handleLogout}
            className="dp-logout"
            style={{
              width: '100%', height: '48px', background: 'transparent',
              color: 'var(--danger)', border: '1.5px solid var(--danger)',
              borderRadius: 'var(--radius-md)', fontSize: '15px', fontWeight: 600,
              fontFamily: '"DM Sans", sans-serif', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', transition: 'background 0.15s'
            }}
          >
            <FaSignOutAlt size={16} />{text.logout}
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </DoctorLayout>
  );
};

export default DoctorProfileScreen;
