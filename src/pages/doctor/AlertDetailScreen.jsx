import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaArrowLeft, FaExclamationCircle, FaPhone, FaCheck, FaUser, FaHeartbeat, FaLungs, FaBell, FaTimes, FaSpinner } from 'react-icons/fa';
import DoctorLayout from '../../layouts/DoctorLayout';
import { useLanguage } from '../../context/LanguageContext';

const AlertDetailScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { language } = useLanguage();

  const [showConfirm, setShowConfirm] = useState(false);
  const [resolving, setResolving] = useState(false);

  const alertData = location.state?.alert || {
    id: id || 'al1',
    name: 'Sunita Devi',
    type: 'Ring SOS',
    trigger: 'Ring SOS button pressed',
    location: 'House 42, Ramgarh',
    time: '10 mins ago',
    vitals: { hr: '110 bpm', spo2: '96%' },
    patient: {
      age: '24',
      weeks: '28',
      phone: '+91 9876543210'
    }
  };

  const t = {
    en: {
      title: "Emergency Alert",
      resolve: "Mark as Resolved",
      confirmTitle: "Confirm Resolution",
      confirmBody: "Are you sure this emergency has been addressed and the patient is stable?",
      cancel: "Cancel",
      confirm: "Confirm",
      call: "Call Now",
      sendAlert: "Send Sound Alert",
      viewProfile: "View Patient Profile",
      vitals: "Last Recorded Vitals",
      notifications: "Notifications Confirmed",
      hr: "Heart Rate",
      spo2: "SpO2 Level",
      house: "House",
      village: "Village",
      resolvedToast: "Alert marked as resolved",
      callingToast: "Calling available on mobile only. Use Send Alert to notify patient."
    },
    te: {
      title: "అత్యవసర హెచ్చరిక",
      resolve: "పరిష్కరించబడినట్లు గుర్తించండి",
      confirmTitle: "పరిష్కారాన్ని నిర్ధారించండి",
      confirmBody: "ఈ అత్యవసర పరిస్థితి పరిష్కరించబడిందని మరియు రోగి స్థిరంగా ఉన్నారని మీరు ఖచ్చితంగా అనుకుంటున్నారా?",
      cancel: "రద్దు చేయి",
      confirm: "నిర్ధారించండి",
      call: "ఇప్పుడే కాల్ చేయండి",
      sendAlert: "ధ్వని హెచ్చరికను పంపండి",
      viewProfile: "రోగి ప్రొఫైల్‌ను చూడండి",
      vitals: "చివరిగా రికార్డ్ చేయబడిన ప్రాణాధారాలు",
      notifications: "నోటిఫికేషన్లు నిర్ధారించబడ్డాయి",
      hr: "హృదయ స్పందన రేటు",
      spo2: "SpO2 స్థాయి",
      house: "ఇల్లు",
      village: "గ్రామం",
      resolvedToast: "హెచ్చరిక పరిష్కరించబడింది",
      callingToast: "మొబైల్‌లో మాత్రమే కాల్ అందుబాటులో ఉంది. రోగికి తెలియజేయడానికి హెచ్చరికను పంపండి."
    }
  };
  const text = t[language] || t.en;

  const handleResolve = () => {
    setResolving(true);
    setTimeout(() => {
      alert(text.resolvedToast);
      navigate('/doctor/dashboard');
    }, 1000);
  };

  const handleCall = () => {
    if (window.innerWidth > 768) {
      alert(text.callingToast);
    } else {
      window.location.href = `tel:${alertData.patient.phone}`;
    }
  };

  const cardStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '16px'
  };

  return (
    <DoctorLayout>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulseRing {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(220, 38, 38, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        .pulse-danger { animation: pulseRing 2s infinite; }
      `}} />

      {/* ── STICKY HEADER ── */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
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
        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--danger)' }}>
          {text.title}
        </span>
      </header>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* ── PATIENT NAME LARGE AT TOP ── */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {alertData.name}
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'var(--danger-light)', color: 'var(--danger)',
            padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1px'
          }}>
            <FaExclamationCircle size={14} className="pulse-danger" />
            {alertData.type}
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '12px', fontStyle: 'italic' }}>
            "{alertData.trigger}"
          </p>
        </div>

        {/* ── PATIENT INFO CARD ── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'var(--info-light)', border: '3px solid var(--info)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: 700, color: 'var(--info)', flexShrink: 0
            }}>
              {alertData.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{alertData.name}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {alertData.patient.age} yrs • {alertData.patient.weeks} weeks pregnant
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                {alertData.location}
              </div>
            </div>
          </div>
        </div>

        {/* ── LAST VITALS CARD ── */}
        <div style={{ ...cardStyle, background: 'var(--bg-secondary)', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FaHeartbeat color="var(--danger)" />
            <span style={{ fontSize: '14px', fontWeight: 700 }}>{text.vitals}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
             <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '4px' }}>{text.hr}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--danger)' }}>{alertData.vitals.hr}</div>
             </div>
             <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '4px' }}>{text.spo2}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--info)' }}>{alertData.vitals.spo2}</div>
             </div>
          </div>
        </div>

        {/* ── NOTIFICATIONS CONFIRMED ── */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            {text.notifications}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {["ASHA Worker", "Doctor (You)", "PHC Hub"].map(label => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'var(--success-light)', color: 'var(--success)',
                padding: '6px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600,
                border: '1px solid var(--success)'
              }}>
                <FaCheck size={10} /> {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
           <button
             onClick={handleCall}
             style={{
               height: '56px', background: 'var(--danger)', color: 'white',
               border: 'none', borderRadius: 'var(--radius-md)', fontSize: '16px', fontWeight: 700,
               display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
               cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(220,38,38,0.25)'
             }}
           >
             <FaPhone /> {text.call}
           </button>

           <button
             onClick={() => alert("SOS Sound Alert sent to ring!")}
             style={{
               height: '48px', background: 'transparent', color: 'var(--text-primary)',
               border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
               fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center',
               justifyContent: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'inherit'
             }}
           >
             <FaBell /> {text.sendAlert}
           </button>

           <button
             onClick={() => navigate('/doctor/patients')}
             style={{
               height: '48px', background: 'transparent', color: 'var(--accent)',
               border: 'none', borderRadius: 'var(--radius-md)',
               fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
             }}
           >
             <FaUser /> {text.viewProfile}
           </button>

           <button
             onClick={() => setShowConfirm(true)}
             style={{
               marginTop: '12px', background: 'none', border: 'none',
               color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 600,
               textDecoration: 'underline', cursor: 'pointer', marginBottom: '24px'
             }}
           >
             {text.resolve}
           </button>
        </div>

      </div>

      {/* ── CONFIRMATION MODAL ── */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', p: '24px', zIndex: 1000
        }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '24px', maxWidth: '340px', width: '90%', textAlign: 'center' }}>
             <FaCheckCircle size={48} color="var(--success)" style={{ marginBottom: '16px' }} />
             <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{text.confirmTitle}</h3>
             <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
                {text.confirmBody}
             </p>
             <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setShowConfirm(false)} style={{
                  flex: 1, height: '44px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                  border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer'
                }}>
                  {text.cancel}
                </button>
                <button onClick={handleResolve} disabled={resolving} style={{
                  flex: 1, height: '44px', background: 'var(--success)', color: 'white',
                  border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {resolving ? <FaSpinner className="animate-spin" /> : text.confirm}
                </button>
             </div>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
};

export default AlertDetailScreen;
