import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaPhone, FaCheck, FaMapMarkerAlt, FaHeartbeat, FaCheckCircle } from 'react-icons/fa';

const RingAlertScreen = () => {
  const navigate = useNavigate();
  const [resolved, setResolved] = useState(false);

  // Mock Alert payload
  const alertPayload = {
    patientName: 'Sunita Devi',
    trigger: 'Ring SOS pressed',
    age: 24,
    status: '28 Weeks Pregnant',
    address: 'House 42, Ramgarh',
    vitals: { hr: '110 bpm', spo2: '96%' }
  };

  if (resolved) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: 'var(--success-light)', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
         <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', marginBottom: '24px', boxShadow: 'var(--shadow-elevated)' }}>
           <FaCheck />
         </div>
         <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)', marginBottom: '8px', fontFamily: '"DM Sans", sans-serif' }}>Alert Resolved</h2>
         <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 500, textAlign: 'center', marginBottom: '32px', fontFamily: '"DM Sans", sans-serif' }}>The emergency state has been successfully addressed and logged.</p>
         <button onClick={() => navigate(-1)} style={{ background: 'var(--success)', color: 'white', border: 'none', height: '48px', padding: '0 32px', borderRadius: 'var(--radius-md)', fontSize: '16px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>Return to Dashboard</button>
      </div>
    );
  }

  const handleCall = () => {
    // Note: native calling is handled via mobile deep linking usually
    window.alert("Calling available on mobile only");
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px 96px 20px', fontFamily: '"DM Sans", sans-serif' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dangerGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        @keyframes bellShake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-15deg); }
          40% { transform: rotate(15deg); }
          60% { transform: rotate(-10deg); }
          80% { transform: rotate(10deg); }
        }
      `}} />

      {/* TOP ALERT BANNER */}
      <div style={{
        width: '100%',
        background: 'var(--danger)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        marginBottom: '24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        animation: 'dangerGlow 2s infinite'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
           <FaBell size={40} color="white" style={{ animation: 'bellShake 2s infinite' }} />
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
          EMERGENCY ALERT
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
          from {alertPayload.patientName}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '100px', padding: '6px 16px', display: 'inline-block', fontSize: '13px', fontWeight: 500, color: 'white' }}>
          {alertPayload.trigger}
        </div>
      </div>

      {/* PATIENT INFO CARD */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--danger-light)',
          color: 'var(--danger)',
          fontSize: '18px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: '2px solid var(--danger)'
        }}>
          SD
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alertPayload.patientName}</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{alertPayload.age} yrs • {alertPayload.status}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
             <FaMapMarkerAlt size={13} color="var(--accent)" />
             <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{alertPayload.address}</span>
          </div>
        </div>
      </div>

      {/* VITALS CARD */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <FaHeartbeat size={18} color="var(--danger)" />
             <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Last Vitals</span>
           </div>
           <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>From ring sensor</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
           <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>HEART RATE</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--danger)' }}>{alertPayload.vitals.hr}</div>
           </div>
           <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>OXYGEN</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--info)' }}>{alertPayload.vitals.spo2}</div>
           </div>
        </div>
      </div>

      {/* NOTIFICATIONS CARD */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Notifications Confirmed</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
           {["ASHA Worker", "Doctor", "PHC Alerted"].map(role => (
              <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--success-light)', border: '1px solid var(--success)', borderRadius: '100px', fontSize: '13px', fontWeight: 600, color: 'var(--success)' }}>
                 <FaCheckCircle size={14} color="var(--success)" /> {role}
              </div>
           ))}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
         <button onClick={handleCall} style={{
           height: '52px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
           fontSize: '16px', fontWeight: 600, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'inherit'
         }}>
            <FaPhone size={18} /> Call Now
         </button>
         <button style={{
           height: '52px', background: 'transparent', color: 'var(--accent)', border: '1.5px solid var(--accent)', borderRadius: 'var(--radius-md)',
           fontSize: '16px', fontWeight: 600, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'inherit'
         }}>
            <FaBell size={18} /> Send Alert
         </button>
         <button style={{
           height: '48px', background: 'transparent', color: 'var(--text-secondary)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
           fontSize: '15px', fontWeight: 500, width: '100%', cursor: 'pointer', fontFamily: 'inherit'
         }}>
            View Patient Profile
         </button>

         <div 
           onClick={() => setResolved(true)}
           style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--text-tertiary)', cursor: 'pointer', textDecoration: 'underline' }}
           onMouseEnter={(e) => e.target.style.color = 'var(--danger)'}
           onMouseLeave={(e) => e.target.style.color = 'var(--text-tertiary)'}
         >
            Mark as Resolved
         </div>

         <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '12px' }}>
            All actions are logged with timestamp
         </div>
      </div>

    </div>
  );
};

export default RingAlertScreen;
