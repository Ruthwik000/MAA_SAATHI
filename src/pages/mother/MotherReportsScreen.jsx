import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilePdf, FaDownload, FaChevronRight, FaFilter } from 'react-icons/fa';
import MotherLayout from '../../layouts/MotherLayout';
import { useLanguage } from '../../context/LanguageContext';

const MOCK_REPORTS = [
  { id: 'r1', type: 'Antenatal Checkup', date: '12 Mar 2026', urgency: 'STABLE'   },
  { id: 'r2', type: 'Antenatal Checkup', date: '01 Feb 2026', urgency: 'MODERATE' },
  { id: 'r3', type: 'Blood Test Results', date: '15 Jan 2026', urgency: 'STABLE'   },
  { id: 'r4', type: 'Antenatal Checkup',  date: '10 Dec 2025', urgency: 'CRITICAL' },
];

const FILTER_TYPES = ['All', 'Pregnancy', 'Tests'];

const MotherReportsScreen = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('All');

  const t = {
    en: { title: "Health Reports", download: "Download PDF" },
    te: { title: "ఆరోగ్య నివేదికలు", download: "PDF డౌన్‌లోడ్ చేయండి" }
  };
  const text = t[language] || t.en;

  const cardStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '12px',
    display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer',
    transition: 'all 0.15s'
  };

  const urgencyColors = {
    STABLE:   { bg: 'var(--success-light)', color: 'var(--success)' },
    MODERATE: { bg: 'var(--warning-light)', color: 'var(--warning)' },
    CRITICAL: { bg: 'var(--danger-light)',  color: 'var(--danger)'  },
  };

  return (
    <MotherLayout>
      <header className="responsive-px" style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        paddingTop: '16px', paddingBottom: '16px', position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: '12px',
        paddingTop: 'calc(16px + env(safe-area-inset-top))'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <FaArrowLeft size={16} color="var(--text-primary)" />
        </button>
        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {text.title}
        </span>
      </header>

      <div className="responsive-px" style={{ paddingTop: '20px' }}>
        
        {/* Simplified Filters (Row of pills) */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
          {FILTER_TYPES.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '7px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
                border: '1.5px solid var(--border)', background: activeFilter === f ? 'var(--accent)' : 'transparent',
                color: activeFilter === f ? 'white' : 'var(--text-secondary)', cursor: 'pointer',
                borderColor: activeFilter === f ? 'var(--accent)' : 'var(--border)'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {MOCK_REPORTS.map(rep => {
          const uc = urgencyColors[rep.urgency];
          return (
            <div 
              key={rep.id} 
              style={cardStyle}
              onClick={() => navigate(`/report/${rep.id}`)}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                background: uc.bg, color: uc.color, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FaFilePdf size={22} />
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {rep.type}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{rep.date}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span style={{
                  padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.5px', background: uc.bg, color: uc.color
                }}>
                  {rep.urgency}
                </span>
                <FaDownload size={16} color="var(--text-tertiary)" />
              </div>
            </div>
          );
        })}
      </div>
    </MotherLayout>
  );
};

export default MotherReportsScreen;
