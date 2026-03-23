import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import AshaIllustration from '../../components/AshaIllustration';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslation();

  const handleLogin = (role) => {
    navigate('/login', { state: { role } });
  };

  // The local dictionary matrix has been removed as per instruction.
  // The 't' object from useTranslation will now be used directly.

  return (
    <div className="welcome-container">
      {/* Absolute Header with Toggles */}
      <div className="absolute-toggles-top-right flex items-center" style={{ gap: '16px', zIndex: 10 }}>
        
        {/* Language Toggles */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => toggleLanguage('en')}
            style={{
              padding: '6px 16px',
              borderRadius: '24px',
              border: '1px solid var(--text-primary)',
              backgroundColor: language === 'en' ? '#C2185B' : '#FFFFFF',
              color: language === 'en' ? '#FFFFFF' : 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
          >
            EN
          </button>
          <button 
            onClick={() => toggleLanguage('te')}
            style={{
              padding: '6px 16px',
              borderRadius: '24px',
              border: '1px solid var(--text-primary)',
              backgroundColor: language === 'te' ? '#C2185B' : '#FFFFFF',
              color: language === 'te' ? '#FFFFFF' : 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
          >
            TE
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleTheme}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--text-primary)',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: 'var(--text-primary)'
          }}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <MdOutlineDarkMode size={20} /> : <MdOutlineLightMode size={20} />}
        </button>
      </div>

      {/* Left Column - Medical Illustration */}
      <div className="welcome-left flex items-end justify-center">
        <img 
          src="/welcome_avatar.png" 
          alt="ASHA Worker" 
          className="w-full h-full object-contain"
          style={{ 
            maxHeight: '90%',
            objectPosition: 'bottom center',
            mixBlendMode: 'multiply'
          }} 
        />
      </div>

      {/* Right Column - Content */}
      <div className="welcome-right">
        <div className="welcome-content-wrapper">
          
          {/* Logo */}
          <div className="flex items-center" style={{ gap: '12px' }}>
             <FaHeartbeat size={32} color="#C2185B" />
             <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>MaaSathi</span>
          </div>

          {/* Headings */}
          <div style={{ marginTop: '32px' }}>
             <h1 style={{ margin: 0 }}>
               <span style={{ 
                 display: 'block', 
                 fontSize: '32px', 
                 fontWeight: 700, 
                 color: 'var(--text-primary)', 
                 lineHeight: 1.2,
                 marginTop: '16px'
               }}>
                 {t.auth.welcomeTitle1}
               </span>
               <span style={{ 
                 display: 'block', 
                 fontSize: '32px', 
                 fontWeight: 700, 
                 color: 'var(--accent)', 
                 lineHeight: 1.2,
                 marginTop: 0
               }}>
                 {t.auth.welcomeTitle2}
               </span>
             </h1>
             <p style={{ 
               fontSize: '16px', 
               fontWeight: 400,
               color: 'var(--text-secondary)',
               marginTop: '16px',
               lineHeight: 1.7,
               maxWidth: '420px',
               margin: '16px 0 0 0' // Explicitly override browser margins
             }}>
               {t.auth.welcomeSubtitle}
             </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
             <button 
               onClick={() => handleLogin('asha')}
               style={{
                 width: '100%',
                 height: '52px',
                 backgroundColor: '#C2185B',
                 color: '#FFFFFF',
                 border: 'none',
                 borderRadius: '10px',
                 fontSize: '15px',
                 fontWeight: 600,
                 cursor: 'pointer',
                 transition: 'all 0.2s ease'
               }}
             >
               {t.auth.loginAsAsha}
             </button>
             <button 
               onClick={() => handleLogin('doctor')}
               style={{
                 width: '100%',
                 height: '52px',
                 backgroundColor: 'transparent',
                 color: '#C2185B',
                 border: '1.5px solid #C2185B',
                 borderRadius: '10px',
                 fontSize: '15px',
                 fontWeight: 600,
                 cursor: 'pointer',
                 transition: 'all 0.2s ease'
               }}
             >
               {t.auth.loginAsDoctor}
             </button>
             <button 
               onClick={() => navigate('/mother-entry')}
               style={{
                 width: '100%',
                 height: '52px',
                 backgroundColor: 'var(--bg-secondary)',
                 color: 'var(--text-primary)',
                 border: '1.5px solid var(--border)',
                 borderRadius: '10px',
                 fontSize: '15px',
                 fontWeight: 600,
                 cursor: 'pointer',
                 transition: 'all 0.2s ease'
               }}
             >
               {t.auth.iAmMother}
             </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
