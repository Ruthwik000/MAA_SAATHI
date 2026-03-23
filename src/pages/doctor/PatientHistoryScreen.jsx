import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaChevronDown, FaChevronUp, FaFilePdf } from 'react-icons/fa';
import DoctorLayout from '../../layouts/DoctorLayout';
import { useLanguage } from '../../context/LanguageContext';

const MOCK_PATIENTS = [
  {
    id: 'p1', name: 'Sunita Devi', village: 'Ramgarh', visits: 4,
    lastDate: '12 Mar 2026', risk: 'CRITICAL', type: 'Pregnancy',
    surveys: [
      { id: 's1', date: '12 Mar 2026', type: 'Antenatal Checkup', result: 'CRITICAL', pdf: true  },
      { id: 's2', date: '15 Feb 2026', type: 'Antenatal Checkup', result: 'MODERATE', pdf: true  },
    ]
  },
  {
    id: 'p2', name: 'Anjali Patel', village: 'Sila', visits: 2,
    lastDate: '08 Mar 2026', risk: 'MODERATE', type: 'Postnatal',
    surveys: [
      { id: 's3', date: '08 Mar 2026', type: 'Postnatal Checkup', result: 'MODERATE', pdf: true  },
      { id: 's4', date: '10 Jan 2026', type: 'Antenatal Checkup', result: 'STABLE',   pdf: false },
    ]
  },
  {
    id: 'p3', name: 'Priya Sharma', village: 'Ramgarh', visits: 6,
    lastDate: '01 Mar 2026', risk: 'STABLE', type: 'Pregnancy',
    surveys: [
      { id: 's5', date: '01 Mar 2026', type: 'Antenatal Checkup', result: 'STABLE', pdf: false },
    ]
  },
];

const FILTERS = ['All', 'Critical Only', 'Pregnancy', 'Postnatal', 'This Month'];

const riskStyles = {
  CRITICAL: { bg: 'var(--danger-light)',  color: 'var(--danger)',  label: 'CRITICAL' },
  MODERATE: { bg: 'var(--warning-light)', color: 'var(--warning)', label: 'MODERATE' },
  STABLE:   { bg: 'var(--success-light)', color: 'var(--success)', label: 'STABLE'   },
};

const PatientHistoryScreen = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId]     = useState(null);
  const [search, setSearch]             = useState('');

  const t = {
    en: {
      title: 'Patient History',
      search: 'Search patients...',
      visits: 'visits',
      lastReport: 'Last report:',
      surveyHistory: 'SURVEY HISTORY',
      download: 'Download',
      noPatients: 'No patients found',
    },
    te: {
      title: 'రోగి చరిత్ర',
      search: 'రోగులను శోధించండి...',
      visits: 'సందర్శనలు',
      lastReport: 'చివరి నివేదిక:',
      surveyHistory: 'సర్వే చరిత్ర',
      download: 'డౌన్‌లోడ్',
      noPatients: 'రోగులు కనుగొనబడలేదు',
    }
  };
  const text = t[language] || t.en;

  const filtered = MOCK_PATIENTS.filter(p => {
    const matchesFilter =
      activeFilter === 'All'          ? true :
      activeFilter === 'Critical Only'? p.risk === 'CRITICAL' :
      activeFilter === 'Pregnancy'    ? p.type === 'Pregnancy' :
      activeFilter === 'Postnatal'    ? p.type === 'Postnatal' : true;
    const q = search.toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.village.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <DoctorLayout>
      <style dangerouslySetInnerHTML={{__html: `
        .ph-search:focus { border-color: var(--accent) !important; outline: none; }
        .ph-card { cursor: pointer; transition: all 0.15s; }
        .ph-card:hover { border-color: var(--accent) !important; box-shadow: var(--shadow-card) !important; }
        .filter-scroll::-webkit-scrollbar { display: none; }
      `}} />

      {/* ── STICKY HEADER ── */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0
          }}
        >
          <FaArrowLeft size={16} color="var(--text-primary)" />
        </button>
        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {text.title}
        </span>
      </header>

      {/* ── SEARCH + FILTERS ── */}
      <div style={{ padding: '12px 24px 0 24px' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '0' }}>
          <FaSearch style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)', fontSize: '15px',
            color: 'var(--text-tertiary)', pointerEvents: 'none'
          }} />
          <input
            type="text"
            className="ph-search"
            placeholder={text.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', height: '48px', background: 'var(--surface)',
              border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
              paddingLeft: '44px', paddingRight: '16px', fontSize: '15px',
              fontFamily: '"DM Sans", sans-serif', color: 'var(--text-primary)',
              boxSizing: 'border-box', transition: 'border-color 0.15s'
            }}
          />
        </div>

        {/* Filter pills */}
        <div className="filter-scroll" style={{
          display: 'flex', gap: '8px', overflowX: 'auto',
          marginTop: '12px', paddingBottom: '12px'
        }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '7px 16px', borderRadius: '100px', whiteSpace: 'nowrap',
                fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                border: '1.5px solid var(--border)', transition: 'all 0.15s', flexShrink: 0,
                ...(activeFilter === f
                  ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' }
                  : { background: 'transparent', color: 'var(--text-secondary)' })
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── PATIENT CARDS ── */}
      <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.length === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '32px', textAlign: 'center',
            color: 'var(--text-tertiary)', fontSize: '15px'
          }}>
            {text.noPatients}
          </div>
        ) : (
          filtered.map(p => {
            const rs = riskStyles[p.risk] || riskStyles.STABLE;
            const isExpanded = expandedId === p.id;

            return (
              <div
                key={p.id}
                className="ph-card"
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                  transition: 'all 0.15s'
                }}
              >
                {/* Card header row */}
                <div
                  onClick={() => setExpandedId(prev => prev === p.id ? null : p.id)}
                  style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
                >
                  {/* Initials circle */}
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                    background: rs.bg, color: rs.color,
                    fontSize: '16px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {p.name.charAt(0)}
                  </div>

                  {/* Center info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                      {p.village} · {p.visits} {text.visits}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      {text.lastReport} {p.lastDate}
                    </div>
                  </div>

                  {/* Right: badge + chevron */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '100px',
                      fontSize: '11px', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      background: rs.bg, color: rs.color
                    }}>
                      {p.risk}
                    </span>
                    {isExpanded
                      ? <FaChevronUp size={14} color="var(--text-tertiary)" />
                      : <FaChevronDown size={14} color="var(--text-tertiary)" />}
                  </div>
                </div>

                {/* Expanded: survey history */}
                {isExpanded && (
                  <div style={{
                    borderTop: '1px solid var(--border-subtle)',
                    background: 'var(--bg-secondary)',
                    padding: '14px 20px',
                    display: 'flex', flexDirection: 'column', gap: '8px'
                  }}>
                    <div style={{
                      fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '1.5px', color: 'var(--text-tertiary)', marginBottom: '4px'
                    }}>
                      {text.surveyHistory}
                    </div>

                    {p.surveys.map(s => {
                      const ss = riskStyles[s.result] || riskStyles.STABLE;
                      return (
                        <div
                          key={s.id}
                          style={{
                            background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)', padding: '10px 14px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}
                        >
                          {/* Left: date + type */}
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                              {s.type}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{s.date}</span>
                              <span style={{
                                padding: '2px 8px', borderRadius: '100px',
                                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                                background: ss.bg, color: ss.color
                              }}>
                                {s.result}
                              </span>
                            </div>
                          </div>

                          {/* Right: PDF download */}
                          {s.pdf && (
                            <button
                              onClick={e => { e.stopPropagation(); }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                color: 'var(--accent)', background: 'none', border: 'none',
                                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                fontFamily: 'inherit'
                              }}
                            >
                              <FaFilePdf size={16} />
                              {text.download}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </DoctorLayout>
  );
};

export default PatientHistoryScreen;
