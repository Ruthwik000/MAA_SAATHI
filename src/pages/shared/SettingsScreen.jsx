import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSun, FaMoon, FaDesktop, FaCheck, FaSearch } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useFontSize } from '../../context/FontSizeContext';

// eslint-disable-next-line no-unused-vars
const ThemeCard = ({ icon: Icon, title, mode, currentMode, onSelect }) => (
  <div 
    onClick={() => onSelect(mode)}
    className={`flex flex-col items-center justify-center p-24 rounded-2xl cursor-pointer transition-all border-2 w-full h-full ${currentMode === mode ? 'border-accent bg-surface-lowest shadow-elevated scale-105' : 'border-border bg-surface hover:border-text-secondary scale-100'}`}
  >
    <Icon size={28} className={currentMode === mode ? 'text-accent mb-12' : 'text-secondary mb-12'} />
    <span className={`body font-bold text-center ${currentMode === mode ? 'text-accent' : 'text-primary'}`}>{title}</span>
  </div>
);

const SizeCard = ({ sizeValue, currentSize, label, onSelect }) => (
  <div 
    onClick={() => onSelect(sizeValue)}
    className={`flex items-center justify-between p-24 rounded-2xl cursor-pointer transition-all border-2 mb-12 ${currentSize === sizeValue ? 'border-accent bg-accent-light shadow-card scale-[1.02]' : 'border-border bg-surface hover:border-text-secondary'}`}
  >
    <span className={`body font-bold ${currentSize === sizeValue ? 'text-accent' : 'text-primary'}`}>{label}</span>
    {currentSize === sizeValue && <div className="w-16 h-16 rounded-full bg-accent" />}
  </div>
);

const SwitchToggle = ({ label, active, onToggle }) => (
  <div className="flex justify-between items-center py-24 cursor-pointer relative" onClick={onToggle}>
     <span className="body text-primary font-bold pr-16">{label}</span>
     <div className={`w-[56px] h-[32px] rounded-pill p-4 flex transition-colors ${active ? 'bg-accent' : 'bg-border'}`}>
        <div className={`w-[24px] h-[24px] bg-white rounded-full shadow-sm transition-transform transform ${active ? 'translate-x-[24px]' : 'translate-x-0'}`}></div>
     </div>
  </div>
);

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { fontSize, setFontSize } = useFontSize();
  const { logout } = useAuth();
  
  const [themeMode, setThemeMode] = useState('light');
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [toggles, setToggles] = useState({
    ringAlerts: true,
    surveyReminders: true,
    doctorReports: true
  });

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    const newTheme = mode === 'system' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') 
      : mode;
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleToggle = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex flex-col min-h-screen bg-secondary pb-[150px]">
      {/* Massive Search Bar & Header */}
      <div className="bg-primary px-24 pt-48 pb-24 sticky top-0 z-10 w-full flex flex-col gap-24 shadow-sm border-b border-border">
        <div className="flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="btn-ghost p-0 m-0 w-48 h-48 flex items-center justify-center rounded-full bg-secondary text-primary hover:bg-border transition-colors">
              <FaArrowLeft size={24} />
            </button>
            <div className="w-48 h-48 rounded-full bg-accent-light text-accent flex items-center justify-center font-bold text-[20px]">
              S
            </div>
        </div>
        
        <h1 className="display text-primary tracking-tight">App Settings</h1>

        <div className="relative w-full">
          <FaSearch className="absolute left-20 top-1/2 transform -translate-y-1/2 text-secondary" size={20} />
          <input 
            type="text" 
            placeholder="Search all settings..." 
            className="w-full h-64 pl-56 pr-24 rounded-2xl bg-secondary border-none text-[18px] text-primary focus:outline-none focus:ring-4 focus:ring-accent-light transition-all font-medium" 
          />
        </div>
      </div>

      <div className="max-w-xl mx-auto w-full p-24 flex flex-col gap-40 mt-16">
        
        {/* Language Section - Isolated Cards */}
        <section className="flex flex-col gap-16">
          <h2 className="h2 text-secondary mb-8">Language Options</h2>
          <div className="bg-surface rounded-2xl p-16 shadow-card border border-border">
            <div 
              onClick={() => toggleLanguage('en')}
              className={`p-24 rounded-xl cursor-pointer flex justify-between items-center transition-all ${language === 'en' ? 'bg-accent-light' : 'hover:bg-secondary'}`}
            >
              <span className={`body font-extrabold ${language === 'en' ? 'text-accent' : 'text-primary'}`}>English</span>
              {language === 'en' && <FaCheck className="text-accent" size={20} />}
            </div>
            <div className="h-[1px] w-[90%] mx-auto bg-border my-4"></div>
            <div 
              onClick={() => toggleLanguage('te')}
              className={`p-24 rounded-xl cursor-pointer flex justify-between items-center transition-all ${language === 'te' ? 'bg-accent-light' : 'hover:bg-secondary'}`}
            >
              <span className={`body font-extrabold ${language === 'te' ? 'text-accent' : 'text-primary'}`}>తెలుగు (Telugu)</span>
              {language === 'te' && <FaCheck className="text-accent" size={20} />}
            </div>
          </div>
        </section>

        {/* Global Text Size Selection */}
        <section className="flex flex-col gap-16">
          <h2 className="h2 text-secondary mb-8">Reading Experience</h2>
          
          <SizeCard sizeValue="small" currentSize={fontSize} label="Small (Compact)" onSelect={setFontSize} />
          <SizeCard sizeValue="medium" currentSize={fontSize} label="Medium (Default)" onSelect={setFontSize} />
          <SizeCard sizeValue="large" currentSize={fontSize} label="Large (Comfortable)" onSelect={setFontSize} />
          <SizeCard sizeValue="huge" currentSize={fontSize} label="Huge (Maximum Visibility)" onSelect={setFontSize} />
        </section>

        {/* Appearance Row grid */}
        <section className="flex flex-col gap-16">
          <h2 className="h2 text-secondary mb-8">System Theme</h2>
          <div className="grid grid-cols-3 gap-16">
            <ThemeCard icon={FaSun} title="Light" mode="light" currentMode={themeMode} onSelect={handleThemeChange} />
            <ThemeCard icon={FaMoon} title="Dark" mode="dark" currentMode={themeMode} onSelect={handleThemeChange} />
            <ThemeCard icon={FaDesktop} title="Auto" mode="system" currentMode={themeMode} onSelect={handleThemeChange} />
          </div>
        </section>

        {/* Notifications */}
        <section className="flex flex-col gap-16">
          <h2 className="h2 text-secondary mb-8">Alert Preferences</h2>
          <div className="bg-surface rounded-2xl px-24 py-8 border border-border shadow-card flex flex-col">
            <SwitchToggle label="Ring Alerts & Critical SOS" active={toggles.ringAlerts} onToggle={() => handleToggle('ringAlerts')} />
            <div className="w-full h-[1px] bg-border"></div>
            <SwitchToggle label="Daily Survey Reminders" active={toggles.surveyReminders} onToggle={() => handleToggle('surveyReminders')} />
            <div className="w-full h-[1px] bg-border"></div>
            <SwitchToggle label="AI Clinical Doctor Reports" active={toggles.doctorReports} onToggle={() => handleToggle('doctorReports')} />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="flex flex-col gap-24 mt-40 pb-64">
          <button 
            onClick={() => {
              logout();
              navigate('/welcome', { replace: true });
            }} 
            className="flex items-center justify-center w-full h-64 rounded-2xl bg-secondary text-primary font-extrabold body hover:bg-border transition-colors border border-border"
          >
            Logout Securely
          </button>
          
          <button 
            onClick={() => setShowConfirm(true)}
            className="caption text-danger hover:underline text-center w-full p-16"
          >
            PERMANENTLY DELETE ACCOUNT
          </button>
        </section>

      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-primary/95 backdrop-blur-md flex items-center justify-center p-24 z-50">
           <div className="bg-surface rounded-3xl p-32 max-w-sm w-full shadow-elevated border-2 border-danger-light">
             <h2 className="display text-danger mb-16" style={{ fontSize: '32px' }}>Warning</h2>
             <p className="body-large text-primary font-medium mb-32 leading-relaxed">This action is irreversible. All your clinical data, massive arrays, and survey history will be permanently wiped.</p>
             <div className="flex flex-col gap-16">
               <button onClick={() => {
                 alert("Account successfully deleted.");
                 logout();
                 navigate('/welcome', { replace: true });
               }} className="btn rounded-xl bg-danger text-white w-full h-56 font-extrabold text-[16px]">Confirm Wipe</button>
               <button onClick={() => setShowConfirm(false)} className="btn-secondary rounded-xl w-full h-56 font-bold text-[16px]">Cancel</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
