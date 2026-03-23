import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaTrophy, FaTasks, FaClock,
  FaSpinner, FaCheckCircle, FaCheck, FaRupeeSign, FaUndo
} from 'react-icons/fa';

// ── Single source of truth: one tasks array with status field ────────────────
const INITIAL_TASKS = [
  { id: 1, text: 'Complete 3 more home visits',        reward: 150, status: 'pending'    },
  { id: 2, text: 'Submit checkup for Sunita Devi',     reward: 100, status: 'inProgress' },
  { id: 3, text: 'Register 1 new pregnant patient',    reward: 200, status: 'pending'    },
  { id: 4, text: "Ensure vaccine for Meena's baby",    reward: 120, status: 'inProgress' },
  { id: 5, text: 'Attend PHC meeting on 1st Monday',   reward: 150, status: 'completed'  },
  { id: 6, text: 'Follow up with Priya Patel',         reward: 80,  status: 'completed'  },
];

const TARGET_AMOUNT = 2000;

const IncentivesScreen = () => {
  const navigate = useNavigate();

  // ── Single tasks state — all derived values flow from here ─────────────────
  const [tasks, setTasks]           = useState(INITIAL_TASKS);
  const [undoConfirm, setUndoConfirm] = useState(null); // taskId pending undo confirm
  const [toast, setToast]           = useState('');

  // ── Derived calculations — automatically recalculate on every render ────────
  const completedTasks  = tasks.filter(t => t.status === 'completed');
  const pendingTasks    = tasks.filter(t => t.status === 'pending' || t.status === 'inProgress');
  const totalEarned     = completedTasks.reduce((sum, t) => sum + t.reward, 0);
  const remaining       = Math.max(TARGET_AMOUNT - totalEarned, 0);
  const progressPercent = Math.min((totalEarned / TARGET_AMOUNT) * 100, 100);

  // ── Mark a pending/inProgress task as completed ────────────────────────────
  const markComplete = (taskId) => {
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, status: 'completed' } : t)
    );
  };

  // ── Show undo confirmation for a completed task ───────────────────────────
  const requestUndo = (taskId) => {
    setUndoConfirm(prev => prev === taskId ? null : taskId); // toggle
  };

  // ── Actually undo — move task back to pending ─────────────────────────────
  const confirmUndo = (taskId) => {
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, status: 'pending' } : t)
    );
    setUndoConfirm(null);
    showToast('Task marked as pending');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)', minHeight: '100dvh',
      paddingBottom: '96px', fontFamily: '"DM Sans", sans-serif'
    }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: '76px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text-primary)', color: 'white',
          padding: '10px 22px', borderRadius: '100px',
          fontSize: '13px', fontWeight: 600, zIndex: 200,
          boxShadow: '0 4px 14px rgba(0,0,0,0.18)', whiteSpace: 'nowrap'
        }}>
          {toast}
        </div>
      )}

      {/* STICKY HEADER */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button onClick={() => navigate(-1)} style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <FaArrowLeft size={16} color="var(--text-primary)" />
        </button>
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
          My Incentives
        </div>
      </header>

      {/* ── EARNINGS HERO CARD ── */}
      <div style={{
        margin: '16px 24px 0 24px', background: 'var(--accent)',
        borderRadius: 'var(--radius-xl)', padding: '24px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.75)', marginBottom: '8px' }}>
                THIS MONTH'S EARNINGS
              </div>
              {/* BUG 1 FIX: uses calculated totalEarned, not hardcoded */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '18px', fontWeight: 600, color: 'white', opacity: 0.8 }}>Rs</span>
                <span style={{ fontSize: '40px', fontWeight: 800, color: 'white', letterSpacing: '-1px' }}>
                  {totalEarned.toLocaleString()}
                </span>
              </div>
            </div>
            <FaTrophy size={48} color="rgba(255,255,255,0.3)" />
          </div>

          {/* BUG 1 FIX: progress bar derived from progressPercent, not hardcoded 62 */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.25)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'white', borderRadius: '100px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* BUG 1 FIX: remaining is calculated, not hardcoded */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', color: 'white', opacity: 0.8 }}>
              {remaining > 0
                ? `Rs ${remaining.toLocaleString()} more to reach target`
                : '🎉 Monthly target reached!'}
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '100px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, color: 'white'
            }}>
              Target: Rs {TARGET_AMOUNT.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* MONTHLY STATS ROW — consistent numbers */}
      <div style={{ margin: '12px 24px 0 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {[
          { value: 18, label: 'Visits',   color: 'var(--info)'    },
          { value: 12, label: 'Checkups', color: 'var(--success)' },
          { value: 7,  label: 'Reports',  color: 'var(--accent)'  },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '14px 16px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── EARN MORE THIS WEEK — pending + inProgress tasks ── */}
      <div style={{ padding: '20px 24px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <FaTasks size={18} color="var(--accent)" />
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Earn More This Week
          </div>
        </div>

        {pendingTasks.length === 0 ? (
          <div style={{ 
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '20px',
            textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '14px'
          }}>
            🎉 All tasks completed this week!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* BUG 2 FIX: pendingTasks from unified tasks array */}
            {pendingTasks.map(task => (
              <div
                key={task.id}
                onClick={() => markComplete(task.id)}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '14px',
                  transition: 'all 0.15s', cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Status icon */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: task.status === 'pending' ? 'var(--warning-light)' : 'var(--accent-light)'
                }}>
                  {task.status === 'pending'
                    ? <FaClock size={20} color="var(--warning)" />
                    : <FaSpinner size={20} color="var(--accent)" />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                    {task.text}
                  </div>
                  <div style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: '100px',
                    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                    background: task.status === 'pending' ? 'var(--warning-light)' : 'var(--accent-light)',
                    color:      task.status === 'pending' ? 'var(--warning)'       : 'var(--accent)'
                  }}>
                    {task.status === 'pending' ? 'Pending' : 'In Progress'}
                  </div>
                </div>

                {/* BUG 1 FIX: reward shows "Rs X" not just "X" */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--success)' }}>
                    Rs {task.reward}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    Tap to complete
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── COMPLETED THIS MONTH ── */}
      <div style={{ padding: '20px 24px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <FaCheckCircle size={18} color="var(--success)" />
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Completed This Month
          </div>
          <div style={{
            marginLeft: 'auto', background: 'var(--success-light)', color: 'var(--success)',
            padding: '3px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 700
          }}>
            {completedTasks.length}
          </div>
        </div>

        {completedTasks.length === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '20px',
            textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '14px'
          }}>
            Complete tasks above to see them here.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* BUG 4 FIX: completedTasks derived from unified tasks array */}
            {completedTasks.map(task => (
              <div key={task.id}>
                {/* Completed task card — tappable for undo */}
                <div
                  onClick={() => requestUndo(task.id)}
                  style={{
                    background: 'var(--success-light)', border: '1px solid var(--success)',
                    borderRadius: undoConfirm === task.id ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-lg)',
                    padding: '14px 20px', display: 'flex', alignItems: 'center',
                    gap: '14px', opacity: 0.9, cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', background: 'var(--success)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <FaCheck size={18} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                      {task.text}
                    </div>
                  </div>
                  {/* BUG 1 FIX: reward shows "Rs X" in completed section too */}
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--success)', flexShrink: 0 }}>
                    Rs {task.reward}
                  </div>
                </div>

                {/* BUG 3 FIX: undo confirmation panel — only shows when this task is tapped */}
                {undoConfirm === task.id && (
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--success)',
                    borderTop: '1px solid var(--border-subtle)',
                    borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                    padding: '12px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'
                  }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      Mark as not completed?
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); confirmUndo(task.id); }}
                        style={{
                          padding: '6px 12px', borderRadius: 'var(--radius-md)',
                          background: 'var(--warning-light)', color: 'var(--warning)',
                          border: '1px solid var(--warning)', fontSize: '12px', fontWeight: 700,
                          cursor: 'pointer', fontFamily: 'inherit',
                          display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        <FaUndo size={10} /> Yes, undo
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setUndoConfirm(null); }}
                        style={{
                          padding: '6px 12px', borderRadius: 'var(--radius-md)',
                          background: 'transparent', color: 'var(--text-secondary)',
                          border: '1px solid var(--border)', fontSize: '12px', fontWeight: 600,
                          cursor: 'pointer', fontFamily: 'inherit'
                        }}
                      >
                        Keep completed
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TOTAL EARNED FOOTER CARD */}
      {/* BUG 1 FIX: totalEarned here is the SAME value as hero card — both derived from same state */}
      <div style={{
        margin: '16px 24px 0 24px', background: 'var(--surface)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaRupeeSign size={16} color="var(--text-primary)" />
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Total Earned This Month
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success)' }}>
            Rs {totalEarned.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            {completedTasks.length} task{completedTasks.length !== 1 ? 's' : ''} completed
          </div>
        </div>
      </div>

    </div>
  );
};

export default IncentivesScreen;
