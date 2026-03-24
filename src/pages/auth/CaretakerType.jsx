import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends, FaHome, FaArrowLeft, FaHeartbeat } from 'react-icons/fa';

/**
 * CaretakerType Component
 * Allows users to choose between Family Member and ASHA Worker sub-roles.
 */
const CaretakerType = () => {
  const navigate = useNavigate();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100dvh',
    backgroundColor: 'var(--bg-secondary)',
    padding: '40px 24px',
    fontFamily: '"DM Sans", sans-serif',
    position: 'relative'
  };

  const backButtonStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0
  };

  const contentWrapperStyle = {
    width: '100%',
    maxWidth: '440px',
    margin: '0 auto',
    marginTop: '0'
  };

  const cardStyle = {
    backgroundColor: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '16px',
    minHeight: '48px',
    position: 'relative',
    overflow: 'hidden'
  };

  const iconCircleStyle = (bgColor) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const badgeStyle = (bgColor, textColor) => ({
    padding: '4px 12px',
    borderRadius: '100px',
    backgroundColor: bgColor,
    color: textColor,
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  });

  return (
    <div style={containerStyle}>
      <style dangerouslySetInnerHTML={{ __html: `
        .role-card:hover {
          border-color: var(--accent) !important;
          background-color: var(--surface) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-elevated);
        }
        .back-btn:hover {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
          background: var(--accent-light) !important;
        }
      `}} />

      {/* Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', maxWidth: '440px', margin: '0 auto 40px auto', width: '100%' }}>
        <button 
          onClick={() => navigate('/welcome')} 
          className="back-btn"
          style={backButtonStyle}
          aria-label="Back"
        >
          <FaArrowLeft size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaHeartbeat size={28} color="var(--accent)" />
          <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>MaaSathi</span>
        </div>
      </div>

      <div style={contentWrapperStyle}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-1px' }}>Who are you?</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.5 }}>Choose your portal to proceed to your dashboard</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Family Member Card */}
          <div 
            className="role-card" 
            style={cardStyle}
            onClick={() => navigate('/family-dashboard')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={iconCircleStyle('var(--accent-light)')}>
                <FaUserFriends size={22} color="var(--accent)" />
              </div>
              <div style={badgeStyle('var(--accent-light)', 'var(--accent)')}>Personal</div>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Family Member</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Monitor your elderly relatives, receive emergency alerts and view their medical reports in real-time.
              </p>
            </div>
          </div>

          {/* ASHA Worker Card */}
          <div 
            className="role-card" 
            style={cardStyle}
            onClick={() => navigate('/asha/dashboard')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={iconCircleStyle('rgba(37, 99, 235, 0.1)')}>
                <FaHome size={22} color="var(--info)" />
              </div>
              <div style={badgeStyle('rgba(37, 99, 235, 0.1)', 'var(--info)')}>Professional</div>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>ASHA Worker</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Manage village health profiles, conducted surveys, and provide doorstep support for mothers and infants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaretakerType;
