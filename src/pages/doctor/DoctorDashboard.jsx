import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaFilePdf, FaDownload, FaCheckCircle, FaSearch,
  FaClipboardList, FaMapMarkerAlt, FaMoon, FaSun
} from 'react-icons/fa';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import DoctorLayout from '../../layouts/DoctorLayout';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const ACTIVE_ALERTS = [
  { id: 'al1', name: 'Sunita Devi',   type: 'Ring SOS',          alertStyle: 'sos',       time: '10 mins ago',  location: 'House 42, Ramgarh', trigger: 'Ring SOS button pressed by patient', patientType: 'mother' },
  { id: 'al2', name: 'Ram Singh',     type: 'Fall Detected',     alertStyle: 'fall',      time: '1 hour ago',   location: 'House 18, Sila',    trigger: 'Fall detected by accelerometer sensor', patientType: 'elderly' },
  { id: 'al3', name: 'Priya Patel',   type: 'AI Critical Report', alertStyle: 'critical', time: '2 hours ago',  location: 'House 11, Ramgarh', trigger: 'Critical survey report received from ASHA', patientType: 'mother' },
  { id: 'al4', name: 'Om Prakash',    type: 'High Glucose',      alertStyle: 'critical', time: '3 hours ago',  location: 'House 5, Ramgarh', trigger: 'Patient reported high glucose levels in survey', patientType: 'wellness' },
];

const PDF_REPORTS = [
  { id: 'r1', name: 'Anjali Devi',    asha: 'Lakshmi', date: 'Today, 10:30 AM',      urgency: 'CRITICAL', status: 'New', patientType: 'mother'    },
  { id: 'r2', name: 'Suhana Khatun', asha: 'Kamala',  date: 'Yesterday, 2:15 PM',  urgency: 'MODERATE', status: 'Viewed', patientType: 'mother' },
  { id: 'r3', name: 'Gopal Krishan', asha: 'N/A',     date: '2 hours ago',         urgency: 'STABLE',   status: 'New', patientType: 'elderly' },
];

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [photoError, setPhotoError] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const drName  = profile?.name || 'Dr. Sharma';
  const drInit  = (profile?.name || 'Dr Sharma').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const phcName = profile?.phc  || 'Main Ramgarh';
  const photoURL = profile?.photoURL || '';

  const filters = [
    { id: 'All', label: 'All Patients' },
    { id: 'mother', label: 'Mothers' },
    { id: 'elderly', label: 'Elderly' },
    { id: 'wellness', label: 'Wellness' }
  ];

  const filteredAlerts = ACTIVE_ALERTS.filter(a => activeFilter === 'All' || a.patientType === activeFilter);
  const filteredReports = PDF_REPORTS.filter(r => activeFilter === 'All' || r.patientType === activeFilter);

  const t = {
    en: {
      duty: 'PHC',
      onDuty: '— On Duty',
      pendingLabel: 'Pending Reviews',
      resolvedLabel: 'Resolved Today',
      reportsLabel: 'Reports Received',
      activeAlerts: 'Active Alerts',
      reports: 'Reports Received',
      viewAll: 'View All',
      allPatients: 'All Patients',
      search: 'Search patients by name or village...',
      viewDetails: 'View Details',
      callPatient: 'Call Patient',
      asha: 'ASHA',
      noAlerts: 'No active alerts for this category',
      callingToast: "Calling available on mobile only. Use Send Alert to notify patient."
    },
    // ... (te remains same or adds te filters)
  };
  const text = t[language] || t.en;

  const pendingCount  = filteredAlerts.length;
  const resolvedCount = 4;
  const reportCount   = filteredReports.length;

  const inputStyle = {
    width: '100%', height: '48px', background: 'var(--surface)',
    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
    paddingLeft: '44px', paddingRight: '16px', fontSize: '15px',
    fontFamily: '"DM Sans", sans-serif', color: 'var(--text-primary)',
    boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.15s',
  };

  return (
    <DoctorLayout>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes alertDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(0.75); }
        }
        .dd-search:focus { border-color: var(--accent) !important; }
        .dd-alert-card:hover { border-color: var(--accent) !important; box-shadow: var(--shadow-elevated) !important; }
        .dd-report-card:hover { border-color: var(--accent) !important; }
        .filter-btn {
          padding: 8px 16px; border-radius: 100px; border: 1.5px solid var(--border);
          background: transparent; color: var(--text-secondary); font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .filter-btn.active {
          background: var(--accent); color: white; border-color: var(--accent);
          box-shadow: 0 4px 12px rgba(194,24,91,0.2);
        }
      `}} />

      {/* ── TOP BAR ── */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '16px 20px',
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Left: avatar + name/status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            onClick={() => navigate('/doctor/profile')}
            style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'var(--info-light)', border: '2px solid var(--info)',
              overflow: 'hidden', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0, cursor: 'pointer'
            }}
          >
            {photoURL && !photoError ? (
              <img src={photoURL} alt="Doctor" onError={() => setPhotoError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--info)' }}>{drInit}</span>
            )}
          </div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{drName.startsWith('Dr') ? drName : `Dr. ${drName}`}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{text.duty} {phcName} {text.onDuty}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['en', 'te'].map(lang => (
              <button key={lang} onClick={() => toggleLanguage(lang)} style={{ padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', border: '1.5px solid var(--border)', transition: 'all 0.15s', ...(language === lang ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' } : { background: 'transparent', color: 'var(--text-secondary)' }) }}>{lang.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={toggleTheme} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0 }}>{theme === 'light' ? <MdOutlineDarkMode size={18} /> : <MdOutlineLightMode size={18} />}</button>
        </div>
      </header>

      {/* ── FILTER BAR ── */}
      <div style={{
        padding: '16px 20px 0 20px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none'
      }}>
        {filters.map(f => (
          <button
            key={f.id}
            className={`filter-btn ${activeFilter === f.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── STATS ROW ── */}
      <div style={{ padding: '16px 20px 0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: text.pendingLabel,  value: pendingCount,  color: 'var(--warning)', Icon: FaClipboardList },
            { label: text.resolvedLabel, value: resolvedCount, color: 'var(--success)', Icon: FaCheckCircle   },
            { label: text.reportsLabel,  value: reportCount,   color: 'var(--accent)',  Icon: FaFilePdf       },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '20px', position: 'relative' // Issue 3: Padding 20px
            }}>
              <s.Icon style={{
                position: 'absolute', top: '16px', right: '16px',
                fontSize: '18px', color: s.color, opacity: 0.2 // Issue 3: Opacity 0.2
              }} />
              <div style={{ 
                fontSize: '36px', fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: '6px' // Issue 3: 36px/800
              }}>
                {s.value}
              </div>
              <div style={{ 
                fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', // Issue 3: 11px/600
                letterSpacing: '1.5px', color: 'var(--text-tertiary)', lineHeight: 1.3 // Issue 3: letter-spacing 1.5px
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ACTIVE ALERTS SECTION ── */}
      <div style={{ padding: '0 20px', marginBottom: '0' }}> {/* Issue 6: 20px padding */}
        {/* Section header */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          marginTop: '20px', marginBottom: '14px' // Issue 4: mt:20 mb:14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Pulsing red dot */}
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: 'var(--danger)',
              animation: 'alertDot 1.5s infinite', flexShrink: 0
            }} />
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {text.activeAlerts}
            </span>
            {/* Count badge */}
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'var(--danger)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, flexShrink: 0
            }}>
              {ACTIVE_ALERTS.length}
            </div>
          </div>
        </div>

        {/* Alert cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredAlerts.length === 0 ? (
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '20px',
              display: 'flex', alignItems: 'center', gap: '10px',
              color: 'var(--success)', fontSize: '15px', fontWeight: 600
            }}>
              <FaCheckCircle /> {text.noAlerts}
            </div>
          ) : (
            filteredAlerts.map(alert => {
              const aC = alertColors[alert.alertStyle] || alertColors.sos;
              return (
                <div
                  key={alert.id}
                  className="dd-alert-card"
                  style={{
                    background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    borderLeft: `4px solid ${aC.border}`,
                    padding: '20px',
                    boxShadow: 'var(--shadow-card)', transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{alert.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginLeft: '8px', flexShrink: 0 }}>{alert.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', background: aC.badgeBg, color: aC.badgeColor, flexShrink: 0 }}>{alert.type}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-secondary)', fontSize: '13px' }}><FaMapMarkerAlt size={11} />{alert.location}</div>
                  </div>
                  <p style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '12px', margin: '0 0 12px 0' }}>{alert.trigger}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => navigate(`/doctor/alert/${alert.id}`, { state: { alert } })} style={{ height: '36px', padding: '0 16px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>{text.viewDetails}</button>
                    <button onClick={() => window.innerWidth > 768 ? alert(text.callingToast) : window.location.href = `tel:+91 9876543210`} style={{ height: '36px', padding: '0 16px', background: 'transparent', color: 'var(--accent)', border: '1.5px solid var(--accent)', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>{text.callPatient}</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── REPORTS RECEIVED SECTION ── */}
      <div style={{ padding: '0 20px', marginBottom: '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaFilePdf size={18} color="var(--accent)" />
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{text.reports}</span>
          </div>
          <button onClick={() => navigate('/doctor/reports')} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{text.viewAll}</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredReports.map(rep => {
            const isCritical = rep.urgency === 'CRITICAL';
            const urgencyColor = isCritical ? 'var(--danger)' : 'var(--warning)';
            return (
              <div
                key={rep.id}
                onClick={() => navigate(`/doctor/report/${rep.id}`, { state: { report: rep } })}
                className="dd-report-card"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: `4px solid ${urgencyColor}`, borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.15s', cursor: 'pointer' }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: isCritical ? 'var(--danger-light)' : 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FaFilePdf size={24} color={urgencyColor} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{rep.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>{text.asha}: {rep.asha}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{rep.date}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                  <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', background: isCritical ? 'var(--danger-light)' : 'var(--warning-light)', color: urgencyColor }}>{rep.urgency}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, background: rep.status === 'New' ? 'var(--accent-light)' : 'var(--success-light)', color: rep.status === 'New' ? 'var(--accent)' : 'var(--success)' }}>{rep.status}</span>
                    <FaDownload size={16} color="var(--text-tertiary)" style={{ cursor: 'pointer' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ALL PATIENTS SECTION ── */}
      <div style={{ padding: '0 20px' }}> {/* Issue 6: 20px padding */}
        <div style={{ 
          fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', 
          marginTop: '24px', marginBottom: '12px' // Issue 4: mt:24 mb:12
        }}>
          {text.allPatients}
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: '0px' }}>
          <FaSearch style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)', fontSize: '16px',
            color: 'var(--text-tertiary)', pointerEvents: 'none'
          }} />
          <input
            type="text"
            className="dd-search"
            placeholder={text.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClick={() => navigate('/doctor/patients')}
            readOnly
            style={inputStyle}
          />
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
