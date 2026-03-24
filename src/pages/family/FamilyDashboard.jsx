import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, FaUsers, FaMapMarkedAlt, FaUser, 
  FaBell, FaHeartbeat, FaClock, FaChartLine, 
  FaFileMedical, FaDownload, FaPaperPlane, FaEye, 
  FaPhone, FaMapMarkerAlt, FaCheckCircle, FaTint,
  FaFilePdf, FaChevronRight, FaTimes, FaVial
} from 'react-icons/fa';
import { MdOutlineDarkMode, MdOutlineLightMode, MdNotificationsActive } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { generateProfessionalReport } from '../../utils/generatePdfReport';

const FamilyDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { profile } = useAuth();

  const [selectedReport, setSelectedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [alerts] = useState([
    { id: 'al1', patient: 'Saraswathi Reddy', type: 'Ring SOS pressed', location: 'House 12, Ramgarh' }
  ]);

  const userName = profile?.name?.split(' ')[0] || 'Lakshmi';
  const initial = (profile?.name || 'Lakshmi').charAt(0);
  const dynamicDate = new Date().toLocaleDateString(language === 'te' ? 'te-IN' : 'en-IN', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

  const NAV_ITEMS = [
    { path: '/family-dashboard', label: 'Home', icon: FaHome },
    { path: '/family-patients',  label: 'Patients', icon: FaUsers },
    { path: '/family-alerts',    label: 'Alerts', icon: FaBell },
    { path: '/family-reports',   label: 'Reports', icon: FaFileMedical },
    { path: '/family-profile',   label: 'Profile', icon: FaUser },
  ];

  const stats = [
    { label: 'HEART RATE', value: '78 bpm', color: 'var(--success)', icon: FaHeartbeat, iconBg: 'var(--danger-light)' },
    { label: 'SPO2', value: '98%', color: 'var(--info)', icon: FaTint, iconBg: 'var(--info-light)' },
    { label: 'LAST SEEN', value: '2 mins ago', color: 'var(--warning)', icon: FaClock, iconBg: 'var(--warning-light)' },
  ];

  const quickActions = [
    { label: 'View Vitals', sub: 'Heart rate & SpO2', icon: FaChartLine, bg: 'var(--accent-light)', path: '/family-vitals' },
    { label: 'View Reports', sub: 'Download reports', icon: FaFileMedical, bg: 'var(--info-light)', path: '/family-reports' },
    { label: 'Alert History', sub: 'All past alerts', icon: FaBell, bg: 'var(--warning-light)', path: '/family-alerts' },
    { label: 'Linked Patient', sub: 'Profile details', icon: FaUser, bg: 'var(--success-light)', path: '/family-patient' },
  ];

  const handleDownloadPdf = (rep) => {
    setIsGenerating(true);
    const reportProfile = { name: 'Saraswathi Reddy', age: 68, patientType: 'elderly', phc: 'Ramgarh PHC' };
    const reportSurvey = { aiStatus: 'STABLE', aiParagraphEnglish: `Intelligence analysis for ${rep?.month || 'March'} shows consistent cardiac health.` };
    generateProfessionalReport(reportProfile, [], reportSurvey, 'download');
    setIsGenerating(false);
  };

  return (
    <div className="family-dashboard-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
        .family-dashboard-wrapper {
          font-family: var(--font-main) !important;
          background: var(--bg-primary);
          min-height: 100vh;
          display: flex;
        }
        .sidebar {
          width: 80px;
          height: 100vh;
          position: fixed;
          top: 0; left: 0;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          align-items: center;
          padding: 32px 0;
          z-index: 1000;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 4px 0 24px rgba(0,0,0,0.02);
        }
        .sidebar:hover { width: 240px; align-items: flex-start; }
        
        .logo-box { 
          padding: 0 24px; margin-bottom: 48px; 
          display: flex; align-items: center; gap: 12px; 
          width: 100%; overflow: hidden;
        }
        .logo-label { display: none; font-size: 20px; font-weight: 800; color: var(--accent); white-space: nowrap; }
        .sidebar:hover .logo-label { display: block; }

        .nav-link {
          width: 100%; display: flex; align-items: center; gap: 16px;
          padding: 16px 28px; color: var(--text-tertiary);
          text-decoration: none; transition: all 0.2s;
          cursor: pointer; overflow: hidden;
        }
        .nav-link.active {
          color: var(--accent);
          background: var(--accent-light);
          border-right: 3px solid var(--accent);
        }
        .nav-text { display: none; font-weight: 700; font-size: 14px; white-space: nowrap; }
        .sidebar:hover .nav-text { display: block; }

        .main-container {
          flex: 1;
          margin-left: 80px;
          padding: 24px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .content-width {
          width: 100%;
          max-width: 1100px;
        }

        .header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        
        .alert-strip {
          background: var(--danger); border-radius: 16px;
          padding: 20px 28px; color: white;
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 32px; box-shadow: 0 8px 16px rgba(186, 26, 26, 0.15);
        }
        
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }
        .stat-box { 
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 20px;
          display: flex; flex-direction: column; gap: 4px;
        }

        .actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
        .action-item {
          background: var(--surface); border: 1.5px solid var(--border);
          padding: 16px; border-radius: 16px;
          display: flex; align-items: center; gap: 12px; cursor: pointer;
          transition: all 0.2s;
        }
        .action-item:hover { border-color: var(--accent); background: var(--accent-subtle); transform: translateY(-2px); }

        .patient-strip {
          background: var(--surface); border: 1px solid var(--border);
          padding: 16px 24px; border-radius: 20px;
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 32px;
        }

        .report-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
        .report-card {
           background: var(--surface); border: 1px solid var(--border);
           padding: 16px; border-radius: 16px;
           display: flex; align-items: center; gap: 16px;
        }

        @media (max-width: 1024px) {
           .main-container { padding: 20px; }
           .stat-grid, .actions-grid { grid-template-columns: 1fr; }
        }
      `}} />

      {/* --- SIDEBAR --- */}
      <nav className="sidebar">
        <div className="logo-box">
          <FaHeartbeat size={32} color="var(--accent)" />
          <span className="logo-label">MaaSathi</span>
        </div>
        <div style={{ width: '100%', flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <div 
              key={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={22} style={{ minWidth: '24px' }} />
              <span className="nav-text">{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '24px 0' }}>
           <div onClick={toggleTheme} style={{ cursor: 'pointer', color: 'var(--text-tertiary)' }}>
              {theme === 'light' ? <MdOutlineDarkMode size={22} /> : <MdOutlineLightMode size={22} />}
           </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="main-container">
        <div className="content-width">
          <header className="header-bar">
            <div>
               <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>{dynamicDate}</div>
               <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>Namaste, {userName}</h1>
               <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Monitoring 1 loved one • Fully Connected</p>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignPosition: 'center', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '18px' }}>
               {initial}
            </div>
          </header>

          {/* EMERGENCY ALERT */}
          {alerts.length > 0 && (
            <div className="alert-strip">
               <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <MdNotificationsActive size={28} />
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800 }}>{alerts[0].patient}</div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>{alerts[0].type} • {alerts[0].location}</div>
                  </div>
               </div>
               <button onClick={() => navigate('/family-alerts')} style={{ background: 'white', color: 'var(--danger)', padding: '10px 24px', borderRadius: '100px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>View Status</button>
            </div>
          )}

          {/* VITALS */}
          <div className="stat-grid">
             {stats.map((stat, i) => (
               <div key={i} className="stat-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                     <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)' }}>{stat.label}</span>
                     <stat.icon color={stat.color} size={16} />
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800 }}>{stat.value}</div>
               </div>
             ))}
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ marginBottom: '32px' }}>
             <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Quick Actions</h3>
             <div className="actions-grid">
               {quickActions.map((action, i) => (
                 <div key={i} className="action-item" onClick={() => navigate(action.path)}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: action.bg, display: 'flex', alignPosition: 'center', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                      <action.icon size={18} color="var(--accent)" />
                   </div>
                   <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>{action.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{action.sub}</div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* PATIENT MONITOR */}
          <div className="patient-strip">
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignPosition: 'center', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '20px' }}>SR</div>
                <div>
                   <div style={{ fontSize: '18px', fontWeight: 800 }}>Saraswathi Reddy</div>
                   <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Elderly • Diabetes • Ward 12</div>
                </div>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }} />
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--success)' }}>STABLE</span>
             </div>
             <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => window.location.href='tel:+91 9999999999'} style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--bg-secondary)', border: 'none', display: 'flex', alignPosition: 'center', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}><FaPhone size={18}/></button>
                <button onClick={() => navigate('/family-vitals')} style={{ width: '44px', height: '44px', borderRadius: '100px', background: 'var(--accent)', border: 'none', display: 'flex', alignPosition: 'center', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}><FaChartLine color="white" size={18}/></button>
             </div>
          </div>

          {/* REPORTS */}
          <div>
             <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Intelligence Reports</h3>
             <div className="report-section">
                {[
                  { id: 'rep1', month: 'March', date: '24' },
                  { id: 'rep2', month: 'February', date: '17' }
                ].map(rep => (
                  <div key={rep.id} className="report-card">
                     <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-light)', display: 'flex', alignPosition: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <FaFilePdf size={22} color="var(--accent)" />
                     </div>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: 800 }}>{rep.month} Summary</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Mar {rep.date}, 2026</div>
                     </div>
                     <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setSelectedReport(rep)} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', display: 'flex', alignPosition: 'center', justifyContent: 'center', alignItems: 'center' }}><FaEye size={14}/></button>
                        <button onClick={() => handleDownloadPdf(rep)} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', display: 'flex', alignPosition: 'center', justifyContent: 'center', alignItems: 'center' }}><FaDownload size={14}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
           <div style={{ background: 'var(--surface)', width: '100%', maxWidth: '450px', borderRadius: '24px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '24px', background: 'var(--accent)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{selectedReport.month} Insight</h2>
                 <FaTimes onClick={() => setSelectedReport(null)} style={{ cursor: 'pointer' }} />
              </div>
              <div style={{ padding: '24px' }}>
                 <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                    Critical health parameters for Saraswathi Reddy remained within normal ranges during {selectedReport.month}. 
                    No anomalies were detected by ASTR (Advanced Sensor Tracking & Reporting).
                 </p>
                 <button onClick={() => handleDownloadPdf(selectedReport)} style={{ width: '100%', height: '52px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>Download Clinical PDF</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FamilyDashboard;
