import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBell, FaUsers, FaUserMd } from 'react-icons/fa';

const NAV_ITEMS = [
  { label: 'Alerts',   icon: FaBell,   path: '/doctor/dashboard' },
  { label: 'Patients', icon: FaUsers,  path: '/doctor/patients'  },
  { label: 'Profile',  icon: FaUserMd, path: '/doctor/profile'   },
];

const DoctorLayout = ({ children }) => {
  const navigate    = useNavigate();
  const location    = useLocation();
  const currentPath = location.pathname;

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-secondary)',
      fontFamily: '"DM Sans", sans-serif',
      paddingBottom: 'calc(96px + env(safe-area-inset-bottom))',
      paddingTop: 'env(safe-area-inset-top)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)'
    }}>
      {/* Main content area */}
      {children}

      {/* ── Floating pill bottom nav ── */}
      <div style={{
        position: 'fixed', 
        bottom: 'calc(16px + env(safe-area-inset-bottom))',
        left: '24px', 
        right: '24px', 
        zIndex: 100, 
        pointerEvents: 'none'
      }}>
        <div style={{
          maxWidth: '480px', 
          margin: '0 auto', 
          pointerEvents: 'auto',
          background: 'var(--surface)', 
          border: '1px solid var(--border)',
          borderRadius: '100px', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          height: '64px', // Issue 1: height 64px
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-around', 
          padding: '0 8px',
        }}>
          {NAV_ITEMS.map(item => {
            const isActive = currentPath === item.path || (item.path !== '/doctor/dashboard' && currentPath.startsWith(item.path));
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center', 
                  gap: '2px', 
                  flex: 1, 
                  height: '100%',
                  background: 'transparent', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                  fontFamily: '"DM Sans", sans-serif', 
                  transition: 'color 0.15s',
                }}
              >
                <Icon size={22} />
                {isActive && (
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', marginTop: '1px' }} />
                )}
                <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.3px', marginTop: isActive ? '0' : '3px' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;
