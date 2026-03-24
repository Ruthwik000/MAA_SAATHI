import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaArrowLeft, FaFilePdf, FaDownload, FaUser, FaCheckCircle, FaPlay } from 'react-icons/fa';
import MotherLayout from '../../layouts/MotherLayout';
import { useLanguage } from '../../context/LanguageContext';
import { generateInstantReport } from '../../utils/generatePdfReport';

const MotherReportViewerScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { language } = useLanguage();

  const report = location.state?.report || {
    id: id || 'r2',
    name: 'Suhana Khatun',
    asha: 'Kamala',
    date: 'Yesterday, 2:15 PM',
    urgency: 'MODERATE',
    status: 'Viewed'
  };

  const dummyData = {
    age: '22',
    village: 'Sila village',
    asha: 'Kamala',
    responses: [
      { q: "Any swelling in feet?", a: "Yes, mild swelling", danger: true },
      { q: "Frequent headaches?", a: "None", danger: false },
      { q: "Fetal movement?", a: "Strong/Normal", danger: false },
      { q: "Vision problems?", a: "None", danger: false },
      { q: "Back pain?", a: "Moderate", danger: false }
    ],
    aiAnalysis: {
      summary: "Patient shows mild peripheral edema (swelling). All other vitals and symptoms are currently within normal range. Fetal movement is reassuring.",
      dangerFlags: ["Mild swelling in feet"],
      recommendations: [
        "Monitor blood pressure daily for next 3 days",
        "Advise ASHA to check for protein in urine",
        "Advise left lateral sleeping position",
        "Call doctor if headache occurs"
      ]
    },
    voiceNoteText: "Patient mentions back pain is worse at night. Swelling started 2 days ago."
  };

  const handleDownload = () => {
    const user = { 
      name: report.name, 
      age: dummyData.age, 
      patientType: 'pregnant',
      phc: dummyData.village
    };
    const survey = { aiStatus: report.urgency };
    generateInstantReport(user, [], survey, 'download');
  };

  const t = {
    en: {
      title: "Health Report",
      download: "Download PDF",
      summary: "Patient Summary",
      responses: "Survey Responses",
      ai: "AI Health Analysis",
      flags: "Danger Flags",
      rec: "Doctor Recommendations",
      voice: "Voice Note Info"
    },
    te: {
      title: "ఆరోగ్య నివేదిక",
      download: "PDF డౌన్‌లోడ్ చేయండి",
      summary: "పేషెంట్ సారాంశం",
      responses: "సర్వే సమాధానాలు",
      ai: "AI ఆరోగ్య విశ్లేషణ",
      flags: "ప్రమాద సంకేతాలు",
      rec: "డాక్టర్ సిఫార్సులు",
      voice: "వాయిస్ నోట్ సమాచారం"
    }
  };
  const text = t[language] || t.en;

  const isCritical = report.urgency === 'CRITICAL';
  const isModerate = report.urgency === 'MODERATE';

  const sectionStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '16px'
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '1px', color: 'var(--text-tertiary)', marginBottom: '4px'
  };

  return (
    <MotherLayout>
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        </div>
        <span style={{
          padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.5px',
          background: isCritical ? 'var(--danger-light)' : isModerate ? 'var(--warning-light)' : 'var(--success-light)',
          color: isCritical ? 'var(--danger)' : isModerate ? 'var(--warning)' : 'var(--success)'
        }}>
          {report.urgency}
        </span>
      </header>

      <div style={{ padding: '20px 24px 40px 24px' }}>
        
        {/* Patient Summary */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <FaUser style={{ color: 'var(--info)' }} />
            <span style={{ fontSize: '15px', fontWeight: 600 }}>{text.summary}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Patient Name</label>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{report.name}</div>
            </div>
            <div>
              <label style={labelStyle}>ASHA Worker</label>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{dummyData.asha}</div>
            </div>
            <div>
              <label style={labelStyle}>Report Date</label>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{report.date}</div>
            </div>
          </div>
        </div>

        {/* Survey Responses */}
        <div style={sectionStyle}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>{text.responses}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {dummyData.responses.map((res, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)', flex: 1 }}>{res.q}</span>
                <span style={{
                  fontSize: '14px', fontWeight: 600, flex: 1, textAlign: 'right',
                  color: res.danger ? 'var(--danger)' : 'var(--text-primary)'
                }}>{res.a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div style={{ ...sectionStyle, borderLeft: '4px solid #7C3AED' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#7C3AED', marginBottom: '10px' }}>{text.ai}</div>
          <label style={{ ...labelStyle, color: 'var(--danger)' }}>{text.flags}</label>
          <ul style={{ padding: 0, margin: '8px 0 16px 0', listStyle: 'none' }}>
            {dummyData.aiAnalysis.dangerFlags.map((flag, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--danger)', marginBottom: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--danger)' }} />
                {flag}
              </li>
            ))}
          </ul>

          <label style={{ ...labelStyle, color: 'var(--accent)' }}>{text.rec}</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
             {dummyData.aiAnalysis.recommendations.map((rec, i) => (
               <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                 <span style={{ fontWeight: 700 }}>{i + 1}.</span>
                 <span>{rec}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Voice Note Placeholder */}
        <div style={sectionStyle}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.6 }}>
             <FaPlay size={12} color="var(--text-tertiary)" />
             <span style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
               "Voice recording attached by ASHA worker..."
             </span>
           </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          style={{
            width: '100%', height: '52px', background: 'var(--accent)', color: 'white',
            border: 'none', borderRadius: 'var(--radius-md)', fontSize: '16px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer',
            fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(194,24,91,0.2)'
          }}
        >
          <FaDownload /> {text.download}
        </button>

      </div>
    </MotherLayout>
  );
};

export default MotherReportViewerScreen;
