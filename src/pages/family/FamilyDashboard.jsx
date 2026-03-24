import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, FaUsers, FaMapMarkedAlt, FaUser, 
  FaBell, FaHeartbeat, FaClock, FaChartLine, 
  FaFileMedical, FaDownload, FaPaperPlane, FaEye, 
  FaPhone, FaMapMarkerAlt, FaCheckCircle, FaTint,
  FaFilePdf
} from 'react-icons/fa';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { path: '/family-dashboard', label: 'Home', icon: FaHome },
  { path: '/family-patients',  label: 'Patients', icon: FaUsers },
  { path: '/family-alerts',    label: 'Alerts', icon: FaBell },
  { path: '/family-reports',   label: 'Reports', icon: FaFileMedical },
  { path: '/family-profile',   label: 'Profile', icon: FaUser },
];

const FamilyDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { profile } = useAuth();

  const userName = profile?.name?.split(' ')[0] || 'Lakshmi';
  const initial = (profile?.name || 'Lakshmi').charAt(0);
  
  // Mock data for matching design
  const [alerts] = useState([
    { id: 'al1', patient: 'Saraswathi Reddy', type: 'Ring SOS pressed', location: 'House 12, Ramgarh' }
  ]);

  const stats = [
    { label: 'HEART RATE', value: '78 bpm', color: 'var(--success)', icon: FaHeartbeat, iconBg: 'var(--danger-light)' },
    { label: 'SPO2', value: '98%', color: 'var(--info)', icon: FaTint, iconBg: 'var(--info-light)' },
    { label: 'LAST SEEN', value: '2 mins ago', color: 'var(--warning)', icon: FaClock, iconBg: 'var(--warning-light)' },
  ];

  const quickActions = [
    { label: 'View Vitals', sub: 'Heart rate and SpO2', icon: FaChartLine, bg: 'var(--accent-light)', path: '/family-vitals' },
    { label: 'View Reports', sub: 'Download and send to doctor', icon: FaFileMedical, bg: 'var(--info-light)', path: '/family-reports' },
    { label: 'Alert History', sub: 'All past alerts', icon: FaBell, bg: 'var(--warning-light)', path: '/family-alerts' },
    { label: 'Linked Patient', sub: 'Profile and details', icon: FaUser, bg: 'var(--success-light)', path: '/family-patient' },
  ];

  const dynamicDate = new Date().toLocaleDateString(language === 'te' ? 'te-IN' : 'en-IN', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

  return (
    <div className="family-dashboard-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
        .family-dashboard-wrapper {
          font-family: "DM Sans", sans-serif !important;
          background: var(--bg-secondary);
          min-height: 100dvh;
        }
        .family-dashboard-wrapper * {
          font-family: inherit;
        }
        .sidebar {
          width: 240px;
          position: fixed;
          top: 0;
          left: 0;
          height: 100dvh;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          z-index: 50;
        }
        .main-content {
          margin-left: 240px;
          padding: 32px 40px;
          min-height: 100dvh;
          max-width: 1400px;
        }
        .floating-bottom-nav {
          display: none;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 24px;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          border-radius: var(--radius-pill);
          margin: 4px 12px;
          font-size: 15px;
        }
        .nav-item.active {
          background: var(--accent-light);
          color: var(--accent);
          font-weight: 600;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .view-all {
          font-size: 14px;
          font-weight: 600;
          color: var(--accent);
          cursor: pointer;
        }
        .card-surface {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-card);
        }
        .stat-card {
           display: flex;
           flex-direction: column;
           gap: 8px;
           position: relative;
        }
        .quick-action-card {
           background: var(--surface);
           border-radius: var(--radius-lg);
           padding: 20px;
           display: flex;
           flex-direction: column;
           gap: 12px;
           cursor: pointer;
           transition: all 0.2s;
           border: 1.5px solid transparent;
        }
        .quick-action-card:hover { box-shadow: var(--shadow-elevated); transform: translateY(-2px); border-color: var(--accent); }
        
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main-content { margin-left: 0; padding: 20px 16px 100px 16px; }
          .floating-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 24px;
            left: 24px;
            right: 24px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 100px;
            box-shadow: var(--shadow-elevated);
            padding: 12px 16px;
            justify-content: space-around;
            z-index: 100;
          }
          .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            color: var(--text-tertiary);
            font-size: 10px;
            font-weight: 600;
          }
          .bottom-nav-item.active { color: var(--accent); }
        }
      `}} />

      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 24px', marginBottom: '40px' }}>
          <FaHeartbeat size={32} color="var(--accent)" />
          <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>MaaSathi</span>
        </div>
        <nav>
          {NAV_ITEMS.map(item => (
            <div 
              key={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              style={{ cursor: 'pointer' }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '2px', marginBottom: '8px' }}>{dynamicDate}</div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Namaste, {userName}</h1>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginTop: '4px' }}>You are watching over 1 loved one</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '100px', padding: '4px' }}>
                <button onClick={() => toggleLanguage('en')} style={{ padding: '6px 16px', borderRadius: '100px', border: 'none', background: language === 'en' ? 'var(--accent)' : 'transparent', color: language === 'en' ? 'white' : 'var(--text-secondary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>EN</button>
                <button onClick={() => toggleLanguage('te')} style={{ padding: '6px 16px', borderRadius: '100px', border: 'none', background: language === 'te' ? 'var(--accent)' : 'transparent', color: language === 'te' ? 'white' : 'var(--text-secondary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>TE</button>
             </div>
             
             <button onClick={toggleTheme} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {theme === 'light' ? <MdOutlineDarkMode size={20} /> : <MdOutlineLightMode size={20} />}
             </button>

             <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', border: '2px solid var(--accent-light)', cursor: 'pointer' }}>
                {initial}
             </div>
          </div>
        </header>

        {/* Emergency Alert Banner */}
        {alerts.length > 0 ? (
          <div style={{ backgroundColor: 'var(--danger)', borderRadius: 'var(--radius-lg)', padding: '24px 32px', marginBottom: '32px', color: 'white', position: 'relative' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>
                <FaBell /> EMERGENCY ALERT
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white' }} />
                <div style={{ flex: 1 }}>
                   <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>{alerts[0].patient}</div>
                   <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{alerts[0].type}</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                      <FaMapMarkerAlt /> {alerts[0].location}
                   </div>
                </div>
                <button style={{ padding: '10px 24px', borderRadius: '100px', border: '1.5px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                   View &gt;
                </button>
             </div>
          </div>
        ) : (
          <div style={{ backgroundColor: 'var(--success)', borderRadius: 'var(--radius-lg)', padding: '24px 32px', marginBottom: '32px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
             <FaCheckCircle size={20} />
             <div style={{ fontWeight: 600 }}>All Clear! No active alerts for your loved ones.</div>
          </div>
        )}

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
           {stats.map((stat, i) => (
             <div key={i} className="card-surface stat-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>{stat.label}</span>
                   <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: stat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <stat.icon color={stat.color} size={18} />
                   </div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
             </div>
           ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '40px' }}>
           <h2 className="section-title" style={{ marginBottom: '20px' }}>Quick Actions</h2>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {quickActions.map((action, i) => (
                <div key={i} className="quick-action-card" onClick={() => navigate(action.path)}>
                   <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <action.icon size={20} color="var(--accent)" />
                   </div>
                   <div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{action.label}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{action.sub}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Linked Patient Card */}
        <div style={{ marginBottom: '40px' }}>
           <div className="section-header">
              <span className="section-title">Linked Patient</span>
              <span className="view-all">View All</span>
           </div>
           <div className="card-surface" style={{ display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer' }}>
               <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '24px' }}>
                  SR
               </div>
               <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                     <span style={{ fontSize: '18px', fontWeight: 700 }}>Saraswathi Reddy</span>
                     <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'var(--bg-tertiary)', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Elderly · Diabetes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                     <span style={{ padding: '2px 10px', borderRadius: '100px', background: 'var(--success-light)', color: 'var(--success)', fontSize: '11px', fontWeight: 700 }}>LOW RISK</span>
                     <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Updated 2 mins ago</span>
                  </div>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)' }}>Ring Connected</span>
               </div>
           </div>
        </div>

        {/* Recent Reports */}
        <div style={{ marginBottom: '40px' }}>
           <h2 className="section-title" style={{ marginBottom: '20px' }}>Recent Reports</h2>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2].map(i => (
                <div key={i} className="card-surface" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaFilePdf size={24} color="var(--accent)" />
                   </div>
                   <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700 }}>Monthly Health Report — {i === 1 ? 'March' : 'February'} 2026</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Generated {i*2} days ago · Instant report</div>
                   </div>
                   <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FaDownload color="var(--text-primary)" size={16}/></button>
                      <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FaPaperPlane color="var(--text-primary)" size={16}/></button>
                      <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FaEye color="var(--text-primary)" size={16}/></button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* ASHA Worker Info Strip */}
        <div style={{ padding: '16px 20px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--info-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--info)' }}>
                 KM
              </div>
              <div>
                 <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>ASSIGNED ASHA WORKER</div>
                 <div style={{ fontSize: '15px', fontWeight: 600 }}>Kamala Meena</div>
                 <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Last visit: 3 days ago</div>
              </div>
           </div>
           <button style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--success-light)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <FaPhone color="var(--success)" size={20} />
           </button>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="floating-bottom-nav">
         {NAV_ITEMS.map(item => (
           <div 
             key={item.path} 
             className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
             onClick={() => navigate(item.path)}
           >
              <item.icon size={22} />
              <span>{item.label}</span>
           </div>
         ))}
      </nav>
    </div>
  );
};

export default FamilyDashboard;
