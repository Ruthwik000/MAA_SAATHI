import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { motion } from 'framer-motion';

const HERO_IMAGE = '/hero_illustration_v2.png';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslation();

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: '#FFFFFF', fontFamily: '"DM Sans", sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 960px) {
          .hero-side { 
            position: relative !important; 
            width: 100% !important; 
            height: 320px !important; 
            padding: 24px !important;
            mask-image: linear-gradient(to bottom, black 80%, transparent 100%) !important;
            -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%) !important;
          }
          .form-side { margin-left: 0 !important; width: 100% !important; padding: 40px 24px !important; min-height: auto !important; }
          .main-wrapper { flex-direction: column !important; }
          .welcome-title { font-size: 36px !important; }
        }
        .action-button {
          width: 100%;
          height: 56px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          text-decoration: none;
        }
        .btn-primary {
          background: #C2185B;
          color: #FFF;
          border: none;
        }
        .btn-primary:hover {
          background: #A3154D;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(194, 24, 91, 0.2);
        }
        .btn-secondary {
          background: transparent;
          color: #C2185B;
          border: 2px solid #C2185B;
        }
        .btn-secondary:hover {
          background: rgba(194, 24, 91, 0.05);
          transform: translateY(-2px);
        }
        .btn-tertiary {
          background: #F8F9FA;
          color: #191c1d;
          border: 1.5px solid #e1e3e4;
        }
        .btn-tertiary:hover {
          background: #f1f3f4;
          border-color: #C2185B;
        }
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
            transition={{ duration: 0.8 }}
            style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img 
              src={HERO_IMAGE} 
              alt="MaaSathi Illustration" 
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
          </motion.div>
        </div>

        {/* CONTENT SIDE */}
        <div className="form-side" style={{
          marginLeft: '45%', width: '55%', minHeight: '100dvh', position: 'relative',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 80px',
          backgroundColor: '#FFFFFF'
        }}>
          {/* Controls */}
          <div style={{ position: 'absolute', top: 32, right: 32, display: 'flex', gap: '8px' }}>
            <button onClick={() => toggleLanguage(language === 'en' ? 'te' : 'en')} style={{ padding: '6px 14px', borderRadius: '100px', border: '1px solid #e1e3e4', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>{language.toUpperCase()}</button>
            <button onClick={toggleTheme} style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #e1e3e4', background: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#191c1d' }}>
              {theme === 'light' ? <MdOutlineDarkMode size={18} /> : <MdOutlineLightMode size={18} />}
            </button>
          </div>

          <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
              <FaHeartbeat size={36} color="#C2185B" />
              <span style={{ fontSize: '32px', fontWeight: 900, color: '#191c1d', letterSpacing: '-1.5px' }}>MaaSathi</span>
            </div>

            {/* Typography */}
            <h1 className="welcome-title" style={{ margin: 0, marginBottom: '16px' }}>
              <span style={{ display: 'block', fontSize: '48px', fontWeight: 800, color: '#191c1d', lineHeight: 1.1, letterSpacing: '-2px' }}>
                {t.auth.welcomeTitle1}
              </span>
              <span style={{ display: 'block', fontSize: '48px', fontWeight: 800, color: '#C2185B', lineHeight: 1.1, letterSpacing: '-2px' }}>
                {t.auth.welcomeTitle2}
              </span>
            </h1>
            
            <p style={{ fontSize: '18px', color: '#594045', lineHeight: 1.6, marginBottom: '48px', maxWidth: '420px' }}>
              {t.auth.welcomeSubtitle}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button 
                className="action-button btn-primary"
                onClick={() => navigate('/login', { state: { role: 'doctor' } })}
              >
                Login as Doctor
              </button>
              
              <button 
                className="action-button btn-secondary"
                onClick={() => navigate('/patient-type-select')}
              >
                Login as Patient
              </button>
              
              <button 
                className="action-button btn-tertiary"
                onClick={() => navigate('/caretaker-type')}
              >
                Login as Caretaker
              </button>
            </div>

            <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #f1f3f4', textAlign: 'center' }}>
               <p style={{ fontSize: '12px', color: '#8d6f75', margin: 0 }}>
                 Trusted by 10,000+ families across rural India.
               </p>
               <p style={{ fontSize: '12px', color: '#8d6f75', marginTop: '4px', fontWeight: 600 }}>
                 Made with ❤️ for Maternal & Elderly Health
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
