import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop, FaPlay, FaPause, FaTrash, FaCheck } from 'react-icons/fa';

/**
 * VoiceRecorder — reusable component
 * 
 * Props:
 *   onRecordingComplete(blob, durationSeconds) — called when recording is stopped
 *   language — 'en' | 'te'  (for UI labels)
 *   compact — boolean, show minimal UI (default: false)
 */
const VoiceRecorder = ({ onRecordingComplete, language = 'en', compact = false }) => {
  const [state, setState]           = useState('idle');  // idle | recording | done
  const [audioURL, setAudioURL]     = useState('');
  const [isPlaying, setIsPlaying]   = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);
  const [recSeconds, setRecSeconds] = useState(0);       // live recording timer

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const audioRef         = useRef(new Audio());
  const timerRef         = useRef(null);

  const ui = {
    en: {
      tapRecord:  'Tap to record a voice note',
      recording:  'Recording...',
      tapStop:    'Tap to stop',
      play:       'Play',
      pause:      'Pause',
      discard:    'Discard',
      keep:       'Use recording',
      noSupport:  'Voice recording not supported in this browser',
    },
    te: {
      tapRecord:  'వాయిస్ నోట్ రికార్డ్ చేయడానికి నొక్కండి',
      recording:  'రికార్డ్ అవుతోంది...',
      tapStop:    'ఆపడానికి నొక్కండి',
      play:       'ప్లే చేయండి',
      pause:      'పాజ్',
      discard:    'తొలగించండి',
      keep:       'ఉపయోగించు',
      noSupport:  'ఈ బ్రౌజర్‌లో వాయిస్ రికార్డింగ్ మద్దతు లేదు',
    }
  };
  const t = ui[language] || ui.en;

  const supported = !!(navigator.mediaDevices?.getUserMedia) &&
                    !!(window.MediaRecorder);

  // Format MM:SS
  const fmt = (s) => {
    const m = Math.floor((s || 0) / 60);
    const sec = Math.floor((s || 0) % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Wire audio element events once
  useEffect(() => {
    const audio = audioRef.current;
    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) setDuration(audio.duration);
    };
    audio.onended = () => { setIsPlaying(false); setCurrentTime(0); };
    audio.onloadedmetadata = () => {
      if (!isNaN(audio.duration)) setDuration(audio.duration);
    };
    return () => {
      audio.ontimeupdate = null;
      audio.onended = null;
      audio.onloadedmetadata = null;
    };
  }, []);

  // Live recording timer
  useEffect(() => {
    if (state === 'recording') {
      setRecSeconds(0);
      timerRef.current = setInterval(() => setRecSeconds(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [state]);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => { if (audioURL) URL.revokeObjectURL(audioURL); };
  }, [audioURL]);

  const startRecording = async () => {
    if (!supported) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url  = URL.createObjectURL(blob);
        setAudioURL(url);
        audioRef.current.src = url;
        setState('done');
        // Tell parent about the blob + duration
        if (onRecordingComplete) onRecordingComplete(blob, recSeconds);
        // Stop all mic tracks
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setState('recording');
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const seekTo = (e) => {
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const discard = () => {
    audioRef.current.pause();
    audioRef.current.src = '';
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL('');
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setRecSeconds(0);
    setState('idle');
    if (onRecordingComplete) onRecordingComplete(null, 0);
  };

  if (!supported) {
    return (
      <div style={{
        padding: '10px 14px', background: 'var(--bg-secondary)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
        fontSize: '13px', color: 'var(--text-tertiary)'
      }}>
        {t.noSupport}
      </div>
    );
  }

  // ── IDLE STATE ─────────────────────────────────────────────────────────────
  if (state === 'idle') {
    return (
      <button
        onClick={startRecording}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'var(--accent-light)',
          border: '1.5px solid var(--accent)',
          borderRadius: 'var(--radius-md)',
          padding: compact ? '8px 14px' : '12px 16px',
          cursor: 'pointer', width: '100%',
          transition: 'all 0.15s', fontFamily: 'inherit'
        }}
      >
        <div style={{
          width: compact ? '32px' : '40px', height: compact ? '32px' : '40px',
          borderRadius: '50%', background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <FaMicrophone size={compact ? 14 : 18} color="white" />
        </div>
        <span style={{ fontSize: compact ? '13px' : '14px', fontWeight: 600, color: 'var(--accent)' }}>
          {t.tapRecord}
        </span>
      </button>
    );
  }

  // ── RECORDING STATE ────────────────────────────────────────────────────────
  if (state === 'recording') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        background: 'var(--danger-light)', border: '1.5px solid var(--danger)',
        borderRadius: 'var(--radius-md)', padding: compact ? '8px 14px' : '12px 16px'
      }}>
        {/* Animated pulse dot */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: compact ? '32px' : '40px', height: compact ? '32px' : '40px',
            borderRadius: '50%', background: 'var(--danger)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FaMicrophone size={compact ? 14 : 18} color="white" />
          </div>
          {/* Ripple */}
          <div style={{
            position: 'absolute', inset: '-4px', borderRadius: '50%',
            border: '2px solid var(--danger)', opacity: 0.4,
            animation: 'vr-ripple 1.2s ease-out infinite'
          }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--danger)' }}>
            {t.recording}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--danger)', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(recSeconds)}
          </div>
        </div>

        {/* Stop button */}
        <button
          onClick={stopRecording}
          style={{
            width: compact ? '36px' : '44px', height: compact ? '36px' : '44px',
            borderRadius: '50%', background: 'var(--danger)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0
          }}
        >
          <FaStop size={compact ? 12 : 16} color="white" />
        </button>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes vr-ripple {
            0%   { transform: scale(1);   opacity: 0.5; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        `}} />
      </div>
    );
  }

  // ── DONE STATE (playback) ──────────────────────────────────────────────────
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      background: 'var(--surface)', border: '1.5px solid var(--accent)',
      borderRadius: 'var(--radius-md)', padding: compact ? '10px 14px' : '14px 16px',
      display: 'flex', flexDirection: 'column', gap: '10px'
    }}>
      {/* Top row: play button + waveform progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={togglePlayback}
          style={{
            width: compact ? '36px' : '44px', height: compact ? '36px' : '44px',
            borderRadius: '50%', background: 'var(--accent)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0
          }}
        >
          {isPlaying
            ? <FaPause size={compact ? 12 : 16} color="white" />
            : <FaPlay  size={compact ? 12 : 16} color="white" style={{ marginLeft: '2px' }} />}
        </button>

        <div style={{ flex: 1 }}>
          {/* Clickable progress track */}
          <div
            onClick={seekTo}
            style={{
              height: '6px', background: 'var(--border)',
              borderRadius: '100px', cursor: 'pointer', position: 'relative'
            }}
          >
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'var(--accent)', borderRadius: '100px',
              transition: 'width 0.1s linear'
            }} />
          </div>
          {/* Time */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '4px', fontSize: '11px', color: 'var(--text-tertiary)',
            fontVariantNumeric: 'tabular-nums'
          }}>
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>

      {/* Bottom row: discard + confirm */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={discard}
          style={{
            flex: 1, height: '36px',
            background: 'transparent', color: 'var(--danger)',
            border: '1.5px solid var(--danger)', borderRadius: 'var(--radius-md)',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontFamily: 'inherit'
          }}
        >
          <FaTrash size={12} />{t.discard}
        </button>
        <button
          onClick={() => setState('done')} // already saved via onRecordingComplete
          style={{
            flex: 1, height: '36px',
            background: 'var(--accent)', color: 'white',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontFamily: 'inherit'
          }}
        >
          <FaCheck size={12} />{t.keep}
        </button>
      </div>
    </div>
  );
};

export default VoiceRecorder;
