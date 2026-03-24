import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHeartbeat, FaLungs, FaWalking, FaFilePdf,
  FaDownload, FaPhone, FaThermometerHalf,
  FaBatteryThreeQuarters, FaChevronRight, FaClock,
  FaBroadcastTower, FaUserNurse, FaClipboardList
} from 'react-icons/fa';

import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import MotherLayout from '../../layouts/MotherLayout';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useVitals } from '../../hooks/useVitals';
import { useSurveys } from '../../hooks/useSurveys';
import { generateInstantReport, generateMonthlyReport } from '../../utils/generatePdfReport';

/* ── Mock data (no logic change) ── */
const MOCK_LINE_DATA = [
  { day: 'Mon', hr: 72 }, { day: 'Tue', hr: 74 }, { day: 'Wed', hr: 78 },
  { day: 'Thu', hr: 75 }, { day: 'Fri', hr: 71 }, { day: 'Sat', hr: 76 },
  { day: 'Sun', hr: 78 },
];
const MOCK_TEMP = [
  { date: 'Today',     val: '98.6°F', today: true  },
  { date: 'Yesterday', val: '98.5°F', today: false },
  { date: 'Mon',       val: '99.1°F', today: false },
];
const REPORTS = [
  { id: 'r1', type: 'Antenatal Checkup', date: '12 Mar 2026', urgency: 'STABLE'   },
  { id: 'r2', type: 'Antenatal Checkup', date: '01 Feb 2026', urgency: 'MODERATE' },
];

const RING_CONNECTED = true;
const STEP_GOAL    = 5000;

const urgencyColors = {
  STABLE:   { bg: 'var(--success-light)', color: 'var(--success)', icon: 'var(--success)' },
  MODERATE: { bg: 'var(--warning-light)', color: 'var(--warning)', icon: 'var(--warning)' },
  CRITICAL: { bg: 'var(--danger-light)',  color: 'var(--danger)',  icon: 'var(--danger)'  },
};

const MotherDashboard = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [avatarErr, setAvatarErr] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const { vitals, latestVitals } = useVitals(profile?.uid);
  const { surveys } = useSurveys(profile?.uid);
  const latestSurvey = surveys && surveys.length > 0 ? surveys[0] : null;

  const currentHr = latestVitals?.heartRate || 72;
  const currentSpo2 = latestVitals?.spO2 || 98;
  const currentSteps = latestVitals?.stepCount || 1240;

  const generatePDF = async (type) => {
    setIsGenerating(true);
    try {
      if (type === 'instant') {
        generateInstantReport(profile, vitals, latestSurvey);
      } else {
        generateMonthlyReport(profile, vitals, latestSurvey);
      }
      setReportGenerated(true);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToDoctor = () => {
    if (profile?.linkedDoctorId || profile?.linkedDoctorEmail) {
      alert(`Report sent to Dr. ${profile?.linkedDoctorName || 'Sharma'}`);
    } else {
      const email = prompt("Link a Doctor: Enter your doctor's email or phone number to send this report:");
      if (email) {
        alert("Doctor linked and report sent successfully!");
        setReportGenerated(false);
      }
    }
  };

  const name     = (profile?.name || 'Sunita').split(' ')[0];
  const initials = (profile?.name || 'Sunita').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const photoURL = !avatarErr ? (profile?.photoURL || '') : '';

  const t = {
    en: {
      subtitle: 'Your health, monitored daily',
      vitals: 'My Vitals Today', updated: 'Last updated 10 mins ago',
      hr: 'HEART RATE', spo2: 'BLOOD OXYGEN', steps: 'STEPS TODAY',
      stable: '● STABLE', low: '● LOW', goal: 'of 5,000 goal',
      tempTitle: 'Temperature', tempSub: 'Last 3 readings',
      historyTitle: 'Vitals History', last7: 'Last 7 days',
      bpmLabel: 'BPM Over 7 Days', bpmToday: `${currentHr} bpm today`,
      reports: 'Health Reports',
      worker: 'My Health Worker', visited: 'Last visited 2 days ago',
      ring: 'Ring Connected', ringOff: 'Ring not connected', battery: 'Battery 82%',
      connected: 'CONNECTED',
    },
    te: {
      subtitle: 'మీ ఆరోగ్యం, ప్రతిరోజూ పర్యవేక్షించబడుతుంది',
      vitals: 'ఈ రోజు నా ప్రాణాధారాలు', updated: '10 నిమిషాల క్రితం నవీకరించబడింది',
      hr: 'హృదయ స్పందన', spo2: 'రక్తంలో ఆక్సిజన్', steps: 'ఈరోజు అడుగులు',
      stable: '● స్థిరంగా', low: '● తక్కువ', goal: '5,000 లక్ష్యంలో',
      tempTitle: 'ఉష్ణోగ్రత', tempSub: 'చివరి 3 రీడింగులు',
      historyTitle: 'ప్రాణాధారాల చరిత్ర', last7: 'గత 7 రోజులు',
      bpmLabel: '7 రోజులు BPM', bpmToday: `${currentHr} bpm ఈరోజు`,
      reports: 'ఆరోగ్య నివేదికలు',
      worker: 'నా ఆరోగ్య కార్యకర్త', visited: '2 రోజుల క్రితం సందర్శించారు',
      ring: 'రింగ్ కనెక్ట్ చేయబడింది', ringOff: 'రింగ్ కనెక్ట్ కాలేదు', battery: 'బ్యాటరీ 82%',
      connected: 'కనెక్ట్ అయింది',
    }
  };
  const text = t[language] || t.en;

  /* ── Shared card style ── */
  const card = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
  };

  return (
    <MotherLayout>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes connectedPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        .md-report-card:hover { border-color: var(--accent) !important; }
        .md-search:focus { border-color: var(--accent) !important; outline: none; }
      `}} />

      {/* ── TOP BAR ── */}
      <header style={{
        ...card, borderLeft: 'none', borderRight: 'none', borderTop: 'none',
        borderRadius: 0, padding: '16px 24px',
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Left: greeting */}
        <div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Namaste, {name} 👋
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {text.subtitle}
          </div>
        </div>

        {/* Right: EN/TE + dark mode + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Language pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['en', 'te'].map(lang => (
              <button key={lang} onClick={() => toggleLanguage(lang)} style={{
                padding: '6px 14px', borderRadius: '100px', fontSize: '13px',
                fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                border: '1.5px solid var(--border)', transition: 'all 0.15s',
                ...(language === lang
                  ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' }
                  : { background: 'transparent', color: 'var(--text-secondary)' })
              }}>{lang.toUpperCase()}</button>
            ))}
          </div>

          {/* Dark mode — circle, NEVER square */}
          <button onClick={toggleTheme} style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0
          }}>
            {theme === 'light' ? <MdOutlineDarkMode size={18}/> : <MdOutlineLightMode size={18}/>}
          </button>

          {/* Profile avatar — circle NEVER square */}
          <div onClick={() => navigate('/mother/profile')} style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'var(--accent-light)', border: '2px solid var(--accent)',
            overflow: 'hidden', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', flexShrink: 0
          }}>
            {photoURL ? (
              <img src={photoURL} alt="Profile" onError={() => setAvatarErr(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)' }}>{initials}</span>
            )}
          </div>
        </div>
      </header>

      {/* ── RING STATUS CARD ── */}
      <div style={{ margin: '16px 24px 0 24px', ...card, padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
            background: RING_CONNECTED ? 'var(--success-light)' : 'var(--bg-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FaBroadcastTower size={20} color={RING_CONNECTED ? 'var(--success)' : 'var(--text-tertiary)'} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: RING_CONNECTED ? 'var(--success)' : 'var(--text-tertiary)' }}>
              {RING_CONNECTED ? text.ring : text.ringOff}
            </div>
            {RING_CONNECTED && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <FaBatteryThreeQuarters size={14} color="var(--success)" />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{text.battery}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: connected pill */}
        {RING_CONNECTED && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'var(--success-light)', border: '1px solid var(--success)',
            borderRadius: '100px', padding: '4px 12px'
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--success)', display: 'inline-block',
              animation: 'connectedPulse 2s infinite'
            }} />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--success)', letterSpacing: '0.5px' }}>
              {text.connected}
            </span>
          </div>
        )}
      </div>

      {/* ── MY VITALS TODAY ── */}
      <div style={{ padding: '16px 24px 0 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaHeartbeat size={18} color="var(--danger)" />
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{text.vitals}</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{text.updated}</span>
        </div>

        {/* 3-column vitals grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>

          {/* Heart Rate */}
          <div style={{ ...card, padding: '16px 12px', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', margin: '0 auto 10px auto',
              background: 'var(--danger-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaHeartbeat size={22} color="var(--danger)" />
            </div>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
              {text.hr}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '3px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--danger)' }}>{currentHr}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>bpm</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '6px',
              fontSize: '11px', fontWeight: 600, color: 'var(--success)' }}>
              {text.stable}
            </div>
          </div>

          {/* SpO2 */}
          <div style={{ ...card, padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', margin: '0 auto 10px auto',
              background: 'var(--info-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaLungs size={22} color="var(--info)" />
            </div>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
              {text.spo2}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '3px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--info)' }}>{currentSpo2}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '6px',
              fontSize: '11px', fontWeight: 600, color: 'var(--success)' }}>
              {text.stable}
            </div>
          </div>

          {/* Steps */}
          <div style={{ ...card, padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', margin: '0 auto 10px auto',
              background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaWalking size={22} color="var(--success)" />
            </div>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
              {text.steps}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '3px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--success)' }}>{currentSteps.toLocaleString()}</span>
            </div>
            {/* Progress bar */}
            <div style={{ height: '4px', background: 'var(--border)', borderRadius: '100px', marginTop: '8px' }}>
              <div style={{ height: '100%', width: `${Math.min((currentSteps / STEP_GOAL) * 100, 100)}%`,
                background: 'var(--success)', borderRadius: '100px', transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '3px' }}>{text.goal}</div>
          </div>
        </div>
      </div>

      {/* ── TEMPERATURE STRIP ── */}
      <div style={{ margin: '12px 24px 0 24px', ...card, padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--warning-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FaThermometerHalf size={20} color="var(--warning)" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{text.tempTitle}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{text.tempSub}</div>
          </div>
        </div>

        {/* Right: 3 chips */}
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          {MOCK_TEMP.map(t => (
            <div key={t.date} style={{
              textAlign: 'center', padding: '6px 10px', borderRadius: 'var(--radius-sm)',
              background: t.today ? 'var(--warning-light)' : 'var(--bg-secondary)',
              border: `1px solid ${t.today ? 'var(--warning)' : 'var(--border)'}`,
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>{t.date}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: t.today ? 'var(--warning)' : 'var(--text-primary)' }}>{t.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── VITALS HISTORY ── */}
      <div style={{ padding: '16px 24px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{text.historyTitle}</span>
          <button onClick={() => navigate('/mother/vitals')} style={{
            display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px',
            fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit'
          }}>
            {text.last7} <FaChevronRight size={12} />
          </button>
        </div>

        {/* Mini chart card */}
        <div style={{ ...card, padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{text.bpmLabel}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--danger)' }}>{text.bpmToday}</span>
          </div>
          <div style={{ height: '80px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_LINE_DATA}>
                <Line
                  type="monotone" dataKey="hr"
                  stroke="var(--danger)" strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--danger)', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
                <Tooltip
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v) => [`${v} bpm`, 'Heart Rate']}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── PDF HEALTH REPORTS ── */}
      <div style={{ padding: '16px 24px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <FaFilePdf size={18} color="var(--accent)" />
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{language === 'te' ? 'నా ఆరోగ్య నివేదికలు' : 'My Health Reports'}</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={() => generatePDF('instant')}
            style={{
              height: '52px', width: '100%', background: 'var(--accent)', color: 'white',
              borderRadius: 'var(--radius-md)', border: 'none', fontSize: '15px', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
            }}
          >
            <FaDownload size={16} /> {language === 'te' ? 'ప్రస్తుత నివేదికను డౌన్‌లోడ్ చేయండి' : 'Download Current Report'}
          </button>

          <button 
            onClick={() => generatePDF('monthly')}
            disabled={isGenerating}
            style={{
              height: '52px', width: '100%', background: 'transparent', color: 'var(--accent)',
              borderRadius: 'var(--radius-md)', border: '1.5px solid var(--accent)', fontSize: '15px', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
              opacity: isGenerating ? 0.7 : 1
            }}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">Generating...</span>
            ) : (
              <><FaFilePdf size={16} /> {language === 'te' ? 'నెలవారీ నివేదికను డౌన్‌లోడ్ చేయండి' : 'Download Monthly Report'}</>
            )}
          </button>

          {reportGenerated && (
            <button 
              onClick={handleSendToDoctor}
              style={{
                height: '48px', width: '100%', background: 'var(--success-light)', color: 'var(--success)',
                borderRadius: 'var(--radius-md)', border: '1.5px solid var(--success)', fontSize: '14px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
                animation: 'fadeIn 0.3s'
              }}
            >
              <FaDownload size={14} style={{ transform: 'rotate(-90deg)' }} /> {language === 'te' ? 'నా డాక్టరుకు పంపండి' : 'Send to My Doctor'}
            </button>
          )}
        </div>
      </div>

      {/* ── PREVIOUS HEALTH REPORTS (Old list) ── */}
      <div style={{ padding: '16px 24px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaClipboardList size={18} color="var(--accent)" />
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{text.reports}</span>
          </div>
          <button 
            onClick={() => navigate('/mother/reports')}
            style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {text.viewAll}
          </button>
        </div>

        {REPORTS.map(rep => {
          const uc = urgencyColors[rep.urgency] || urgencyColors.STABLE;
          return (
            <div
              key={rep.id}
              className="md-report-card"
              onClick={() => navigate(`/mother/report/${rep.id}`, { state: { report: rep } })}
              style={{ ...card, padding: '14px 20px', marginBottom: '10px',
                display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.15s', cursor: 'pointer' }}
            >
              {/* Icon box */}
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', flexShrink: 0,
                background: uc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaFilePdf size={22} color={uc.icon} />
              </div>

              {/* Center */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {rep.type}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{rep.date}</div>
              </div>

              {/* Right */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.5px', background: uc.bg, color: uc.color }}>
                  {rep.urgency}
                </span>
                <button style={{ background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)',
                  padding: '6px 8px', border: 'none', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer' }}>
                  <FaDownload size={16} color="var(--accent)" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MY ASHA WORKER ── */}
      <div style={{ padding: '16px 24px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <FaUserNurse size={18} color="var(--accent)" />
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{text.worker}</span>
        </div>

        <div style={{ ...card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Avatar circle */}
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
            background: 'var(--accent-light)', color: 'var(--accent)',
            fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            L
          </div>

          {/* Center */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Lakshmi Devi
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <FaClock size={11} color="var(--text-tertiary)" />
              {text.visited}
            </div>
          </div>

          {/* Call button — circle */}
          <button
            onClick={() => {
              if (window.innerWidth > 768) {
                alert(text.callingToast || "Calling only available on mobile");
              } else {
                window.location.href = `tel:+91 9876543210`;
              }
            }}
            style={{ width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
              background: 'var(--success-light)', border: '1px solid var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s' }}
          >
            <FaPhone size={18} color="var(--success)" />
          </button>
        </div>
      </div>

    </MotherLayout>
  );
};

export default MotherDashboard;
