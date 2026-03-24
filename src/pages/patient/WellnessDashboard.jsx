import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHeartbeat, FaWalking, FaFilePdf, FaDownload, FaEye,
  FaBatteryThreeQuarters, FaBroadcastTower, FaRunning, FaBed, 
  FaAppleAlt, FaBrain, FaChartLine, FaRobot, FaCalendarCheck
} from 'react-icons/fa';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, CartesianGrid } from 'recharts';
import PatientLayout from '../../layouts/PatientLayout';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useVitals } from '../../hooks/useVitals';
import { generateProfessionalReport } from '../../utils/generatePdfReport';

const STEP_GOAL = 10000;

const generateMockWellnessTrends = (count = 7) => {
  const data = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let i = 0; i < count; i++) {
    data.push({
      day: days[i],
      steps: Math.floor(Math.random() * (11000 - 3000 + 1)) + 3000,
      sleep: (Math.random() * (9 - 5) + 5).toFixed(1)
    });
  }
  return data;
};

const WellnessDashboard = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);

  const name = (profile?.name || 'User').split(' ')[0];
  const { vitals: firestoreVitals, latestVitals: firestoreLatest } = useVitals(profile?.uid);
  
  const currentSteps = firestoreLatest?.stepCount || 6420;
  const mockTrends = generateMockWellnessTrends(7);

  const generatePDF = async (type = 'instant', mode = 'download') => {
    setIsGenerating(true);
    try {
      generateProfessionalReport(profile, firestoreVitals, null, mode, type);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const t = {
    en: {
      subtitle: 'Achieve your health goals',
      vitals: 'My Wellness Stats', ring: 'Ring Connected',
      steps: 'STEPS', goal: 'Daily Goal', activity: 'Activity',
      sleep: 'Sleep Quality', stress: 'Stress Level', diet: 'Diet',
      analytics: 'Weekly Step Trends', insights: 'Daily Wellness Tip',
      view: 'View PDF', download: 'Download Summary', share: 'Share with Health Coach'
    },
    te: {
      subtitle: 'మీ ఆరోగ్య లక్ష్యాలను చేరుకోండి',
      vitals: 'నా వెల్నెస్ గణాంకాలు', ring: 'రింగ్ కనెక్ట్ చేయబడింది',
      steps: 'అడుగులు', goal: 'రోజువారీ లక్ష్యం', activity: 'కార్యాచరణ',
      sleep: 'నిద్ర నాణ్యత', stress: 'ఒత్తిడి స్థాయి', diet: 'ఆహారం',
      analytics: 'వారపు అడుగుల ట్రెండ్స్', insights: 'రోజువారీ వెల్నెస్ చిట్కా',
      view: 'మొత్తం చూడండి', download: 'సారాంశం డౌన్‌లోడ్', share: 'హెల్త్ కోచ్‌తో షేర్ చేయండి'
    }
  };
  const text = t[language] || t.en;

  return (
    <PatientLayout patientType="wellness">
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

      <div style={{ margin: '16px 24px', padding: '12px 20px', background: 'var(--surface)', border: '1.5px solid var(--success-light)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <FaBroadcastTower color="var(--success)" className="animate-pulse" />
        <span style={{ fontWeight: 600, color: 'var(--success)', flex: 1 }}>{text.ring}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
           <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--success)' }}>84%</span>
           <FaBatteryThreeQuarters color="var(--success)" size={16} />
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
          <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{text.steps}</div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>{currentSteps.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)' }}>{text.goal}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)' }}>{STEP_GOAL.toLocaleString()}</div>
                </div>
             </div>
             <div style={{ height: '14px', background: 'var(--bg-secondary)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min((currentSteps/STEP_GOAL)*100, 100)}%`, background: 'var(--accent)', borderRadius: '100px', transition: 'width 1s ease-out' }} />
             </div>
          </div>
      </div>

      <div style={{ padding: '24px 24px 0 24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {[
            { icon: FaBed, color: 'var(--info)', label: text.sleep, val: '7.2 hrs' },
            { icon: FaBrain, color: 'var(--warning)', label: text.stress, val: 'Optimal' },
            { icon: FaRunning, color: 'var(--accent)', label: text.activity, val: 'High' },
            { icon: FaAppleAlt, color: 'var(--success)', label: text.diet, val: 'Balanced' }
          ].map((item, i) => (
            <div key={i} style={{ background: 'var(--surface)', padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <item.icon color={item.color} size={18} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>{item.label}</span>
               </div>
               <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{item.val}</div>
            </div>
          ))}
      </div>

      <div style={{ margin: '24px', padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <FaChartLine color="var(--accent)" />
            <span style={{ fontSize: '16px', fontWeight: 700 }}>{text.analytics}</span>
         </div>
         <div style={{ height: '180px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrends}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-secondary)'}} />
                 <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
                 <Line type="monotone" dataKey="steps" stroke="var(--accent)" strokeWidth={3} dot={{r: 4, fill: 'var(--accent)'}} />
              </LineChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div style={{ padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button 
              onClick={() => generatePDF('instant', 'download')}
              style={{ height: '56px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(194, 24, 91, 0.2)' }}
            >
              <FaDownload /> {text.download}
            </button>
            <button 
              onClick={() => generatePDF('instant', 'view')}
              style={{ height: '56px', background: 'white', color: 'var(--accent)', border: '1.5px solid var(--accent)', borderRadius: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <FaEye /> {text.view}
            </button>
          </div>

          <button onClick={() => alert("Summary shared!")} style={{ height: '56px', background: '#ffffff', color: 'var(--success)', border: '2.5px solid var(--success)', borderRadius: '16px', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 109, 49, 0.08)' }}>
            <FaCalendarCheck size={18} /> {text.share}
          </button>
      </div>
    </PatientLayout>
  );
};

export default WellnessDashboard;
