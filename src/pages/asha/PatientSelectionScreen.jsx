import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaChevronRight, FaUserPlus, FaHome, FaClock } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { AppContext } from '../../context/AppContext';

const PatientSelectionScreen = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { patients } = React.useContext(AppContext);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('pregnant');

  const UI = {
    en: {
      title: 'Select Patient',
      searchPlaceholder: 'Search by name or house number',
      tabPregnant: 'Pregnant Mothers',
      tabNew: 'New Mothers',
      noResults: 'No patients found',
      noResultsSub: 'Try a different name or add a new patient',
      addNew: 'Add New Patient',
      addNewSub: 'Register a new patient to begin',
      houseLabel: 'House',
    },
    te: {
      title: 'పేషెంట్ ఎంచుకోండి',
      searchPlaceholder: 'పేరు లేదా ఇంటి నంబర్ వెతకండి',
      tabPregnant: 'గర్భిణీ తల్లులు',
      tabNew: 'నూతన తల్లులు',
      noResults: 'పేషెంట్లు కనుగొనబడలేదు',
      noResultsSub: 'వేరే పేరు వెతకండి లేదా కొత్త పేషెంట్ జోడించండి',
      addNew: 'కొత్త పేషెంట్ జోడించండి',
      addNewSub: 'తనిఖీ ప్రారంభించడానికి కొత్త పేషెంట్ నమోదు చేయండి',
      houseLabel: 'ఇల్లు',
    }
  };

  const t = UI[language] || UI.en;

  const filteredPatients = patients.filter(p => {
    const matchesTab = p.type === activeTab;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchLower) ||
      String(p.house).includes(searchLower);
    return matchesTab && matchesSearch;
  });

  const getRiskColors = (risk) => {
    if (risk === 'HIGH') return { bg: 'var(--danger-light)', color: 'var(--danger)' };
    if (risk === 'MED')  return { bg: 'var(--warning-light)', color: 'var(--warning)' };
    return { bg: 'var(--success-light)', color: 'var(--success)' };
  };

  // Normalize last visited: strip any leading "Visited " if it's already inside p.date
  const formatLastVisited = (dateStr) => {
    if (!dateStr) return '';
    // If dateStr already starts with "Visited" (case insensitive), return as-is
    if (/^visited/i.test(dateStr.trim())) return dateStr.trim();
    return `Visited ${dateStr}`;
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      minHeight: '100dvh',
      paddingBottom: '96px',
      fontFamily: '"DM Sans", sans-serif',
      paddingTop: 'env(safe-area-inset-top)'
    }}>

      <style dangerouslySetInnerHTML={{__html: `
        .ps-search-input { outline: none; transition: border-color 0.15s; }
        .ps-search-input:focus { border-color: var(--accent) !important; }
        .ps-patient-card {
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
        .ps-patient-card:hover {
          border-color: var(--accent);
          box-shadow: var(--shadow-card);
          transform: translateX(2px);
        }
        .ps-add-card {
          background: var(--surface);
          border: 1.5px dashed var(--accent);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          margin-top: 4px;
          transition: all 0.15s;
        }
        .ps-add-card:hover {
          background: var(--accent-subtle);
        }
      `}} />

      {/* ── STICKY HEADER ── */}
      <header className="responsive-px" style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        paddingTop: '16px', paddingBottom: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 'calc(16px + env(safe-area-inset-top))'
      }}>
        {/* Left: back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <FaArrowLeft size={16} color="var(--text-primary)" />
          </button>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {t.title}
          </span>
        </div>

        {/* Right: language pills */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={() => toggleLanguage('en')}
            style={{
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              border: '1.5px solid var(--border)',
              transition: 'all 0.15s',
              ...(language === 'en'
                ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' }
                : { background: 'transparent', color: 'var(--text-secondary)' })
            }}
          >EN</button>
          <button
            onClick={() => toggleLanguage('te')}
            style={{
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              border: '1.5px solid var(--border)',
              transition: 'all 0.15s',
              ...(language === 'te'
                ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' }
                : { background: 'transparent', color: 'var(--text-secondary)' })
            }}
          >TE</button>
        </div>
      </header>

      {/* ── SEARCH BAR ── */}
      <div className="responsive-mx" style={{ marginTop: '16px', position: 'relative' }}>
        <FaSearch style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '15px',
          color: 'var(--text-tertiary)',
          pointerEvents: 'none'
        }} />
        <input
          type="text"
          className="ps-search-input"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            height: '48px',
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            paddingLeft: '44px',
            paddingRight: '16px',
            fontSize: '15px',
            fontFamily: '"DM Sans", sans-serif',
            color: 'var(--text-primary)',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* ── TAB PILLS ── */}
      <div className="responsive-mx" style={{ margin: '16px 0', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('pregnant')}
          style={{
            padding: '8px 20px',
            borderRadius: '100px',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            border: '1.5px solid var(--border)',
            transition: 'all 0.15s',
            ...(activeTab === 'pregnant'
              ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' }
              : { background: 'transparent', color: 'var(--text-secondary)' })
          }}
        >
          {t.tabPregnant}
        </button>
        <button
          onClick={() => setActiveTab('newMother')}
          style={{
            padding: '8px 20px',
            borderRadius: '100px',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            border: '1.5px solid var(--border)',
            transition: 'all 0.15s',
            ...(activeTab === 'newMother'
              ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' }
              : { background: 'transparent', color: 'var(--text-secondary)' })
          }}
        >
          {t.tabNew}
        </button>
      </div>

      {/* ── PATIENT LIST ── */}
      <div className="responsive-px" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {filteredPatients.length > 0 ? (
          filteredPatients.map(p => {
            const { bg: riskBg, color: riskColor } = getRiskColors(p.risk);
            const lastVisited = formatLastVisited(p.date);

            return (
              <div
                key={p.id}
                className="ps-patient-card"
                onClick={() => navigate('/checkup/select-type', { state: { patientId: p.id } })}
              >
                {/* Initials circle — risk-based colors */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  fontSize: '16px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: riskBg,
                  color: riskColor
                }}>
                  {p.initials}
                </div>

                {/* Center content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {p.name}
                  </div>

                  {/* Location row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaHome size={11} color="var(--text-tertiary)" />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {t.houseLabel} {p.house}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>·</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {p.village}
                    </span>
                  </div>

                  {/* Last visited row — no duplicate "Visited" */}
                  {lastVisited && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginTop: '3px'
                    }}>
                      <FaClock size={11} color="var(--text-tertiary)" />
                      <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        {lastVisited}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: risk badge + chevron */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '100px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: riskBg,
                    color: riskColor
                  }}>
                    {p.risk}
                  </span>
                  <FaChevronRight size={14} color="var(--text-tertiary)" />
                </div>
              </div>
            );
          })
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 0'
          }}>
            <FaSearch size={40} color="var(--text-tertiary)" style={{ marginBottom: '14px', opacity: 0.5 }} />
            <div style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {t.noResults}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'center' }}>
              {t.noResultsSub}
            </div>
          </div>
        )}

        {/* ── ADD NEW PATIENT CARD ── */}
        <div
          className="ps-add-card"
          onClick={() => navigate('/asha/patients/add')}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--accent-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <FaUserPlus size={20} color="var(--accent)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--accent)' }}>
              {t.addNew}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              {t.addNewSub}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientSelectionScreen;
