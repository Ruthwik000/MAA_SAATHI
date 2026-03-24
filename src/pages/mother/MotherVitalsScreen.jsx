import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeartbeat, FaLungs, FaWalking, FaChevronRight } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, YAxis, CartesianGrid } from 'recharts';
import MotherLayout from '../../layouts/MotherLayout';
import { useLanguage } from '../../context/LanguageContext';

const FILTER_PILLS = ['Today', '7 Days', '30 Days'];

const HEART_DATA = [
  { day: 'Mon', val: 78 }, { day: 'Tue', val: 82 }, { day: 'Wed', val: 75 },
  { day: 'Thu', val: 80 }, { day: 'Fri', val: 77 }, { day: 'Sat', val: 79 },
  { day: 'Sun', val: 78 }
];
const OXYGEN_DATA = [
  { day: 'Mon', val: 98 }, { day: 'Tue', val: 97 }, { day: 'Wed', val: 98 },
  { day: 'Thu', val: 96 }, { day: 'Fri', val: 98 }, { day: 'Sat', val: 97 },
  { day: 'Sun', val: 98 }
];
const STEPS_DATA = [
  { day: 'Mon', val: 2840 }, { day: 'Tue', val: 3200 }, { day: 'Wed', val: 1800 },
  { day: 'Thu', val: 2100 }, { day: 'Fri', val: 2900 }, { day: 'Sat', val: 3400 },
  { day: 'Sun', val: 2840 }
];

const MotherVitalsScreen = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('7 Days');

  const t = {
    en: { title: "Vitals History", hr: "Heart Rate (BPM)", spo2: "Blood Oxygen (SpO2 %)", steps: "Steps History" },
    te: { title: "ప్రాణాధారాల చరిత్ర", hr: "హృదయ స్పందన (BPM)", spo2: "రక్తంలో ఆక్సిజన్ (SpO2 %)", steps: "అడుగుల చరిత్ర" }
  };
  const text = t[language] || t.en;

  const cardStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '20px'
  };

  return (
    <MotherLayout>
      {/* ── STICKY HEADER ── */}
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
        
        {/* ── FILTER PILLS ── */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {FILTER_PILLS.map(p => (
            <button
              key={p}
              onClick={() => setActiveFilter(p)}
              style={{
                padding: '8px 16px', borderRadius: '100px', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', border: '1.5px solid var(--border)', transition: 'all 0.15s',
                fontFamily: 'inherit',
                ...(activeFilter === p
                  ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' }
                  : { background: 'transparent', color: 'var(--text-secondary)' })
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* ── HEART RATE CHART ── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <FaHeartbeat color="var(--danger)" />
            <span style={{ fontSize: '15px', fontWeight: 600 }}>{text.hr}</span>
          </div>
          <div style={{ height: '180px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HEART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }}
                  labelStyle={{ fontWeight: 700 }}
                />
                <Line type="monotone" dataKey="val" stroke="var(--danger)" strokeWidth={3} dot={{ r: 4, fill: 'var(--danger)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── SPO2 CHART ── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <FaLungs color="var(--info)" />
            <span style={{ fontSize: '15px', fontWeight: 600 }}>{text.spo2}</span>
          </div>
          <div style={{ height: '180px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={OXYGEN_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                <YAxis hide domain={[90, 100]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }} />
                <Line type="monotone" dataKey="val" stroke="var(--info)" strokeWidth={3} dot={{ r: 4, fill: 'var(--info)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── STEPS CHART ── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <FaWalking color="var(--success)" />
            <span style={{ fontSize: '15px', fontWeight: 600 }}>{text.steps}</span>
          </div>
          <div style={{ height: '180px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STEPS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="val" fill="var(--success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </MotherLayout>
  );
};

export default MotherVitalsScreen;
