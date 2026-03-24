import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHeartbeat, FaArrowLeft, FaUserNurse, FaStethoscope, FaBaby, FaUser, FaUserFriends } from 'react-icons/fa';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_IMAGE = '/hero_illustration_v2.png';

const ROLES = [
  { id: 'asha', icon: FaUserNurse, label: 'ASHA', color: '#C2185B', sub: 'Village worker' },
  { id: 'doctor', icon: FaStethoscope, label: 'Doctor', color: '#1A237E', sub: 'Clinical portal' },
  { id: 'mother', icon: FaBaby, label: 'Mother', color: '#C2185B', sub: 'Maternal health' },
  { id: 'patient', icon: FaUser, label: 'Patient', color: '#2E7D32', sub: 'Self care' },
  { id: 'caretaker', icon: FaUserFriends, label: 'Caretaker', color: '#F9A825', sub: 'Family portal' }
];

const QUOTES = {
  asha: '"Every village deserves a healthcare hero."',
  doctor: '"Healing hands, caring hearts."',
  mother: '"A mother\'s love is the heart of every home."',
  patient: '"Health is the greatest wealth."',
  caretaker: '"Caregiving is an act of love."'
};

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { loginWithGoogle } = useAuth();

  const initialRole = location.state?.role || 'asha';
  const initialType = location.state?.type || '';
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'signup'

  const t = {
    en: { 
      loginTitle: 'Welcome Back', 
      signupTitle: 'Join MaaSathi', 
      loginSub: 'Select your role to login', 
      signupSub: 'Select your role to create an account',
      continueGoogle: 'Continue with Google',
      switchLogin: "Already have an account? Login",
      switchSignup: "New to MaaSathi? Create Account"
    },
    te: { 
      loginTitle: 'తిరిగి స్వాగతం', 
      signupTitle: 'మాసతిలో చేరండి', 
      loginSub: 'లాగిన్ చేయడానికి పాత్రను ఎంచుకోండి', 
      signupSub: 'ఖాతాను సృష్టించడానికి పాత్రను ఎంచుకోండి',
      continueGoogle: 'Google తో కొనసాగండి',
      switchLogin: "ఖాతా ఉందా? లాగిన్ అవ్వండి",
      switchSignup: "కొత్త వారా? ఖాతాను సృష్టించండి"
    }
  };
  const text = t[language] || t.en;

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginWithGoogle();

      if (result.firestoreUnavailable) {
        alert(result.firestoreMessage);
      }

      if (result.isNewUser || result.firestoreUnavailable) {
        // Pass both role and type to role setup
        navigate('/role-setup', { state: { preSelectedRole: role, preSelectedType: initialType } });
      } else {
        const userRole = result.profile.role;
        const patientType = result.profile.patientType || initialType;

        const isSurveyCompleted = !!result.profile.isSurveyCompleted;

        if (userRole === 'asha') {
          navigate('/asha/dashboard', { replace: true });
        } else if (userRole === 'doctor') {
          navigate('/doctor/dashboard', { replace: true });
        } else if (userRole === 'mother') {
          navigate(isSurveyCompleted ? '/mother/dashboard' : '/mother/medical-history', { replace: true });
        } else if (userRole === 'patient') {
          if (patientType === 'elderly') {
            navigate(isSurveyCompleted ? '/dashboard/elderly' : '/elderly/health-survey', { replace: true });
          } else if (patientType === 'wellness') {
            navigate(isSurveyCompleted ? '/dashboard/wellness' : '/wellness/health-survey', { replace: true });
          } else {
            navigate('/welcome', { replace: true });
          }
        } else if (userRole === 'caretaker') {
          navigate('/family-dashboard', { replace: true });
        } else {
          navigate('/welcome', { replace: true });
        }
      }
    } catch (err) {
      const isConfigMissing =
        err?.code === 'auth/configuration-not-found' ||
        String(err?.message || '').includes('CONFIGURATION_NOT_FOUND');

      const message = isConfigMissing
        ? 'Firebase Google Sign-In is not configured for this project. Update your .env Firebase keys and enable Google sign-in in Firebase Console.'
        : language === 'en'
          ? (err?.message || 'Failed to login with Google')
          : 'Google లాగిన్ విఫలమైంది';

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: '#FFFFFF', fontFamily: '"DM Sans", sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 960px) {
          .hero-side { 
            position: relative !important; 
            width: 100% !important; 
            height: 300px !important; 
            padding: 24px !important;
            mask-image: linear-gradient(to bottom, black 85%, transparent 100%) !important;
          }
          .form-side { margin-left: 0 !important; width: 100% !important; padding: 32px 24px !important; min-height: auto !important; }
          .role-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-content { bottom: 24px !important; left: 24px !important; right: 24px !important; }
          .main-wrapper { flex-direction: column !important; }
        }
        .role-card {
           padding: 16px; border-radius: var(--radius-xl); background: var(--surface); border: 1.5px solid var(--border);
           cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center;
        }
        .role-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: var(--shadow-elevated); }
        .role-card[data-active="true"] { border-color: var(--accent); background: var(--accent-subtle); border-width: 2px; }
      `}} />

      <div className="main-wrapper" style={{ display: 'flex', width: '100%', minHeight: '100dvh' }}>
        {/* HERO SIDE: Seamless Illustration */}
        <div className="hero-side" style={{
          position: 'fixed', left: 0, top: 0, bottom: 0, width: '45%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          backgroundColor: '#FFFFFF', zIndex: 1
        }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img 
              src={HERO_IMAGE} 
              alt="Hero Illustration" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                maxHeight: '85vh',
                objectFit: 'contain',
                mixBlendMode: 'normal',
                border: 'none',
                WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
                maskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
              }} 
            />
            {/* Dynamic Quote Overlay - Minimal Style */}
            <div className="hero-content" style={{ position: 'absolute', bottom: 48, left: 48, right: 48, zIndex: 10 }}>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={role} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  style={{ 
                    fontSize: '22px', 
                    fontWeight: 700, 
                    color: 'var(--text-primary)', 
                    margin: 0,
                    maxWidth: '400px' 
                  }}
                >
                  {QUOTES[role]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* FORM SIDE */}
        <div className="form-side" style={{
          marginLeft: '45%', width: '55%', minHeight: '100dvh', position: 'relative',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 80px',
          backgroundColor: '#FFFFFF'
        }}>
        <div style={{ position: 'absolute', top: 32, right: 32, display: 'flex', gap: '8px' }}>
          <button onClick={() => toggleLanguage(language === 'en' ? 'te' : 'en')} style={{ padding: '6px 14px', borderRadius: '100px', border: '1px solid var(--border)', background: 'var(--surface)', fontWeight: 700, cursor: 'pointer' }}>{language.toUpperCase()}</button>
          <button onClick={toggleTheme} style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme === 'light' ? <MdOutlineDarkMode size={18} /> : <MdOutlineLightMode size={18} />}
          </button>
        </div>

        <button onClick={() => navigate('/welcome')} style={{ position: 'absolute', top: 32, left: 32, border: 'none', background: 'var(--bg-secondary)', width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FaArrowLeft size={16} />
        </button>

        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
          {/* Login / Sign Up Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '12px', padding: '4px', marginBottom: '32px' }}>
            <button 
              onClick={() => setMode('login')}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                background: mode === 'login' ? 'var(--surface)' : 'transparent',
                boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none',
                fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                color: mode === 'login' ? 'var(--accent)' : 'var(--text-tertiary)'
              }}
            >
              Login
            </button>
            <button 
              onClick={() => setMode('signup')}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                background: mode === 'signup' ? 'var(--surface)' : 'transparent',
                boxShadow: mode === 'signup' ? 'var(--shadow-sm)' : 'none',
                fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                color: mode === 'signup' ? 'var(--accent)' : 'var(--text-tertiary)'
              }}
            >
              Sign Up
            </button>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-1px' }}>
            {mode === 'login' ? text.loginTitle : text.signupTitle}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            {mode === 'login' ? text.loginSub : text.signupSub}
          </p>

          <div className="role-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
            {ROLES.map((r) => (
              <div key={r.id} className="role-card" data-active={role === r.id} onClick={() => setRole(r.id)}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${r.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <r.icon size={20} color={r.color} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{r.label}</div>
              </div>
            ))}
          </div>

          <button onClick={handleGoogleLogin} disabled={loading} style={{
            width: '100%', height: '52px', background: '#FFF', border: '1.5px solid var(--border)', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: 700, cursor: 'pointer'
          }}>
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M47.5 24.5C47.5 22.8 47.3 21.2 47.1 19.6H24.5V28.9H37.4C36.8 31.9 35.1 34.4 32.5 36.1V41.9H40.2C44.7 37.8 47.5 31.7 47.5 24.5Z"/><path fill="#34A853" d="M24.5 48C30.9 48 36.4 45.9 40.2 41.9L32.5 36.1C30.4 37.5 27.7 38.3 24.5 38.3C18.3 38.3 13 34.1 11.1 28.5H3.2V34.6C7.1 42.4 15.2 48 24.5 48Z"/><path fill="#FBBC05" d="M11.1 28.5C10.6 27 10.3 25.4 10.3 23.8C10.3 22.2 10.6 20.6 11.1 19.1V13H3.2C1.6 16.2 0.7 19.9 0.7 23.8C0.7 27.7 1.6 31.4 3.2 34.6L11.1 28.5Z"/><path fill="#EA4335" d="M24.5 9.4C28 9.4 31.1 10.6 33.6 12.9L40.4 6C36.3 2.3 30.9 0 24.5 0C15.2 0 7.1 5.6 3.2 13.4L11.1 19.5C13 13.9 18.3 9.4 24.5 9.4Z"/></svg>
            <span>{loading ? 'Authenticating...' : text.continueGoogle}</span>
          </button>

          <p 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            style={{ 
              textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--accent)', 
              marginTop: '24px', cursor: 'pointer', transition: 'all 0.2s' 
            }}
          >
            {mode === 'login' ? text.switchSignup : text.switchLogin}
          </p>

          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '24px', lineHeight: 1.6 }}>
            By continuing, you agree to our Terms and Privacy Policy.
          </p>

          {/* Dev bypass */}
          <button
            onClick={() => {
              if (role === 'asha') navigate('/asha/dashboard');
              if (role === 'doctor') navigate('/doctor/dashboard');
              if (role === 'mother') navigate('/mother/dashboard');
              if (role === 'caretaker') navigate('/family-dashboard');
              if (role === 'patient') {
                if (initialType === 'elderly') navigate('/elderly/health-survey');
                else if (initialType === 'wellness') navigate('/wellness/health-survey');
                else navigate('/patient-type-select');
              }
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
    </div>
  );
};

export default LoginScreen;
