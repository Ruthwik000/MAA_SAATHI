import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaChevronRight, FaPlus, FaHome, FaClock } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { AppContext } from '../../context/AppContext';

const PatientListScreen = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { patients } = React.useContext(AppContext);

  const [search, setSearch]       = useState('');
  const [activeTab, setActiveTab] = useState('pregnant');

  const t = {
    en: {
      title: 'My Patients',
      searchPlaceholder: 'Search by name or house',
      tabPregnant: 'Pregnant Mothers',
      tabNewMother: 'New Mothers',
      noResults: 'No patients found',
      noResultsSub: 'Try a different name or add a new patient',
      addTitle: 'Add New Patient',
      addSub: 'Register a new patient',
    },
    te: {
      title: 'నా పేషెంట్లు',
      searchPlaceholder: 'పేరు లేదా ఇల్లు ద్వారా శోధించండి',
      tabPregnant: 'గర్భిణీ తల్లులు',
      tabNewMother: 'కొత్త తల్లులు',
      noResults: 'పేషెంట్లు కనుగొనబడలేదు',
      noResultsSub: 'వేరే పేరు వెతకండి లేదా కొత్త పేషెంట్ జోడించండి',
      addTitle: 'కొత్త పేషెంట్ జోడించండి',
      addSub: 'కొత్త పేషెంట్ నమోదు చేయండి',
    }
  };
  const text = t[language] || t.en;

  const getRiskColors = (risk) => {
    if (risk === 'HIGH') return { bg: 'var(--danger-light)',  color: 'var(--danger)'  };
    if (risk === 'MED')  return { bg: 'var(--warning-light)', color: 'var(--warning)' };
    return                      { bg: 'var(--success-light)', color: 'var(--success)' };
  };

  const getTypeColors = (type) => {
    if (type === 'pregnant')   return { bg: 'var(--accent-light)', color: 'var(--accent)' };
    if (type === 'newMother')  return { bg: 'var(--info-light)',   color: 'var(--info)'   };
    return                            { bg: 'var(--border)',        color: 'var(--text-primary)' };
  };

  // Normalize "Visited today" so "Visited" never appears twice
  const formatVisited = (dateStr) => {
    if (!dateStr) return '';
    if (/^visited/i.test(dateStr.trim())) return dateStr.trim();
    return `Visited ${dateStr}`;
  };

  // Color the last-visited text by recency
  const getVisitColor = (dateStr) => {
    const s = (dateStr || '').toLowerCase();
    if (s.includes('today') || s.includes('yesterday')) return 'var(--success)';
    const match = s.match(/(\d+)\s*(day|days)/);
    if (match && parseInt(match[1]) <= 7) return 'var(--warning)';
    return 'var(--danger)';
  };

  const filteredPatients = patients.filter(p => {
    const matchesTab = p.type === activeTab;
    const q = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      String(p.house || '').toLowerCase().includes(q) ||
      String(p.location || '').toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      minHeight: '100dvh',
      paddingBottom: '96px',
      fontFamily: '"DM Sans", sans-serif'
    }}>

      <style dangerouslySetInnerHTML={{__html: `
        .pl-search:focus { border-color: var(--accent) !important; outline: none; }
        .pl-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 14px 16px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .pl-card:hover {
          border-color: var(--accent);
          box-shadow: var(--shadow-card);
          transform: translateX(2px);
        }
        .pl-add-card {
          background: var(--surface);
          border: 1.5px dashed var(--accent);
          border-radius: var(--radius-lg);
          padding: 14px 16px;
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .pl-add-card:hover { background: var(--accent-subtle); }
      `}} />

      {/* ── STICKY HEADER ── */}
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 20px',
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Left: back circle + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        </div>

        {/* Right: EN / TE — two clean separate pills, never overlapping */}
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          {['en', 'te'].map(lang => (
            <button
              key={lang}
              onClick={() => toggleLanguage(lang)}
              style={{
                padding: '6px 14px', borderRadius: '100px',
                fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
                cursor: 'pointer', border: '1.5px solid var(--border)',
                transition: 'all 0.15s',
                ...(language === lang
                  ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' }
                  : { background: 'transparent', color: 'var(--text-secondary)' })
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* ── SEARCH BAR ── */}
      <div style={{ margin: '12px 20px', position: 'relative' }}>
        <FaSearch style={{
          position: 'absolute', left: '14px', top: '50%',
          transform: 'translateY(-50%)', fontSize: '15px',
          color: 'var(--text-tertiary)', pointerEvents: 'none'
        }} />
        <input
          type="text"
          className="pl-search"
          placeholder={text.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', height: '48px',
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            paddingLeft: '44px', paddingRight: '16px',
            fontSize: '15px', fontFamily: '"DM Sans", sans-serif',
            color: 'var(--text-primary)', boxSizing: 'border-box',
            transition: 'border-color 0.15s'
          }}
        />
      </div>

      {/* ── TAB PILLS ── */}
      <div style={{ margin: '0 20px 12px 20px', display: 'flex', gap: '8px' }}>
        {[
          { key: 'pregnant',  label: text.tabPregnant },
          { key: 'newMother', label: text.tabNewMother },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 20px', borderRadius: '100px',
              fontSize: '14px', fontWeight: 600, fontFamily: 'inherit',
              cursor: 'pointer', border: '1.5px solid var(--border)',
              transition: 'all 0.15s',
              ...(activeTab === tab.key
                ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' }
                : { background: 'transparent', color: 'var(--text-secondary)' })
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── PATIENT LIST ── */}
      <div style={{ padding: '0 20px' }}>
        {filteredPatients.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '48px 0'
          }}>
            <FaSearch size={40} color="var(--text-tertiary)" style={{ marginBottom: '14px', opacity: 0.4 }} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {text.noResults}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', textAlign: 'center' }}>
              {text.noResultsSub}
            </div>
          </div>
        ) : (
          filteredPatients.map(patient => {
            const { bg: riskBg, color: riskColor } = getRiskColors(patient.risk);
            const { bg: typeBg, color: typeColor }  = getTypeColors(patient.type);
            const visitedText  = formatVisited(patient.date);
            const visitedColor = getVisitColor(patient.date);

            return (
              <div
                key={patient.id}
                className="pl-card"
                onClick={() => navigate('/asha/patients/' + patient.id)}
              >
                {/* Avatar circle — type-based colors */}
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  fontSize: '16px', fontWeight: 700, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: typeBg, color: typeColor
                }}>
                  {patient.initials}
                </div>

                {/* Center info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)',
                    marginBottom: '3px', whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    {patient.name}
                  </div>

                  {/* Location row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaHome size={11} color="var(--text-tertiary)" />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {patient.location || `${patient.house}, ${patient.village}`}
                    </span>
                  </div>

                  {/* Last visited row — no duplicate "Visited" */}
                  {visitedText && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                      <FaClock size={11} color={visitedColor} />
                      <span style={{ fontSize: '13px', color: visitedColor, fontWeight: 500 }}>
                        {visitedText}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: risk badge + chevron */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '100px',
                    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.5px', background: riskBg, color: riskColor
                  }}>
                    {patient.risk}
                  </span>
                  <FaChevronRight size={14} color="var(--text-tertiary)" />
                </div>
              </div>
            );
          })
        )}

        {/* ── ADD NEW PATIENT CARD ── */}
        <div className="pl-add-card" onClick={() => navigate('/asha/patients/add')}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'var(--accent-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <FaPlus size={20} color="var(--accent)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--accent)' }}>
              {text.addTitle}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              {text.addSub}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientListScreen;
