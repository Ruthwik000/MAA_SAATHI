import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHome, FaClock, FaUsers, FaBaby } from 'react-icons/fa';
import { MdPregnantWoman } from 'react-icons/md';
import { useLanguage } from '../../context/LanguageContext';

import { AppContext } from '../../context/AppContext';

const FILTERS = ["All", "High Risk", "Medium", "Low Risk", "Pregnant", "New Mothers"];

const VillageOverviewScreen = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  
  const villageName = "Ramgarh Village";
  const [activeFilter, setActiveFilter] = useState("All");

  const { patients } = React.useContext(AppContext);
  const total = patients.length;
  const highRisk = patients.filter(h => h.risk === 'HIGH').length;
  const safe = patients.filter(h => h.risk === 'LOW').length;

  const filteredHomes = patients.filter(h => {
    switch (activeFilter) {
      case 'High Risk': return h.risk === 'HIGH';
      case 'Medium': return h.risk === 'MED';
      case 'Low Risk': return h.risk === 'LOW';
      case 'Pregnant': return h.type === 'pregnant';
      case 'New Mothers': return h.type === 'newMother';
      default: return true;
    }
  });

  const getVisitColor = (dateStr) => {
    let s = dateStr.toLowerCase();
    if (s.includes('today') || s.includes('yesterday')) return 'var(--success)';
    if (s.includes('days') && parseInt(s.match(/\d+/)) <= 7) return 'var(--warning)';
    return 'var(--danger)'; 
  };

  const pCount = filteredHomes.filter(h => h.type === 'pregnant').length;
  const nmCount = filteredHomes.filter(h => h.type === 'newMother').length;

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100dvh', paddingBottom: '96px', fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* CSS Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .filter-scroll::-webkit-scrollbar { display: none; }
        
        .patient-card {
          background: var(--surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .patient-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: var(--shadow-elevated);
        }
        
        .p-cards-grid {
          padding: 8px 24px;
          display: grid;
          flex-direction: column;
          gap: 12px;
        }
        @media (min-width: 481px) {
          .p-cards-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .p-cards-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .p-cards-grid { grid-template-columns: 1fr; }
        }
      `}} />

      {/* STICKY HEADER */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 24px',
        position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} style={{
            width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-secondary)',
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}>
            <FaArrowLeft size={16} color="var(--text-primary)" />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Village Overview</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{villageName}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => toggleLanguage('en')} style={{
            padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
            border: '1.5px solid var(--border)', cursor: 'pointer',
            ...(language === 'en' ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' } : { background: 'transparent', color: 'var(--text-secondary)' })
          }}>EN</button>
          <button onClick={() => toggleLanguage('te')} style={{
            padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
            border: '1.5px solid var(--border)', cursor: 'pointer',
            ...(language === 'te' ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' } : { background: 'transparent', color: 'var(--text-secondary)' })
          }}>TE</button>
        </div>
      </header>

      {/* SUMMARY STRIP */}
      <div style={{
        background: 'var(--surface)', margin: '16px 24px 0 24px', borderRadius: 'var(--radius-xl)',
        padding: '20px 24px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0
      }}>
        <div style={{ borderRight: '1px solid var(--border-subtle)', padding: '0 20px', paddingLeft: 0, textAlign: 'center' }}>
           <div style={{ font: '32px "DM Sans"', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{total}</div>
           <div style={{ font: '11px "DM Sans"', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', marginTop: '6px' }}>Total</div>
        </div>
        <div style={{ borderRight: '1px solid var(--border-subtle)', padding: '0 20px', textAlign: 'center' }}>
           <div style={{ font: '32px "DM Sans"', fontWeight: 800, color: 'var(--danger)', lineHeight: 1 }}>{highRisk}</div>
           <div style={{ font: '11px "DM Sans"', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', marginTop: '6px' }}>High Risk</div>
        </div>
        <div style={{ padding: '0 20px', textAlign: 'center' }}>
           <div style={{ font: '32px "DM Sans"', fontWeight: 800, color: 'var(--success)', lineHeight: 1 }}>{safe}</div>
           <div style={{ font: '11px "DM Sans"', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', marginTop: '6px' }}>Safe</div>
        </div>
      </div>

      {/* FILTER PILLS ROW */}
      <div className="filter-scroll" style={{
        padding: '16px 24px 8px 24px', display: 'flex', gap: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch'
      }}>
        {FILTERS.map(f => {
          let style = {
            padding: '8px 16px', borderRadius: '100px', font: '13px "DM Sans"', fontWeight: 600,
            whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.15s',
            border: '1.5px solid var(--border)', flexShrink: 0
          };
          if (activeFilter === f) {
            if (f === 'High Risk') { style.background = 'var(--danger)'; style.borderColor = 'var(--danger)'; style.color = 'white'; }
            else if (f === 'Medium') { style.background = 'var(--warning)'; style.borderColor = 'var(--warning)'; style.color = 'white'; }
            else if (f === 'Low Risk') { style.background = 'var(--success)'; style.borderColor = 'var(--success)'; style.color = 'white'; }
            else { style.background = 'var(--accent)'; style.borderColor = 'var(--accent)'; style.color = 'white'; }
          } else {
            style.background = 'transparent'; style.color = 'var(--text-secondary)';
          }
          return <button key={f} onClick={() => setActiveFilter(f)} style={style}>{f}</button>
        })}
      </div>

      {/* SECTION HEADERS */}
      {(activeFilter === 'Pregnant' || activeFilter === 'All') && pCount > 0 && activeFilter === 'Pregnant' && (
         <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', margin: '12px 0 8px 0', padding: '0 24px' }}>
           Pregnant Mothers ({pCount})
         </div>
      )}
      {(activeFilter === 'New Mothers' || activeFilter === 'All') && nmCount > 0 && activeFilter === 'New Mothers' && (
         <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', margin: '12px 0 8px 0', padding: '0 24px' }}>
           New Mothers ({nmCount})
         </div>
      )}

      {/* PATIENT CARDS */}
      {filteredHomes.length === 0 ? (
        <div style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
             <FaUsers size={36} color="var(--text-tertiary)" />
           </div>
           <div style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', margin: '0 0 8px 0' }}>No patients found</div>
           <div style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>Try selecting a different filter</div>
        </div>
      ) : (
        <div className="p-cards-grid">
          {filteredHomes.map(h => {
             const riskColor = h.risk === 'HIGH' ? 'var(--danger)' : h.risk === 'MED' ? 'var(--warning)' : 'var(--success)';
             const riskBg = h.risk === 'HIGH' ? 'var(--danger-light)' : h.risk === 'MED' ? 'var(--warning-light)' : 'var(--success-light)';

             return (
               <div key={h.id} className="patient-card" onClick={() => navigate(`/asha/patients/${h.id}`)}>
                 {/* Top Risk Bar */}
                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: riskColor }} />
                 
                 <div style={{ padding: '16px', marginTop: '4px' }}>
                   {/* Top Row: Avatar & Badge */}
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: riskBg, color: riskColor }}>
                        {h.initials}
                      </div>
                      <div style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', background: riskBg, color: riskColor }}>
                        {h.risk}
                      </div>
                   </div>

                   {/* Patient Info */}
                   <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.name}</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <FaHome size={11} color="var(--text-tertiary)" />
                     <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{h.house}, {h.village}</span>
                   </div>
                   
                   {/* Last Visited */}
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                     <FaClock size={11} color="var(--text-tertiary)" />
                     <span style={{ fontSize: '12px', color: getVisitColor(h.date), fontWeight: 500 }}>{h.date}</span>
                   </div>

                   {/* Tag at bottom */}
                   <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                     {h.type === 'pregnant' ? (
                       <>
                         <MdPregnantWoman size={13} color="var(--accent)" />
                         <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>Pregnant</span>
                       </>
                     ) : (
                       <>
                         <FaBaby size={13} color="var(--info)" />
                         <span style={{ fontSize: '11px', color: 'var(--info)', fontWeight: 600 }}>New Mother</span>
                       </>
                     )}
                   </div>

                 </div>
               </div>
             );
          })}
        </div>
      )}

    </div>
  );
};

export default VillageOverviewScreen;
