import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaChevronDown, FaChevronUp, FaFilePdf, FaTimes, FaCircle, FaUserInjured, FaStethoscope } from 'react-icons/fa';
import DoctorLayout from '../../layouts/DoctorLayout';
import { useLanguage } from '../../context/LanguageContext';
import { generateInstantReport } from '../../utils/generatePdfReport';

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
  const [selectedReport, setSelectedReport] = useState(null);

  const t = {
    en: {
      title: 'Patient History',
      search: 'Search patients...',
      visits: 'visits',
      lastReport: 'Last report:',
      surveyHistory: 'SURVEY HISTORY',
      download: 'Download',
      noPatients: 'No patients found',
      viewDetail: 'View Details',
      close: 'Close',
      aiSummary: 'AI Assessment Summary',
      vitalsSection: 'Vitals Recorded',
      patientDetails: 'Patient Context'
    },
    te: {
      title: 'రోగి చరిత్ర',
      search: 'రోగులను శోధించండి...',
      visits: 'సందర్శనలు',
      lastReport: 'చివరి నివేదిక:',
      surveyHistory: 'సర్వే చరిత్ర',
      download: 'డౌన్‌లోడ్',
      noPatients: 'రోగులు కనుగొనబడలేదు',
      viewDetail: 'వివరాలు చూడండి',
      close: 'ముగించు',
      aiSummary: 'AI అంచనా సారాంశం',
      vitalsSection: 'రికార్డ్ చేయబడిన కీలకాలు',
      patientDetails: 'రోగి వివరాలు'
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

  const handleDownloadReport = (p, s) => {
    const user = { 
      name: p.name, 
      age: 24, 
      patientType: p.type.toLowerCase() === 'pregnancy' ? 'pregnant' : 'wellness',
      phc: p.village
    };
    const survey = { aiStatus: s.result };
    generateInstantReport(user, [], survey, 'download');
  };

  const openReportDetail = (p, s) => {
    setSelectedReport({ patient: p, survey: s });
  };

  return (
    <DoctorLayout>
      <style dangerouslySetInnerHTML={{__html: `
        .ph-search:focus { border-color: var(--accent) !important; outline: none; }
        .ph-card { cursor: pointer; transition: all 0.15s; }
        .ph-card:hover { border-color: var(--accent) !important; box-shadow: var(--shadow-card) !important; }
        .filter-scroll::-webkit-scrollbar { display: none; }
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(25, 28, 29, 0.6); z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px; backdrop-filter: blur(4px);
        }
        .modal-content {
          background: var(--surface); width: 100%; max-width: 500px;
          border-radius: 28px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          max-height: 90vh; overflow-y: auto;
        }
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
        <div style={{ position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: 'var(--text-tertiary)' }} />
          <input type="text" className="ph-search" placeholder={text.search} value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', height: '48px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', paddingLeft: '44px', paddingRight: '16px', fontSize: '15px', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="filter-scroll" style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginTop: '12px', paddingBottom: '12px' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ padding: '7px 16px', borderRadius: '100px', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: '1.5px solid var(--border)', transition: 'all 0.15s', ...(activeFilter === f ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' } : { background: 'transparent', color: 'var(--text-secondary)' }) }}>{f}</button>
          ))}
        </div>
      </div>

      {/* ── PATIENT CARDS ── */}
      <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(p => {
          const rs = riskStyles[p.risk] || riskStyles.STABLE;
          const isExpanded = expandedId === p.id;

          return (
            <div key={p.id} className="ph-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div onClick={() => setExpandedId(prev => prev === p.id ? null : p.id)} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: rs.bg, color: rs.color, fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.name.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{p.village} · {p.visits} {text.visits}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, background: rs.bg, color: rs.color }}>{p.risk}</span>
                  {isExpanded ? <FaChevronUp size={14} color="var(--text-tertiary)" /> : <FaChevronDown size={14} color="var(--text-tertiary)" />}
                </div>
              </div>

              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '4px', letterSpacing: '1px' }}>{text.surveyHistory}</div>
                  {p.surveys.map(s => (
                    <div key={s.id} onClick={() => openReportDetail(p, s)} style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{s.type}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{s.date} · <span style={{ color: (riskStyles[s.result] || riskStyles.STABLE).color }}>{s.result}</span></div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); handleDownloadReport(p, s); }} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <FaFilePdf size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── REPORT DETAIL MODAL ── */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>{selectedReport.survey.type}</span>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0 0 0' }}>{selectedReport.patient.name}</h2>
              </div>
              <button onClick={() => setSelectedReport(null)} style={{ background: 'var(--bg-secondary)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}>
                <FaTimes color="var(--text-secondary)" />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
               <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>PHC Station</div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedReport.patient.village} PHC</div>
               </div>
               <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Status</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: (riskStyles[selectedReport.survey.result] || riskStyles.STABLE).color }}>{selectedReport.survey.result}</div>
               </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', marginBottom: '24px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <FaRobot color="var(--accent)" />
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>{text.aiSummary}</span>
               </div>
               <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                  Analysis of {selectedReport.survey.type} from {selectedReport.survey.date} confirms {selectedReport.survey.result.toLowerCase()} patient state. Patient history suggests consistent vitals with minor spikes in activity levels. 
                  {selectedReport.survey.result === 'CRITICAL' ? " Immediate review of BP telemetry is required." : " Continue scheduled monitoring."}
               </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
               <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px' }}>{text.vitalsSection}</div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '12px' }}>
                     <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Heart Rate</div>
                     <div style={{ fontSize: '16px', fontWeight: 700 }}>78 bpm</div>
                  </div>
                  <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '12px' }}>
                     <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Blood Oxygen</div>
                     <div style={{ fontSize: '16px', fontWeight: 700 }}>98%</div>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => handleDownloadReport(selectedReport.patient, selectedReport.survey)}
              style={{ width: '100%', height: '56px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '16px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(155, 0, 68, 0.15)' }}
            >
              <FaFilePdf /> {text.download} PDF Report
            </button>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
};

export default PatientHistoryScreen;
