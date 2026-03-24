import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaEdit, FaCamera, FaSignOutAlt,
  FaChartLine, FaUser, FaCheck, FaTimes, FaSpinner
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { AppContext } from '../../context/AppContext';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { COLLECTIONS, validateFirestoreDocument } from '../../config/firebaseSchema';

// Firebase Storage — imported lazily so the app still works
// if storage isn't configured
let getStorage, ref, uploadBytes, getDownloadURL;
try {
  const storageModule = await import('firebase/storage').catch(() => null);
  if (storageModule) {
    ({ getStorage, ref, uploadBytes, getDownloadURL } = storageModule);
  }
} catch (_) {}

const AshaProfileScreen = () => {
  const navigate = useNavigate();
  const { user, profile, logout, updateProfile } = useAuth();
  const { language } = useLanguage();
  const { currentUser, updateCurrentUser } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [toast, setToast] = useState('');

  const [formData, setFormData] = useState({
    name:        currentUser?.name        || profile?.name        || 'Lakshmi Devi',
    phone:       currentUser?.phone       || profile?.email       || '+91 9876543210',
    ashaId:      currentUser?.ashaId      || profile?.ashaId      || 'ASHA-2023-458',
    village:     currentUser?.village     || profile?.village     || 'Ramgarh',
    yearsService: currentUser?.yearsService || profile?.yearsService || '3',
    dateJoined:  currentUser?.dateJoined  || profile?.dateJoined  || '2023-01-15',
  });

  const [savedData, setSavedData] = useState({ ...formData });

  // Photo: context wins over profile wins over empty
  const profilePhoto = (photoError ? '' : (currentUser?.photoURL || profile?.photoURL || ''));

  const stats = { patients: 24, visits: 42, criticalReports: 5 };

  const UI = {
    en: {
      title: 'My Profile', role: 'ASHA Worker', personalDetails: 'Personal Details',
      yourActivity: 'Your Activity', cName: 'Full Name', cPhone: 'Phone Number',
      cId: 'ASHA ID Number', cVillage: 'Village Assigned', cYears: 'Years of Service',
      cDate: 'Date Joined', sPatients: 'Total\nPatients', sVisits: 'Visits This\nMonth',
      sCritical: 'Critical\nReports', save: 'Save Changes', cancel: 'Cancel',
      logout: 'Logout', saving: 'Saving...', uploading: 'Uploading photo...',
      toastOk: 'Profile updated successfully!', toastPhotoOk: 'Photo saved!',
      toastErr: 'Error saving profile', edit: 'Edit',
    },
    te: {
      title: 'నా ప్రొఫైల్', role: 'ASHA కార్యకర్త', personalDetails: 'వ్యక్తిగత వివరాలు',
      yourActivity: 'మీ కార్యాచరణ', cName: 'పూర్తి పేరు', cPhone: 'ఫోన్ నంబర్',
      cId: 'ASHA ID నంబర్', cVillage: 'కేటాయించిన గ్రామం', cYears: 'సేవా సంవత్సరాలు',
      cDate: 'చేరిన తేదీ', sPatients: 'మొత్తం\nపేషెంట్లు', sVisits: 'ఈ నెల\nసందర్శనలు',
      sCritical: 'క్రిటికల్\nరిపోర్ట్లు', save: 'మార్పులు సేవ్ చేయండి', cancel: 'రద్దు చేయండి',
      logout: 'లాగ్ అవుట్', saving: 'సేవ్ అవుతోంది...', uploading: 'ఫోటో అప్‌లోడ్ అవుతోంది...',
      toastOk: 'ప్రొఫైల్ అప్‌డేట్ చేయబడింది!', toastPhotoOk: 'ఫోటో సేవ్ చేయబడింది!',
      toastErr: 'ప్రొఫైల్ సేవ్ చేయడంలో లోపం', edit: 'మార్చండి',
    }
  };
  const t = UI[language] || UI.en;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleEdit   = () => { setSavedData({ ...formData }); setIsEditing(true); };
  const handleCancel = () => { setFormData({ ...savedData }); setIsEditing(false); };

  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. Update Firestore
      if (user) {
        const profilePatch = {
          name: formData.name,
          ashaId: formData.ashaId,
          village: formData.village,
          yearsService: formData.yearsService,
          updatedAt: new Date()
        };
        validateFirestoreDocument('users', profilePatch, { partial: true });
        await updateDoc(doc(db, COLLECTIONS.users, user.uid), profilePatch);
        // Also call the hook's updateProfile to refresh local profile state
        if (updateProfile) await updateProfile(formData);
      }
      // 2. Update AppContext so dashboard greeting refreshes immediately
      updateCurrentUser({
        name: formData.name,
        ashaId: formData.ashaId,
        village: formData.village,
        yearsService: formData.yearsService,
        dateJoined: formData.dateJoined,
        phone: formData.phone,
      });
      setSavedData({ ...formData });
      showToast(t.toastOk);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      showToast(t.toastErr);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      localStorage.clear();
      navigate('/welcome', { replace: true });
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  // Bug 5 fix: functional photo upload with Firebase Storage
  const handlePhotoUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type  = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Always show a local preview immediately
      const localURL = URL.createObjectURL(file);
      setPhotoError(false);
      updateCurrentUser({ photoURL: localURL });

      // Try to upload to Firebase Storage if available
      if (getStorage && user) {
        try {
          setUploadingPhoto(true);
          const storage   = getStorage();
          const storageRef = ref(storage, `profiles/${user.uid}_${Date.now()}`);
          const snapshot  = await uploadBytes(storageRef, file);
          const photoURL  = await getDownloadURL(snapshot.ref);

          // Save URL to Firestore
          const photoPatch = { photoURL };
          validateFirestoreDocument('users', photoPatch, { partial: true });
          await updateDoc(doc(db, COLLECTIONS.users, user.uid), photoPatch);

          // Update AppContext with the permanent Firebase URL
          updateCurrentUser({ photoURL });
          showToast(t.toastPhotoOk);
        } catch (err) {
          console.error('Photo upload error:', err);
          // Keep local preview — Firebase storage may not be configured
          showToast(t.toastPhotoOk + ' (local only)');
        } finally {
          setUploadingPhoto(false);
        }
      } else {
        // No Firebase Storage — keep local base64
        const reader = new FileReader();
        reader.onloadend = () => {
          updateCurrentUser({ photoURL: reader.result });
          showToast(t.toastPhotoOk);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const initials = formData.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const inputStyle = {
    width: '100%', height: '44px', background: 'var(--bg-secondary)',
    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
    padding: '0 12px', fontSize: '15px', fontFamily: '"DM Sans", sans-serif',
    color: 'var(--text-primary)', boxSizing: 'border-box', outline: 'none',
    transition: 'border-color 0.15s',
  };
  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '1px',
    color: 'var(--text-tertiary)', marginBottom: '4px',
  };
  const valueStyle = { fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)' };
  const sectionHeaderStyle = {
    padding: '16px 24px 12px 24px', display: 'flex', alignItems: 'center',
    gap: '8px', borderBottom: '1px solid var(--border-subtle)',
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)', minHeight: '100dvh',
      paddingBottom: '96px', fontFamily: '"DM Sans", sans-serif'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        .prof-input:focus { border-color: var(--accent) !important; }
        .prof-logout:hover { background: var(--danger-light) !important; }
      `}} />

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: '76px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text-primary)', color: 'white',
          padding: '12px 24px', borderRadius: '100px',
          fontSize: '14px', fontWeight: 600, zIndex: 200,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)', whiteSpace: 'nowrap'
        }}>
          {toast}
        </div>
      )}

      {/* STICKY HEADER */}
      <header className="responsive-px" style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        paddingTop: '16px', paddingBottom: '16px', position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 'calc(16px + env(safe-area-inset-top))'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0
          }}>
            <FaArrowLeft size={16} color="var(--text-primary)" />
          </button>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {t.title}
          </span>
        </div>
        {!isEditing && (
          <button onClick={handleEdit} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--accent-light)', color: 'var(--accent)',
            border: 'none', borderRadius: 'var(--radius-md)',
            padding: '8px 14px', fontSize: '13px', fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer'
          }}>
            <FaEdit size={14} />{t.edit}
          </button>
        )}
      </header>

      {/* HERO — AVATAR */}
      <div className="responsive-px" style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        paddingTop: '28px', paddingBottom: '28px', marginBottom: '16px', textAlign: 'center'
      }}>
        <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 12px auto' }}>
          {/* Spinner overlay while uploading */}
          {uploadingPhoto && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'rgba(0,0,0,0.45)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 2
            }}>
              <FaSpinner size={24} color="white" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          )}

          {/* Avatar: photo or initials */}
          {profilePhoto && !photoError ? (
            <img
              src={profilePhoto}
              alt="Profile"
              onError={() => setPhotoError(true)}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                borderRadius: '50%', border: '3px solid var(--accent)', display: 'block'
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%',
              background: 'var(--accent-light)', color: 'var(--accent)',
              fontSize: '32px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '3px solid var(--accent)', boxSizing: 'border-box'
            }}>
              {initials}
            </div>
          )}

          {/* Functional camera button */}
          <button
            onClick={handlePhotoUpload}
            disabled={uploadingPhoto}
            title="Upload photo"
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '30px', height: '30px', borderRadius: '50%',
              background: uploadingPhoto ? 'var(--text-tertiary)' : 'var(--accent)',
              border: '2px solid white', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: uploadingPhoto ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.18)', zIndex: 3
            }}
          >
            <FaCamera size={13} color="white" />
          </button>
        </div>

        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {formData.name}
        </div>
        <div style={{
          display: 'inline-block', background: 'var(--accent-light)', color: 'var(--accent)',
          padding: '4px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, marginTop: '6px'
        }}>
          {t.role}
        </div>
        {uploadingPhoto && (
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
            {t.uploading}
          </div>
        )}
      </div>

      {/* PERSONAL DETAILS CARD */}
      <div style={{
        background: 'var(--surface)', borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)', marginBottom: '16px'
      }}>
        <div className="responsive-px" style={sectionHeaderStyle}>
          <FaUser size={16} color="var(--accent)" />
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {t.personalDetails}
          </span>
        </div>
        <div className="responsive-px" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {/* Full Name — full width */}
          <div style={{ gridColumn: '1 / -1', padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <label style={labelStyle}>{t.cName}</label>
            {isEditing
              ? <input type="text" className="prof-input" value={formData.name}
                  onChange={e => handleChange('name', e.target.value)} style={inputStyle} />
              : <span style={valueStyle}>{formData.name}</span>}
          </div>
          {/* Phone — read only */}
          <div style={{ gridColumn: '1 / -1', padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <label style={labelStyle}>{t.cPhone}</label>
            <span style={{ ...valueStyle, color: 'var(--text-secondary)' }}>{formData.phone}</span>
          </div>
          {/* ASHA ID | Village */}
          <div style={{ padding: '14px 12px 14px 0', borderBottom: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
            <label style={labelStyle}>{t.cId}</label>
            {isEditing
              ? <input type="text" className="prof-input" value={formData.ashaId}
                  onChange={e => handleChange('ashaId', e.target.value)} style={inputStyle} />
              : <span style={valueStyle}>{formData.ashaId}</span>}
          </div>
          <div style={{ padding: '14px 0 14px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
            <label style={labelStyle}>{t.cVillage}</label>
            {isEditing
              ? <input type="text" className="prof-input" value={formData.village}
                  onChange={e => handleChange('village', e.target.value)} style={inputStyle} />
              : <span style={valueStyle}>{formData.village}</span>}
          </div>
          {/* Years | Date */}
          <div style={{ padding: '14px 12px 14px 0', borderRight: '1px solid var(--border-subtle)' }}>
            <label style={labelStyle}>{t.cYears}</label>
            {isEditing
              ? <input type="number" className="prof-input" value={formData.yearsService}
                  onChange={e => handleChange('yearsService', e.target.value)} style={inputStyle} />
              : <span style={valueStyle}>{formData.yearsService}</span>}
          </div>
          <div style={{ padding: '14px 0 14px 12px' }}>
            <label style={labelStyle}>{t.cDate}</label>
            {isEditing
              ? <input type="date" className="prof-input" value={formData.dateJoined}
                  onChange={e => handleChange('dateJoined', e.target.value)}
                  style={{ ...inputStyle, fontFamily: '"DM Sans", sans-serif' }} />
              : <span style={valueStyle}>{formData.dateJoined}</span>}
          </div>
        </div>
      </div>

      {/* SAVE / CANCEL — fixed bottom in edit mode */}
      {isEditing && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--surface)', borderTop: '1px solid var(--border)',
          padding: '12px 24px 24px 24px', display: 'flex', flexDirection: 'column',
          gap: '10px', zIndex: 80
        }}>
          <button onClick={handleSave} disabled={loading} style={{
            width: '100%', height: '52px', background: 'var(--accent)', color: 'white',
            border: 'none', borderRadius: 'var(--radius-md)', fontSize: '16px', fontWeight: 700,
            fontFamily: '"DM Sans", sans-serif', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(194,24,91,0.25)'
          }}>
            <FaCheck size={16} />
            {loading ? t.saving : t.save}
          </button>
          <button onClick={handleCancel} disabled={loading} style={{
            width: '100%', height: '44px', background: 'transparent',
            color: 'var(--text-secondary)', border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 600,
            fontFamily: '"DM Sans", sans-serif', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <FaTimes size={14} />{t.cancel}
          </button>
        </div>
      )}

      {/* ACTIVITY STATS CARD */}
      {!isEditing && (
        <div style={{
          background: 'var(--surface)', borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)', marginBottom: '16px'
        }}>
          <div className="responsive-px" style={sectionHeaderStyle}>
            <FaChartLine size={16} color="var(--accent)" />
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {t.yourActivity}
            </span>
          </div>
          <div className="responsive-px" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', paddingBottom: '20px', paddingTop: '16px' }}>
            {[
              { value: stats.patients,       label: t.sPatients, color: 'var(--info)'   },
              { value: stats.visits,          label: t.sVisits,   color: 'var(--accent)' },
              { value: stats.criticalReports, label: t.sCritical, color: 'var(--danger)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
                padding: '14px 12px', textAlign: 'center', border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{
                  fontSize: '11px', fontWeight: 500, textTransform: 'uppercase',
                  letterSpacing: '0.8px', color: 'var(--text-tertiary)',
                  marginTop: '6px', lineHeight: 1.3, whiteSpace: 'pre-line'
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOGOUT */}
      {!isEditing && (
        <div className="responsive-px" style={{ marginBottom: '24px' }}>
          <button onClick={handleLogout} className="prof-logout" style={{
            width: '100%', height: '52px', background: 'transparent',
            color: 'var(--danger)', border: '1.5px solid var(--danger)',
            borderRadius: 'var(--radius-md)', fontSize: '15px', fontWeight: 600,
            fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.15s'
          }}>
            <FaSignOutAlt size={18} />{t.logout}
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default AshaProfileScreen;
