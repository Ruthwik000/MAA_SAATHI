import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeartbeat, FaLungs, FaClock } from 'react-icons/fa';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from 'recharts';

const CaretakerVitals = () => {
  const navigate = useNavigate();
  
  const chartData = [
    { day: 'Mon', hr: 78 }, { day: 'Tue', hr: 82 }, { day: 'Wed', hr: 75 },
    { day: 'Thu', hr: 80 }, { day: 'Fri', hr: 77 }, { day: 'Sat', hr: 79 },
    { day: 'Sun', hr: 78 }
  ];

  const temps = [
    { label: 'Today', val: '98.6°F' },
    { label: 'Yesterday', val: '98.5°F' },
    { label: '2 days ago', val: '99.1°F' }
  ];

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', padding: '32px 24px 96px 24px', fontFamily: '"DM Sans", sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Patient Vitals</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Saraswathi Reddy</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {/* Heart Rate */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--danger-light)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaHeartbeat size={24} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: '8px' }}>HEART RATE</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--danger)', marginBottom: '4px' }}>78 bpm</div>
          <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>Normal range</div>
        </div>

        {/* SpO2 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--info-light)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaLungs size={24} color="var(--info)" />
          </div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: '8px' }}>BLOOD OXYGEN</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--info)', marginBottom: '4px' }}>98%</div>
          <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>Normal</div>
        </div>

        {/* Last Seen */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--warning-light)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaClock size={24} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: '8px' }}>LAST SEEN</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>2 mins ago</div>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>Last 7 Days</h3>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '24px', height: '220px' }}>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-tertiary)'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="hr" 
                stroke="#E91E63" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#E91E63' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>Temperature</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          {temps.map((t, i) => (
            <div key={i} style={{ flex: 1, padding: '10px 16px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{t.label}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaretakerVitals;
