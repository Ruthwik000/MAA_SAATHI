import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const MotherEntryScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      /* Stitch-inspired Serene Pulse gradient */
      background: 'linear-gradient(145deg, #fce4ec 0%, #f8eaf6 40%, #ede7f6 100%)'
    }}>

      {/* Decorative floating orbs — Stitch design system pattern */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-60px',
        width: '280px', height: '280px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,64,122,0.18) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', right: '-40px',
        width: '240px', height: '240px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(149,117,205,0.2) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: '40%', right: '-30px',
        width: '160px', height: '160px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,64,122,0.10) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Floating Back Button — top left, outside card */}
      <button
        onClick={() => navigate('/welcome')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'var(--surface)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <FaArrowLeft size={18} />
      </button>

      {/* Centered Card */}
      <div style={{
        maxWidth: '480px',
        width: 'calc(100% - 40px)',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        boxShadow: 'var(--shadow-elevated)',
        border: '1px solid var(--border)'
      }}>

        {/* Header */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 8px 0'
        }}>
          Welcome
        </h2>
        <p style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: '0 0 32px 0'
        }}>
          Are you already registered with MaaSathi?
        </p>

        {/* Option Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Card 1: Login */}
          <div
            onClick={() => navigate('/login', { state: { role: 'mother' } })}
            style={{
              backgroundColor: 'var(--accent-subtle)',
              border: '1.5px solid var(--accent)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FaSignInAlt size={24} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Login to my account
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                I have logged in before
              </div>
            </div>
          </div>

          {/* Card 2: Signup */}
          <div
            onClick={() => navigate('/mother-signup')}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--success)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FaUserPlus size={24} color="var(--success)" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Create my account
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Register with MaaSathi
              </div>
            </div>
          </div>

        </div>

        {/* Dev Mode Bypass */}
        <button
          onClick={() => navigate('/mother/dashboard')}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '13px',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Skip → Go to Mother Dashboard (Dev Mode)
        </button>

      </div>
    </div>
  );
};

export default MotherEntryScreen;
