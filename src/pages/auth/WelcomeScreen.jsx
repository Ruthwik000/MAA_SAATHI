import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { motion } from 'framer-motion';

const HERO_IMAGE = '/hero_illustration_final_v6.png';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslation();

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: '#FFFFFF', fontFamily: '"DM Sans", sans-serif', overflow: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 960px) {
          .main-wrapper { flex-direction: column !important; overflow-y: auto !important; height: auto !important; overflow-x: hidden !important; }
          .hero-side { 
            position: relative !important; 
            width: 100% !important; 
            height: 280px !important; 
            padding-top: env(safe-area-inset-top) !important;
            mask-image: linear-gradient(to bottom, black 90%, transparent 100%) !important;
            -webkit-mask-image: linear-gradient(to bottom, black 90%, transparent 100%) !important;
          }
          .form-side { 
            width: 100% !important; 
            padding: 32px 20px !important; 
            height: auto !important;
            overflow: visible !important;
            padding-bottom: calc(40px + env(safe-area-inset-bottom)) !important;
          }
          .welcome-title p { font-size: 32px !important; letter-spacing: -1px !important; }
          .top-right-group { 
            position: static !important; 
            margin-bottom: 24px !important;
            justify-content: flex-end !important;
          }
        }
        
        .action-button {
          width: 100%;
          max-width: 360px;
          height: 56px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .btn-primary { background: #C2185B; color: #FFF; border: none; }
        .btn-primary:hover { background: #A3154D; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(194, 24, 91, 0.2); }
        
        .btn-secondary { background: transparent; color: #C2185B; border: 2px solid #C2185B; }
        .btn-secondary:hover { background: rgba(194, 24, 91, 0.05); transform: translateY(-2px); }
        
        .btn-tertiary { background: #F8F9FA; color: #191c1d; border: 1.5px solid #e1e3e4; }
        .btn-tertiary:hover { background: #f1f3f4; border-color: #C2185B; }

        .form-side::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}} />

      <div className="main-wrapper" style={{ display: 'flex', width: '100%', height: '100dvh', overflow: 'hidden' }}>
        {/* HERO SIDE: 50% width, No Cropping */}
        <div className="hero-side" style={{
          position: 'relative', width: '50%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden',
          backgroundColor: '#FFFFFF', zIndex: 1
        }}>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            <img 
              src={HERO_IMAGE} 
              alt="MaaSathi Illustration" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                objectPosition: 'center left',
                mixBlendMode: 'normal',
                border: 'none'
              }} 
            />
            {/* Soft Edge Mask - only if needed, but since it's white bg and contain it's already seamless */}
          </motion.div>
        </div>

        {/* CONTENT SIDE: 50% width, Static */}
        <div className="form-side" style={{
          width: '50%', height: '100dvh', position: 'relative',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 80px',
          backgroundColor: '#FFFFFF', overflow: 'hidden'
        }}>
          {/* Controls */}
          <div className="top-right-group" style={{ position: 'absolute', top: 32, right: 32, display: 'flex', gap: '8px', zIndex: 100 }}>
            <button onClick={() => toggleLanguage(language === 'en' ? 'te' : 'en')} style={{ padding: '6px 14px', borderRadius: '100px', border: '1px solid #e1e3e4', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{language.toUpperCase()}</button>
            <button onClick={toggleTheme} style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #e1e3e4', background: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {theme === 'light' ? <MdOutlineDarkMode size={18} /> : <MdOutlineLightMode size={18} />}
            </button>
          </div>

          <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
              <FaHeartbeat size={36} color="#C2185B" />
              <span style={{ fontSize: '30px', fontWeight: 900, color: '#191c1d', letterSpacing: '-1.5px' }}>MaaSathi</span>
            </div>

            {/* Typography */}
            <h1 className="welcome-title" style={{ margin: 0, marginBottom: '20px' }}>
              <p style={{ margin: 0, fontSize: '46px', fontWeight: 800, color: '#191c1d', lineHeight: 1.1, letterSpacing: '-2px' }}>
                A complete
              </p>
              <p style={{ margin: 0, fontSize: '46px', fontWeight: 800, color: '#C2185B', lineHeight: 1.1, letterSpacing: '-2px' }}>
                Healthcare Ecosystem.
              </p>
            </h1>
            
            <p style={{ fontSize: '18px', color: '#594045', lineHeight: 1.6, marginBottom: '40px', maxWidth: '440px' }}>
              Empowering every family with personalized maternal, elder, and community healthcare across India.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
