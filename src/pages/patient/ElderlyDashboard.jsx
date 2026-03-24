import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHeartbeat, FaLungs, FaWalking, FaFilePdf,
  FaDownload, FaPhone, FaThermometerHalf,
  FaBatteryThreeQuarters, FaChevronRight, FaClock,
  FaBroadcastTower, FaUserNurse, FaBone, FaBrain,
  FaExclamationCircle, FaShieldAlt, FaChartLine, FaRobot, FaBell, FaMagic, FaExclamationTriangle
} from 'react-icons/fa';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import PatientLayout from '../../layouts/PatientLayout';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useVitals } from '../../hooks/useVitals';
import { useSurveys } from '../../hooks/useSurveys';
import { generateInstantReport, generateMonthlyReport } from '../../utils/generatePdfReport';
import { db } from '../../config/firebase';
import { collection, query, where, limit, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';

const generateMockVitals = (count = 7) => {
  const data = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    data.push({
      heartRate: Math.floor(Math.random() * (85 - 65 + 1)) + 65,
      spO2: Math.floor(Math.random() * (99 - 95 + 1)) + 95,
      temperature: (Math.random() * (37.1 - 36.4) + 36.4).toFixed(1),
      stepCount: Math.floor(Math.random() * (4000 - 800 + 1)) + 800,
      timestamp: { seconds: Math.floor((now - i * 24 * 60 * 60 * 1000) / 1000) }
    });
  }
  return data;
};

const ElderlyDashboard = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [latestAlert, setLatestAlert] = useState(null);

  const { vitals: firestoreVitals, latestVitals: firestoreLatest } = useVitals(profile?.uid);
  
  // Logic to use firestore data or fallback to mock for functional demo
  const displayVitals = firestoreVitals && firestoreVitals.length > 0 ? firestoreVitals : generateMockVitals(7);
  const latest = firestoreLatest || displayVitals[0];

  const aiStatus = profile?.aiAssessment?.aiStatus || 'STABLE';
  const aiText = profile?.aiAssessment?.aiParagraphEnglish || (profile?.elderlyHealthProfile 
    ? "Based on your health profile, you are doing well. Keep following your daily routine and medication schedule."
    : "Your health assessment is pending. Please complete the physical survey to receive AI insights.");

  const currentHr = latest?.heartRate || 72;
  const currentSpo2 = latest?.spO2 || 98;
  const currentTemp = latest?.temperature || 36.6;
  const currentSteps = latest?.stepCount || 1040;

  // Redirect if survey not done
  useEffect(() => {
    if (profile && !profile.elderlyHealthProfile && !profile.wellnessProfile) {
       // navigate('/elderly/health-survey'); 
       // Keeping it commented for dev flexibility, but adding a visual hint
    }
  }, [profile, navigate]);

  // Fetch latest alert
  useEffect(() => {
    if (!profile?.uid) return;
    const q = query(
      collection(db, 'alerts'),
      where('patientId', '==', profile.uid),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLatestAlert(snapshot.docs[0].data());
      } else {
        setLatestAlert(null);
      }
    });
    return () => unsubscribe();
  }, [profile?.uid]);

  const generatePDF = async (type) => {
    setIsGenerating(true);
    try {
      if (type === 'instant') {
        generateInstantReport(profile, firestoreVitals, { aiStatus, aiParagraphEnglish: aiText });
      } else {
        generateMonthlyReport(profile, firestoreVitals, { aiStatus, aiParagraphEnglish: aiText });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmergencyCall = () => {
    if (confirm("Call Emergency Caretaker?")) {
      window.location.href = "tel:108";
    }
  };

  const name = (profile?.name || 'User').split(' ')[0];

  const t = {
    en: {
      subtitle: 'Personalized monitoring and care',
      vitals: 'My Health Indicators',
      analytics: 'Vital Trends (7 Days)',
      ai: 'AI Health Insights',
      alerts: 'Recent Safety Alerts',
      emptyAlerts: 'No active alerts',
      status: 'Current Health Status'
    },
    te: {
      subtitle: 'వ్యక్తిగతీకరించిన పర్యవేక్షణ మరియు సంరక్షణ',
      vitals: 'నా ఆరోగ్య సూచికలు',
      analytics: '7 రోజుల ట్రెండ్స్',
      ai: 'AI ఆరోగ్య అంతర్దృష్టులు',
      alerts: 'భద్రతా హెచ్చరికలు',
      emptyAlerts: 'ఎటువంటి అలర్ట్స్ లేవు',
      status: 'ప్రస్తుత ఆరోగ్య స్థితి'
    }
  };
  const text = t[language] || t.en;

  // Chart Data
  const chartData = [...displayVitals].slice(0, 7).reverse().map(v => {
    const ts = v.timestamp?.seconds ? new Date(v.timestamp.seconds * 1000) : new Date(v.timestamp);
    return {
      day: ts.toLocaleDateString('en-US', { weekday: 'short' }),
      hr: v.heartRate,
      spo2: v.spO2
    };
  });

  return (
    <PatientLayout patientType="elderly">
      {/* HEADER */}
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 800 }}>Namaste, {name} 👋</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{text.subtitle}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => toggleLanguage(language === 'en' ? 'te' : 'en')} style={{ padding: '6px 12px', borderRadius: '100px', border: '1px solid var(--border)', fontWeight: 600 }}>{language.toUpperCase()}</button>
          <button onClick={toggleTheme} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{theme === 'light' ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}</button>
        </div>
      </header>

      {/* 1. HEALTH STATUS CARD */}
      <div style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
        <div style={{ 
          background: aiStatus === 'CRITICAL' ? 'var(--danger-light)' : aiStatus === 'MODERATE' ? 'var(--warning-light)' : 'var(--success-light)',
          border: `2px solid ${aiStatus === 'CRITICAL' ? 'var(--danger)' : aiStatus === 'MODERATE' ? 'var(--warning)' : 'var(--success)'}`,
          borderRadius: 'var(--radius-xl)', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
             {aiStatus === 'CRITICAL' ? <FaExclamationCircle color="var(--danger)" size={32} /> : 
              aiStatus === 'MODERATE' ? <FaExclamationTriangle color="var(--warning)" size={32} /> :
              <FaShieldAlt color="var(--success)" size={32} />}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>{text.status}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{aiStatus}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {aiStatus === 'STABLE' ? 'Vital signs are within normal range.' : 
               aiStatus === 'MODERATE' ? 'Monitoring required for elevated metrics.' : 
               'Immediate doctor consultation recommended.'}
            </div>
          </div>
        </div>
      </div>

      {!profile?.elderlyHealthProfile && (
        <div style={{ margin: '0 24px 20px 24px', padding: '12px 16px', background: 'var(--warning-light)', border: '1px solid var(--warning)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaExclamationTriangle color="var(--warning)" size={16} />
          <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>Please complete your health profile survey for accurate AI analysis.</span>
          <button onClick={() => navigate('/elderly/health-survey')} style={{ marginLeft: 'auto', background: 'var(--warning)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>Start now</button>
        </div>
      )}

      {/* 2. VITALS GRID */}
      <div style={{ padding: '0 24px' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>{text.vitals}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <FaHeartbeat color="var(--danger)" size={24} style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 700 }}>HEART RATE</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--danger)' }}>{currentHr} <span style={{ fontSize: '12px' }}>bpm</span></div>
          </div>
          <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <FaLungs color="var(--info)" size={24} style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 700 }}>OXYGEN (SPO2)</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--info)' }}>{currentSpo2}%</div>
          </div>
          <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <FaThermometerHalf color="var(--warning)" size={24} style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 700 }}>TEMPERATURE</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--warning)' }}>{currentTemp}°C</div>
          </div>
          <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <FaWalking color="var(--accent)" size={24} style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 700 }}>STEPS TODAY</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>{currentSteps}</div>
          </div>
        </div>
      </div>

      {/* 3. VITALS ANALYTICS */}
      <div style={{ margin: '24px', padding: '20px', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <FaChartLine color="var(--accent)" />
          <span style={{ fontSize: '16px', fontWeight: 700 }}>{text.analytics}</span>
        </div>
        <div style={{ height: '220px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-secondary)'}} />
              <Tooltip 
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
              />
              <Line type="monotone" dataKey="hr" stroke="var(--danger)" strokeWidth={3} dot={{r: 4, fill: 'var(--danger)'}} name="Heart Rate" />
              <Line type="monotone" dataKey="spo2" stroke="var(--info)" strokeWidth={3} dot={{r: 4, fill: 'var(--info)'}} name="Oxygen" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. AI INSIGHTS */}
      <div style={{ margin: '0 24px 24px 24px', padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <FaRobot color="var(--accent)" size={18} />
          <span style={{ fontSize: '16px', fontWeight: 700 }}>{text.ai}</span>
        </div>
        <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)', background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent)' }}>
          {aiText}
        </div>
      </div>

      {/* 5. ALERT STATUS */}
      <div style={{ margin: '0 24px 24px 24px', padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <FaBell color="var(--danger)" />
          <span style={{ fontSize: '16px', fontWeight: 700 }}>{text.alerts}</span>
        </div>
        {!latestAlert ? (
          <div style={{ padding: '20px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', color: 'var(--text-tertiary)', fontSize: '14px' }}>
            {text.emptyAlerts}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', background: 'var(--danger-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger)' }}>
            <FaExclamationCircle color="var(--danger)" size={20} style={{ marginTop: '2px' }} />
            <div>
               <div style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '14px' }}>{latestAlert.type.toUpperCase()}</div>
               <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{latestAlert.message}</div>
               <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{new Date(latestAlert.createdAt?.seconds * 1000).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>

      {/* 6. ACTION BUTTONS */}
      <div style={{ padding: '0 24px 40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          <button onClick={() => generatePDF('instant')} disabled={isGenerating} style={{ height: '56px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(194, 24, 91, 0.2)' }}>
            <FaDownload /> {isGenerating ? 'Generating...' : 'Download Instant Health Report'}
          </button>
          <button onClick={() => generatePDF('monthly')} disabled={isGenerating} style={{ height: '56px', background: 'transparent', color: 'var(--accent)', border: '1.5px solid var(--accent)', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <FaFilePdf /> Download Monthly Trend Report
          </button>
          <button onClick={handleEmergencyCall} style={{ height: '56px', background: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <FaPhone /> Emergency Call Caretaker
          </button>
        </div>
      </div>
    </PatientLayout>
  );
};

export default ElderlyDashboard;
