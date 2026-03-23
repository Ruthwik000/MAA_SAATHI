import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHeartbeat, FaArrowLeft } from 'react-icons/fa';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const HERO_IMAGE = '/welcome_avatar.png';

// Role config — gradient per role, single shared hero image
const ROLE_CONFIG = {
  asha: {
    gradient: 'linear-gradient(160deg, rgba(252,228,236,0.85) 0%, rgba(253,246,249,0.7) 100%)',
    label: 'ASHA Worker Portal',
    subtitle: 'Supporting rural mothers across India'
  },
  doctor: {
    gradient: 'linear-gradient(160deg, rgba(227,242,253,0.85) 0%, rgba(240,247,255,0.7) 100%)',
    label: 'Doctor & Nurse Portal',
    subtitle: 'Monitoring patient health in real-time'
  },
  mother: {
    gradient: 'linear-gradient(160deg, rgba(243,229,245,0.85) 0%, rgba(250,245,255,0.7) 100%)',
    label: 'Mother Portal',
    subtitle: 'Track your health journey with care'
  }
};

const QUOTES = {
  asha: '"Every village deserves a healthcare hero."',
  doctor: '"Healing hands, caring hearts."',
  mother: '"A mother\'s love is the heart of every home."'
};

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { loginWithGoogle } = useAuth();

  const initialRole = location.state?.role || 'asha';
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);

  const config = ROLE_CONFIG[role] || ROLE_CONFIG.asha;

  const t = {
    en: { title: 'Login to MaaSathi', subtitle: 'Select your role to continue', continueGoogle: 'Continue with Google' },
    te: { title: 'మాసతికి లాగిన్ చేయండి', subtitle: 'కొనసాగించడానికి మీ పాత్రను ఎంచుకోండి', continueGoogle: 'Google తో కొనసాగండి' }
  };
  const text = t[language] || t.en;

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.isNewUser) {
        navigate('/role-setup', { state: { preSelectedRole: role } });
      } else {
        switch (result.profile.role) {
          case 'asha': navigate('/asha/dashboard'); break;
          case 'doctor': navigate('/doctor/dashboard'); break;
          case 'mother': navigate('/mother/dashboard'); break;
          default: navigate('/welcome');
        }
      }
    } catch (err) {
      console.error(err);
      alert(language === 'en' ? 'Failed to login with Google' : 'Google లాగిన్ విఫలమైంది');
    } finally {
      setLoading(false);
    }
  };

  const ROLE_LABELS = {
    en: { asha: 'ASHA', doctor: 'Doctor', mother: 'Mother' },
    te: { asha: 'ఆశా', doctor: 'డాక్టర్', mother: 'తల్లి' }
  };
  const roleLabel = ROLE_LABELS[language] || ROLE_LABELS.en;

  return (
    <div style={{ display: 'block', minHeight: '100dvh' }}>

      {/* ─── LEFT COLUMN: Fixed full-height hero image ─── */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '50%',
        height: '100dvh',
        overflow: 'hidden',
        zIndex: 0
      }}>

        {/* Hero image — absolute, fills container exactly */}
        <motion.img
          src={HERO_IMAGE}
          alt="MaaSathi Community"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            border: 'none',
            backgroundColor: 'transparent'
          }}
        />

        {/* Full gradient overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.6) 100%)',
          zIndex: 1
        }} />

        {/* MaaSathi logo — top left */}
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FaHeartbeat size={22} color="#FFFFFF" />
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>MaaSathi</span>
        </div>

        {/* Quote + badge — bottom left */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '24px',
          right: '24px',
          zIndex: 2
        }}>
          <p style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#FFFFFF',
            lineHeight: 1.5,
            margin: '0 0 12px 0',
            textShadow: '0 1px 4px rgba(0,0,0,0.3)'
          }}>
            {QUOTES[role]}
          </p>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            borderRadius: '100px',
            padding: '6px 14px',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>
              {config.label}
            </span>
          </div>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: Form (offset to sit beside fixed left) ─── */}
      <div style={{
        marginLeft: '50%',
        width: '50%',
        minHeight: '100dvh',
        backgroundColor: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
        position: 'relative',
        boxSizing: 'border-box'
      }}>

        {/* Top right controls */}
        <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {['en', 'te'].map((lang) => (
            <button
              key={lang}
              onClick={() => toggleLanguage(lang)}
              style={{
                padding: '5px 14px',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                backgroundColor: language === lang ? '#C2185B' : 'var(--surface)',
                color: language === lang ? '#FFFFFF' : 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
          <button
            onClick={toggleTheme}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            {theme === 'light' ? <MdOutlineDarkMode size={18} /> : <MdOutlineLightMode size={18} />}
          </button>
        </div>

        {/* Back arrow */}
        <button
          onClick={() => navigate('/welcome')}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <FaArrowLeft size={17} />
        </button>

        {/* Form */}
        <div style={{ width: '100%', maxWidth: '380px' }}>

          <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            {text.title}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: '0 0 32px 0' }}>
            {text.subtitle}
          </p>

          {/* Role Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '30px',
            padding: '4px',
            marginBottom: '32px',
            gap: '4px'
          }}>
            {['asha', 'doctor', 'mother'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  height: '38px',
                  borderRadius: '26px',
                  border: 'none',
                  backgroundColor: role === r ? '#C2185B' : 'transparent',
                  color: role === r ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.3px'
                }}
              >
                {roleLabel[r]}
              </button>
            ))}
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--border)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
              <path fill="#4285F4" d="M47.5 24.5C47.5 22.8 47.3 21.2 47.1 19.6H24.5V28.9H37.4C36.8 31.9 35.1 34.4 32.5 36.1V41.9H40.2C44.7 37.8 47.5 31.7 47.5 24.5Z" />
              <path fill="#34A853" d="M24.5 48C30.9 48 36.4 45.9 40.2 41.9L32.5 36.1C30.4 37.5 27.7 38.3 24.5 38.3C18.3 38.3 13 34.1 11.1 28.5H3.2V34.6C7.1 42.4 15.2 48 24.5 48Z" />
              <path fill="#FBBC05" d="M11.1 28.5C10.6 27 10.3 25.4 10.3 23.8C10.3 22.2 10.6 20.6 11.1 19.1V13H3.2C1.6 16.2 0.7 19.9 0.7 23.8C0.7 27.7 1.6 31.4 3.2 34.6L11.1 28.5Z" />
              <path fill="#EA4335" d="M24.5 9.4C28 9.4 31.1 10.6 33.6 12.9L40.4 6C36.3 2.3 30.9 0 24.5 0C15.2 0 7.1 5.6 3.2 13.4L11.1 19.5C13 13.9 18.3 9.4 24.5 9.4Z" />
            </svg>
            <span>{loading ? 'Connecting...' : text.continueGoogle}</span>
          </button>

          {/* Dev bypass */}
          <button
            onClick={() => {
              if (role === 'asha') navigate('/asha/dashboard');
              if (role === 'doctor') navigate('/doctor/dashboard');
              if (role === 'mother') navigate('/mother/dashboard');
            }}
            style={{
              width: '100%',
              marginTop: '12px',
              height: '40px',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              cursor: 'pointer'
            }}
          >
            Skip Login (Dev Mode)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
