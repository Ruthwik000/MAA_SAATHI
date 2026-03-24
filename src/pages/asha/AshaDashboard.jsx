import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClipboardList, FaUserPlus, FaMapMarkedAlt, FaTrophy, FaChevronRight, FaHeartbeat, FaHome, FaUsers, FaUser, FaBell, FaRing, FaMapMarkerAlt, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { AppContext } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

const NAV_ITEMS = [
  { path: '/asha/dashboard', label: 'Home', icon: FaHome },
  { path: '/asha/patients', label: 'Patients', icon: FaUsers },
  { path: '/asha/village', label: 'Village', icon: FaMapMarkedAlt },
  { path: '/asha/profile', label: 'Profile', icon: FaUser },
];

const AshaDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslation();

  const { patients, currentUser } = React.useContext(AppContext);
  const ashaName = currentUser?.name?.split(' ')[0] || 'Lakshmi';
  const [activeAlert] = useState(true);
  const [avatarError, setAvatarError] = useState(false);

  const priorityHomes = patients.slice(0, 3);
  const dynamicDate = new Date().toLocaleDateString(language === 'te' ? 'te-IN' : 'en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="asha-page-wrapper" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .asha-page-wrapper {
          font-family: "DM Sans", sans-serif !important;
        }
        .asha-page-wrapper * {
          font-family: inherit;
        }
        .asha-sidebar {
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
        .asha-main {
          margin-left: 240px;
          padding: 32px 40px;
          background: var(--bg-secondary);
          min-height: 100dvh;
          max-width: 100%;
          padding-bottom: 40px;
        }
        .asha-bottom-nav {
          display: none;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
          background: transparent;
          color: var(--text-secondary);
          border: none;
          width: 100%;
          text-align: left;
          font-size: 15px;
          font-weight: 500;
        }
        .nav-item svg { color: var(--text-tertiary); }
        .nav-item:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        .nav-item:hover svg { color: var(--text-secondary); }
        .nav-item.active {
          background: var(--accent-light);
          color: var(--accent);
          font-weight: 600;
        }
        .nav-item.active svg { color: var(--accent); }

        @keyframes alertPulse {
          0% { box-shadow: 0 0 0 0 rgba(198,40,40,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(198,40,40,0); }
          100% { box-shadow: 0 0 0 0 rgba(198,40,40,0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes sosPulse {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.6); }
          70% { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }

        .stat-card-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        .quick-action-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 32px;
        }
        .quick-card {
          border-radius: var(--radius-lg);
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .quick-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-elevated);
        }

        .patient-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .patient-card:hover {
          border-color: var(--accent);
          box-shadow: var(--shadow-card);
          transform: translateX(2px);
        }

        @media (max-width: 768px) {
          .asha-sidebar { display: none !important; }
          .asha-main { margin-left: 0 !important; padding: 16px 16px !important; padding-bottom: 120px !important; }
          .asha-bottom-nav { 
            display: flex !important; 
            position: fixed !important; 
            bottom: 0 !important; left: 0 !important; right: 0 !important; 
            background: var(--surface) !important; 
            border-top: 1px solid var(--border) !important; 
            padding: 12px 16px !important;
            padding-bottom: calc(12px + env(safe-area-inset-bottom)) !important;
            justify-content: space-around !important; 
            z-index: 50 !important; 
          }
          .bottom-nav-item {
            display: flex; flex-direction: column; align-items: center; gap: 4px;
            background: transparent; border: none; color: var(--text-secondary);
          }
          .bottom-nav-item.active { color: var(--accent); }
          .bottom-nav-item svg { font-size: 22px; color: inherit; }
          .bottom-nav-item span { font-size: 10px; font-weight: 500; }
          
          .stat-card-row { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .stat-card-row > div:last-child { grid-column: span 2 !important; }
          
          .quick-action-row { grid-template-columns: 1fr !important; gap: 10px !important; }
          .quick-card { padding: 16px !important; flex-direction: row !important; align-items: center !important; gap: 16px !important; }
          .quick-card div:first-child { flex-shrink: 0 !important; }
          
          header { flex-direction: column !important; gap: 16px !important; align-items: flex-start !important; }
          .asha-greeting { font-size: 28px !important; }
          .header-right { width: 100% !important; justify-content: space-between !important; margin-top: 8px !important; }
          
          .emergency-card { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .emergency-card button { width: 100% !important; }
          
          .patient-card { gap: 12px !important; padding: 12px 14px !important; }
          .patient-card .card-center { min-width: 0 !important; }
          .patient-card .card-right { flex-direction: column !important; align-items: flex-end !important; gap: 6px !important; }
          .patient-card .card-meta { flex-direction: column !important; align-items: flex-start !important; gap: 2px !important; }
          .patient-card .card-meta > div:nth-child(2) { display: none !important; } /* Hide the dot on mobile */
        }
      `}} />

      {/* Sidebar (Desktop) */}
      <aside className="asha-sidebar">
        <div style={{ padding: '0 24px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaHeartbeat size={24} color="var(--accent)" />
          <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>MaaSathi</span>
        </div>
        <nav style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button 
                key={item.label} 
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={20} />
                <span>{item.label === 'Home' ? t.nav.home : item.label === 'Patients' ? t.nav.patients : item.label === 'Village' ? t.nav.village : t.nav.profile}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Bottom Nav (Mobile) */}
      <nav className="asha-bottom-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button 
              key={item.label} 
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon />
              <span>{item.label === 'Home' ? t.nav.home : item.label === 'Patients' ? t.nav.patients : item.label === 'Village' ? t.nav.village : t.nav.profile}</span>
            </button>
          )
        })}
      </nav>

      {/* Main Content */}
      <main className="asha-main">
        {/* Top Bar */}
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
          {/* Left Side */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-tertiary)', marginBottom: '6px' }}>{dynamicDate}</div>
            <div className="asha-greeting" style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>{t.dashboard.greeting(ashaName)}</div>
            <div style={{ fontSize: '15px', fontWeight: 400, color: 'var(--text-secondary)', marginTop: '6px' }}>{t.dashboard.visitsToday(4)}</div>
          </div>
          
          {/* Right Side */}
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => toggleLanguage('en')} style={{
                padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
                border: '1.5px solid var(--border)', cursor: 'pointer',
                ...(language === 'en' ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' } : { background: 'transparent', color: 'var(--text-secondary)' })
              }}>EN</button>
              <button onClick={() => toggleLanguage('te')} style={{
                padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
                border: '1.5px solid var(--border)', cursor: 'pointer',
                ...(language === 'te' ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' } : { background: 'transparent', color: 'var(--text-secondary)' })
              }}>TE</button>
            </div>
            {/* Avatar — shows photo if available, initials otherwise */}
            <div
              onClick={() => navigate('/asha/profile')}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'var(--accent)', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: '2px solid var(--accent-light)',
                flexShrink: 0
              }}
            >
              {currentUser?.photoURL && !avatarError ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  onError={() => setAvatarError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>
                  {(currentUser?.name || ashaName).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Emergency Alert Card */}
        {activeAlert && (
          <div className="emergency-card" style={{
            width: '100%',
            background: 'var(--danger)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            cursor: 'pointer',
            animation: 'alertPulse 2s infinite',
            boxSizing: 'border-box'
          }} onClick={() => navigate('/shared/ring-alert')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'white', boxShadow: '0 0 0 0 rgba(255,255,255,0.4)', animation: 'sosPulse 1.5s infinite', flexShrink: 0 }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.85)', marginBottom: '8px' }}>
                  <FaBell size={14} color="white" /> {t.dashboard.emergencyAlert}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '6px' }}>Meera Bai</div>
                <div style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '100px', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <FaRing size={12} color="white" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>{t.dashboard.ringSOSPressed}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '8px' }}>
                  <FaMapMarkerAlt size={12} color="white" /> House 12, Ramgarh
                </div>
              </div>
            </div>
            <button style={{
              background: 'white',
              color: 'var(--danger)',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {t.dashboard.view} <FaChevronRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="stat-card-row">
          <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <FaHome style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '20px', color: 'var(--success)', opacity: 0.4 }} />
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-tertiary)' }}>{t.dashboard.villageCoverage}</div>
            <div style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1, color: 'var(--success)' }}>84%</div>
          </div>
          <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <FaCalendarAlt style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '20px', color: 'var(--warning)', opacity: 0.4 }} />
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-tertiary)' }}>{t.dashboard.pendingVisits}</div>
            <div style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1, color: 'var(--warning)' }}>12</div>
          </div>
          <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <FaFileAlt style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '20px', color: 'var(--accent)', opacity: 0.4 }} />
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-tertiary)' }}>{t.dashboard.reportsSent}</div>
            <div style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1, color: 'var(--accent)' }}>7</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.dashboard.quickActions}</div>
          </div>
          <div className="quick-action-row">
            <button className="quick-card" style={{ background: '#FFF0F5' }} onClick={() => navigate('/checkup/select-patient')}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-light)' }}>
                <FaClipboardList size={22} color="var(--accent)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0', textAlign: 'left' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{t.dashboard.startCheckup}</div>
                <div style={{ fontSize: '12px', fontWeight: 400, color: 'var(--accent)' }}>{t.dashboard.startCheckupSub}</div>
              </div>
            </button>
            <button className="quick-card" style={{ background: '#F0FFF4' }} onClick={() => navigate('/asha/patients/add')}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--success-light)' }}>
                <FaUserPlus size={22} color="var(--success)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0', textAlign: 'left' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{t.dashboard.addPatient}</div>
                <div style={{ fontSize: '12px', fontWeight: 400, color: 'var(--success)' }}>{t.dashboard.addPatientSub}</div>
              </div>
            </button>
            <button className="quick-card" style={{ background: '#EFF6FF' }} onClick={() => navigate('/asha/village')}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--info-light)' }}>
                <FaMapMarkedAlt size={22} color="var(--info)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0', textAlign: 'left' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{t.dashboard.villageMap}</div>
                <div style={{ fontSize: '12px', fontWeight: 400, color: 'var(--info)' }}>{t.dashboard.villageMapSub}</div>
              </div>
            </button>
            <button className="quick-card" style={{ background: '#FFFBEB' }} onClick={() => navigate('/asha/incentives')}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--warning-light)' }}>
                <FaTrophy size={22} color="var(--warning)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0', textAlign: 'left' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{t.dashboard.myIncentives}</div>
                <div style={{ fontSize: '12px', fontWeight: 400, color: 'var(--warning)' }}>{t.dashboard.myIncentivesSub}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Priority Homes */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.dashboard.priorityHomes}</div>
            <div onClick={() => navigate('/asha/patients')} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)', cursor: 'pointer', textDecoration: 'none' }}>{t.common.viewAll}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {priorityHomes.map((home) => {
              const bg = home.risk === 'HIGH' ? 'var(--danger-light)' : home.risk === 'MED' ? 'var(--warning-light)' : 'var(--success-light)';
              const color = home.risk === 'HIGH' ? 'var(--danger)' : home.risk === 'MED' ? 'var(--warning)' : 'var(--success)';
              return (
                <div key={home.id} className="patient-card" onClick={() => navigate(`/asha/patients/${home.id}`)}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, flexShrink: 0, background: bg, color: color }}>
                    {home.initials}
                  </div>
                  <div className="card-center" style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{home.name}</div>
                    <div className="card-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{home.location}</span>
                      <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--text-tertiary)' }} />
                      <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>{t.patient.lastVisited} {home.date}</span>
                    </div>
                  </div>
                  <div className="card-right" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', background: bg, color: color }}>
                      {home.risk === 'HIGH' ? t.common.high : home.risk === 'MED' ? t.common.medium : t.common.low}
                    </span>
                    <FaChevronRight size={14} color="var(--text-tertiary)" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AshaDashboard;
