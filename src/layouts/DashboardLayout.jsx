import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaMapMarkedAlt, FaUser, FaHeartbeat, FaSun, FaClock, FaExclamationCircle, FaChevronRight } from 'react-icons/fa';

const NAV_ITEMS = [
  { path: '/asha/dashboard', label: 'Home', icon: FaHome },
  { path: '/asha/patients', label: 'Patients', icon: FaUsers },
  { path: '/asha/village', label: 'Village', icon: FaMapMarkedAlt },
  { path: '/asha/profile', label: 'Profile', icon: FaUser },
];

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100dvh', fontFamily: '"DM Sans", sans-serif' }}>
    
      {/* GLOBAL OVERRIDES FOR SIDEBAR */}
      <style dangerouslySetInnerHTML={{__html: `
        .sidebar {
          width: 200px !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          height: 100dvh !important;
          background: var(--surface) !important;
          border-right: 1px solid var(--border) !important;
          display: flex !important;
          flex-direction: column !important;
          z-index: 50 !important;
          padding: 0 !important;
        }
        
        @media (min-width: 769px) {
          .dashboard-main {
            margin-left: 200px !important;
          }
          .md\\:hidden { display: none !important; }
          .md\\:flex { display: flex !important; }
        }

        @media (max-width: 768px) {
          .md\\:hidden { display: flex !important; }
          .md\\:flex { display: none !important; }
        }
        
        .side-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
          position: relative;
          background: transparent;
          color: var(--text-tertiary);
          border: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }
        
        .side-nav-item:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        
        .side-nav-item.active {
          background: var(--accent-light);
          color: var(--accent);
          font-weight: 600;
        }
        
        .side-nav-item.active .nav-icon {
          color: var(--accent) !important;
        }
        
        .side-nav-item:hover:not(.active) .nav-icon {
          color: var(--text-secondary) !important;
        }
        
        .side-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--accent);
          border-radius: 0 3px 3px 0;
        }
        
        .profile-bottom-card {
          margin: 0 10px 16px 10px;
          padding: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.15s;
        }
        
        .profile-bottom-card:hover {
          border-color: var(--accent);
          background: var(--accent-subtle);
        }
        
        .summary-card {
          margin: 12px 10px;
          background: var(--accent-subtle);
          border: 1px solid var(--accent-light);
          border-radius: var(--radius-lg);
          padding: 14px 12px;
        }
      `}} />

      {/* DESKTOP SIDEBAR */}
      <aside className="sidebar md:flex md-hidden">
         
         {/* SIDEBAR TOP — LOGO SECTION */}
         <div style={{
           padding: '20px 16px 16px 16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px',
           display: 'flex', alignItems: 'center', gap: '10px'
         }}>
           <FaHeartbeat size={24} color="var(--accent)" style={{ flexShrink: 0 }} />
           <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>MaaSathi</div>
         </div>

         {/* NAVIGATION ITEMS */}
         <nav style={{ padding: '4px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
           {NAV_ITEMS.map((item) => {
             const isActive = location.pathname === item.path;
             const Icon = item.icon;
             return (
               <button
                 key={item.label}
                 onClick={() => navigate(item.path)}
                 className={`side-nav-item ${isActive ? 'active' : ''}`}
               >
                 {isActive && <div className="side-indicator" />}
                 <Icon size={18} className="nav-icon" color={isActive ? "var(--accent)" : "var(--text-tertiary)"} style={{ flexShrink: 0, transition: 'color 0.15s' }} />
                 <span style={{ fontSize: '14px', fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}>{item.label}</span>
               </button>
             )
           })}
         </nav>

         {/* SIDEBAR MIDDLE — TODAY'S SUMMARY CARD */}
         <div className="summary-card">
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
             <FaSun size={14} color="var(--accent)" />
             <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Today</span>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column' }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(194,24,91,0.5)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                 <FaHome size={11} /> Visits
               </div>
               <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>4</div>
             </div>

             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(194,24,91,0.5)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                 <FaClock size={11} /> Pending
               </div>
               <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--warning)' }}>12</div>
             </div>

             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                 <FaExclamationCircle size={11} /> High Risk
               </div>
               <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--danger)' }}>3</div>
             </div>
           </div>
         </div>

         {/* SIDEBAR BOTTOM — ASHA WORKER PROFILE */}
         <div className="profile-bottom-card" onClick={() => navigate('/asha/profile')}>
           <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', color: 'white', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
             L
           </div>
           
           <div style={{ flex: 1, minWidth: 0 }}>
             <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Lakshmi</div>
             <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>ASHA Worker</div>
           </div>
           
           <FaChevronRight size={12} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
         </div>

      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main pb-80 md:pb-0" style={{ maxWidth: '100%', minHeight: '100dvh' }}>
        {children}
      </main>

      {/* Floating Bottom Nav for Mobile */}
      <nav className="bottom-nav md:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', background: 'var(--surface)', borderTop: '1px solid var(--border)', zIndex: 100, padding: '8px 16px', paddingBottom: 'calc(8px + env(safe-area-inset-bottom))' }}>
         {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
               <button
                 key={item.label}
                 onClick={() => navigate(item.path)}
                 style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: isActive ? 'var(--accent)' : 'var(--text-tertiary)' }}
               >
                 <Icon size={22} style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)', transition: 'color 0.15s' }} />
                 <span style={{ marginTop: '4px', fontSize: '10px', fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
               </button>
            )
          })}
      </nav>
    </div>
  );
};

export default DashboardLayout;
