import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaTimes, FaBaby } from 'react-icons/fa';
import { MdPregnantWoman } from 'react-icons/md';
import { useLanguage } from '../../context/LanguageContext';
import { AppContext } from '../../context/AppContext';

const CheckupSelectionScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const { patients } = React.useContext(AppContext);

  // Support passing either patientId (from PatientSelectionScreen) or a full patient object
  const patientId = location.state?.patientId;
  const patientFromState = location.state?.patient;
  const patient = patientFromState ||
    (patientId ? patients.find(p => p.id === patientId) : null) ||
    patients[0] ||
    { id: 'p1', name: 'Unknown', type: 'pregnant', house: '', village: '', initials: 'U' };

  const t = {
    en: {
      title: "Select Checkup Type",
      checkupFor: "Checkup for",
      pregTitle: "Pregnant Mother Checkup",
      pregDesc: "Antenatal home visit — 10 clinical questions",
      newTitle: "New Mother and Newborn Checkup",
      newDesc: "Postnatal HBNC visit — 10 clinical questions",
      notApp: "Not applicable for",
      bottomNote: "The checkup type is pre-selected based on the patient's registration. Contact your ANM to change patient type."
    },
    te: {
      title: "చెక్అప్ రకాన్ని ఎంచుకోండి",
      checkupFor: "కోసం చెక్అప్",
      pregTitle: "గర్భిణీ తల్లి చెక్అప్",
      pregDesc: "గర్భధారణ నాటి ఇంటి సందర్శన — 10 క్లినికల్ ప్రశ్నలు",
      newTitle: "కొత్త తల్లి మరియు నవజాత శిశువు చెక్అప్",
      newDesc: "ప్రసవానంతర కానరకం సందర్శన — 10 క్లినికల్ ప్రశ్నలు",
      notApp: "వీరికి వర్తించదు",
      bottomNote: "రోగి నమోదు ఆధారంగా చెక్అప్ రకం ముందుగానే ఎంచుకోబడుతుంది. రోగి రకాన్ని మార్చడానికి మీ ANM ను సంప్రదించండి."
    }
  };

  const text = t[language] || t.en;

  const isPregnant = patient.type === 'pregnant';
  const isNewMother = patient.type === 'newMother';
  const isUnknown = !isPregnant && !isNewMother;

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100dvh', maxWidth: '600px', margin: '0 auto', padding: '0', display: 'flex', flexDirection: 'column', fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* Sticky header */}
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/checkup/select-patient')} style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <FaArrowLeft size={16} color="var(--text-primary)" />
          </button>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{text.title}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
             <button onClick={() => toggleLanguage('en')} style={{
                padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
                border: '1.5px solid var(--border)', cursor: 'pointer',
                ...(language === 'en' ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' } : { background: 'transparent', color: 'var(--text-secondary)' })
              }}>EN</button>
              <button onClick={() => toggleLanguage('te')} style={{
                padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
                border: '1.5px solid var(--border)', cursor: 'pointer',
                ...(language === 'te' ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' } : { background: 'transparent', color: 'var(--text-secondary)' })
              }}>TE</button>
        </div>
      </header>

      {/* SELECTED PATIENT CHIP */}
      <div style={{
        margin: '16px 24px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: 700, flexShrink: 0,
          ...(patient.type === 'pregnant' ? { background: 'var(--accent-light)', color: 'var(--accent)' } : 
               patient.type === 'newMother' ? { background: 'var(--info-light)', color: 'var(--info)' } : 
               { background: 'var(--border)', color: 'var(--text-primary)' })
        }}>
          {patient.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{text.checkupFor}</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.name}</div>
          <div style={{ fontSize: '13px', color: 'gray', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>House {patient.house}, {patient.village}</div>
        </div>
        <button onClick={() => navigate('/checkup/select-patient')} style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: 'var(--bg-secondary)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0
        }}>
          <FaTimes size={12} color="var(--text-secondary)" />
        </button>
      </div>

      {/* TWO SELECTION CARDS */}
      <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
        
        {/* PREGNANT MOTHER CARD */}
        <div 
          onClick={() => (isPregnant || isUnknown) && navigate('/asha/surveys/pregnant', { state: { patient, patientId: patient.id } })}
          style={{
            background: (isPregnant || isUnknown) ? 'var(--accent-subtle)' : 'var(--surface)',
            border: (isPregnant || isUnknown) ? '2px solid var(--accent)' : '1.5px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px 24px',
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            cursor: (isPregnant || isUnknown) ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            opacity: (isPregnant || isUnknown) ? 1 : 0.5
          }}
        >
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <MdPregnantWoman size={32} color="var(--accent)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{text.pregTitle}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {text.pregDesc}
            </div>
            {!(isPregnant || isUnknown) && (
              <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '6px', fontWeight: 500 }}>
                {text.notApp} New Mothers
              </div>
            )}
          </div>
        </div>

        {/* NEW MOTHER CARD */}
        <div 
          onClick={() => (isNewMother || isUnknown) && navigate('/asha/surveys/new-mother', { state: { patient, patientId: patient.id } })}
          style={{
            background: (isNewMother || isUnknown) ? 'var(--info-light)' : 'var(--surface)',
            border: (isNewMother || isUnknown) ? '2px solid var(--info)' : '1.5px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px 24px',
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            cursor: (isNewMother || isUnknown) ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            opacity: (isNewMother || isUnknown) ? 1 : 0.5
          }}
        >
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', background: 'var(--info-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <FaBaby size={32} color="var(--info)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{text.newTitle}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {text.newDesc}
            </div>
            {isNewMother && (
              <div style={{
                background: '#E1F5FE', color: 'var(--info)', padding: '4px 10px', borderRadius: '100px',
                fontSize: '12px', fontWeight: 600, marginTop: '8px', display: 'inline-block'
              }}>
                Day 7 Visit
              </div>
            )}
            {!(isNewMother || isUnknown) && (
              <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '6px', fontWeight: 500 }}>
                {text.notApp} Pregnant Mothers
              </div>
            )}
          </div>
        </div>

      </div>

      {/* BOTTOM NOTE */}
      <div style={{ textAlign: 'center', padding: '24px', fontSize: '13px', lineHeight: 1.6, color: 'var(--text-tertiary)', marginTop: 'auto' }}>
        {text.bottomNote}
      </div>

    </div>
  );
};

export default CheckupSelectionScreen;
