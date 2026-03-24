import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends, FaHome, FaArrowLeft, FaHeartbeat } from 'react-icons/fa';

/**
 * CaretakerTypeSelect Component
 * Allows users to choose between Family Member and ASHA Worker sub-roles.
 */
const CaretakerTypeSelect = () => {
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

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '48px'
  };

  const backButtonStyle = {
    width: '48px',
    height: '48px',
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
    borderRadius: '50%',
    backgroundColor: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const badgeStyle = (bgColor, textColor) => ({
    padding: '4px 12px',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: bgColor,
    color: textColor,
    fontSize: '12px',
    fontWeight: 600,
    position: 'absolute',
    top: '24px',
    right: '24px'
  });

  return (
    <div style={containerStyle}>
      <style dangerouslySetInnerHTML={{ __html: `
        .role-card:hover {
          border-color: var(--accent) !important;
          background-color: var(--accent-subtle) !important;
        }
        .back-btn:hover {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
        }
      `}} />

      {/* Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="back-btn"
          style={backButtonStyle}
          aria-label="Back"
        >
          <FaArrowLeft size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FaHeartbeat size={32} color="var(--accent)" />
          <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>MaaSathi</span>
        </div>
      </div>

      <div style={contentWrapperStyle}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Who are you?</h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '40px' }}>Select your role to continue</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Family Member Card */}
          <div 
            className="role-card" 
            style={cardStyle}
            onClick={() => navigate('/family-dashboard')}
          >
            <div style={iconCircleStyle('var(--accent-light)')}>
              <FaUserFriends size={22} color="var(--accent)" />
            </div>
            <div style={badgeStyle('var(--accent-light)', 'var(--accent)')}>For families</div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>Family Member</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Monitor a loved one's health, receive emergency alerts and view their reports
              </p>
            </div>
          </div>

          {/* ASHA Worker Card */}
          <div 
            className="role-card" 
            style={cardStyle}
            onClick={() => navigate('/asha/dashboard')}
          >
            <div style={iconCircleStyle('var(--info-light)')}>
              <FaHome size={22} color="var(--info)" />
            </div>
            <div style={badgeStyle('var(--info-light)', 'var(--info)')}>For ASHA workers</div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>ASHA Worker</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Manage your village patients, fill clinical surveys and track maternal health visits
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaretakerTypeSelect;
