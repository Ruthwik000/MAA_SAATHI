import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const MotherSignupScreen = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, setupRole, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    age: '',
    villageHouse: '',
    healthStatus: '', // 'pregnant' | 'new-mother'
    weeksPregnant: '',
    edd: '',
    babyDob: '',
    babyWeight: '',
    emergencyName: '',
    emergencyPhone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: false });
    }
  };

  const setHealthStatus = (status) => {
    setFormData({ ...formData, healthStatus: status });
    if (errors.healthStatus) {
      setErrors({ ...errors, healthStatus: false });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = true;
    if (!formData.phone || formData.phone.length !== 10) newErrors.phone = true;
    if (!formData.age) newErrors.age = true;
    if (!formData.villageHouse) newErrors.villageHouse = true;
    if (!formData.healthStatus) newErrors.healthStatus = true;
    if (!formData.emergencyName) newErrors.emergencyName = true;
    if (!formData.emergencyPhone) newErrors.emergencyPhone = true;

    if (formData.healthStatus === 'pregnant') {
      if (!formData.weeksPregnant) newErrors.weeksPregnant = true;
      if (!formData.edd) newErrors.edd = true;
    }
    
    if (formData.healthStatus === 'new-mother') {
      if (!formData.babyDob) newErrors.babyDob = true;
      if (!formData.babyWeight) newErrors.babyWeight = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await loginWithGoogle();
      // Even if not a strictly 'new user' via Google context alone, we will overwrite/setup the profile data
      await setupRole('mother');
      await updateProfile(formData);
      navigate('/mother/medical-history');
    } catch (err) {
      console.error(err);
      alert("Failed to sign up with Google");
    } finally {
      setLoading(false);
    }
  };

  const renderError = (field) => {
    if (errors[field]) {
      return <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>This field is required</div>;
    }
    return null;
  };

  const inputStyle = (field) => ({
    width: '100%',
    height: '48px',
    padding: '0 16px',
    borderRadius: 'var(--radius-md)',
    border: `1.5px solid ${errors[field] ? 'var(--danger)' : 'var(--border)'}`,
    backgroundColor: 'var(--surface)',
    fontSize: '15px',
    color: 'var(--text-primary)',
    outline: 'none',
    boxSizing: 'border-box'
  });

  return (
    <div className="login-container" style={{ padding: '24px 16px' }}>
      
      {/* Top Header */}
      <div className="flex items-center w-full max-w-sm m-b-24 relative">
        <button 
          onClick={() => navigate('/mother-entry')}
          className="btn-ghost p-12 text-secondary hover:text-primary transition-colors absolute"
          style={{ left: '-12px' }}
        >
          <FaArrowLeft size={20} />
        </button>
        <div className="w-full text-center">
          <h2 className="h2 text-primary">Create Account</h2>
        </div>
      </div>
      <p className="body-small text-secondary text-center m-b-24 max-w-sm">
        Register to track your health with MaaSathi
      </p>

      {/* Main Form Card */}
      <div className="login-card w-full max-w-sm" style={{ padding: '24px' }}>
        
        {/* Profile Photo Upload */}
        <div className="flex flex-col items-center m-b-32">
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <FaCamera size={28} color="var(--accent)" />
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
            Add your photo (optional)
          </p>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-16 m-b-32">
          
          <div>
            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" style={inputStyle('fullName')} />
            {renderError('fullName')}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{
              width: '60px',
              height: '48px',
              border: `1.5px solid ${errors.phone ? 'var(--danger)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              flexShrink: 0
            }}>+91</div>
            <div style={{ flex: 1 }}>
              <input type="number" name="phone" value={formData.phone} onChange={handleChange} placeholder="10 digit number" style={inputStyle('phone')} />
              {renderError('phone')}
            </div>
          </div>

          <div>
            <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Your age in years" style={inputStyle('age')} />
            {renderError('age')}
          </div>

          <div>
            <input name="villageHouse" value={formData.villageHouse} onChange={handleChange} placeholder="e.g. House 12, Ramnagar" style={inputStyle('villageHouse')} />
            {renderError('villageHouse')}
          </div>

          {/* Health Status Toggle */}
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setHealthStatus('pregnant')}
                style={{
                  flex: 1,
                  height: '40px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: formData.healthStatus === 'pregnant' ? '1.5px solid transparent' : '1.5px solid var(--accent)',
                  backgroundColor: formData.healthStatus === 'pregnant' ? 'var(--accent)' : 'transparent',
                  color: formData.healthStatus === 'pregnant' ? '#FFFFFF' : 'var(--accent)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                I am pregnant
              </button>
              <button 
                onClick={() => setHealthStatus('new-mother')}
                style={{
                  flex: 1,
                  height: '40px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: formData.healthStatus === 'new-mother' ? '1.5px solid transparent' : '1.5px solid var(--accent)',
                  backgroundColor: formData.healthStatus === 'new-mother' ? 'var(--accent)' : 'transparent',
                  color: formData.healthStatus === 'new-mother' ? '#FFFFFF' : 'var(--accent)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                I am a new mother
              </button>
            </div>
            {renderError('healthStatus')}
          </div>

          {/* Conditional Fields: Pregnant */}
          {formData.healthStatus === 'pregnant' && (
            <div className="flex flex-col gap-16 m-t-8">
              <div>
                <input type="number" name="weeksPregnant" value={formData.weeksPregnant} onChange={handleChange} placeholder="Weeks pregnant" style={inputStyle('weeksPregnant')} />
                {renderError('weeksPregnant')}
              </div>
              <div>
                <input type="date" name="edd" value={formData.edd} onChange={handleChange} style={inputStyle('edd')} />
                {renderError('edd')}
              </div>
            </div>
          )}

          {/* Conditional Fields: New Mother */}
          {formData.healthStatus === 'new-mother' && (
            <div className="flex flex-col gap-16 m-t-8">
              <div>
                <input type="date" name="babyDob" value={formData.babyDob} onChange={handleChange} style={inputStyle('babyDob')} />
                {renderError('babyDob')}
              </div>
              <div>
                <input type="number" name="babyWeight" value={formData.babyWeight} onChange={handleChange} placeholder="Baby birth weight (kg)" style={inputStyle('babyWeight')} />
                {renderError('babyWeight')}
              </div>
            </div>
          )}

          <div style={{ marginTop: '8px' }}>
            <input name="emergencyName" value={formData.emergencyName} onChange={handleChange} placeholder="Emergency Contact Name" style={inputStyle('emergencyName')} />
            {renderError('emergencyName')}
          </div>

          <div>
            <input type="number" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} placeholder="Emergency Contact Phone" style={inputStyle('emergencyPhone')} />
            {renderError('emergencyPhone')}
          </div>

        </div>

        {/* Google Signup Button */}
        <button 
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: '100%',
            height: '52px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s ease',
            color: 'var(--text-primary)'
          }}
          className="hover-scale"
        >
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '0px' }}>
            <path fill="#4285F4" d="M47.5 24.5C47.5 22.8 47.3 21.2 47.1 19.6H24.5V28.9H37.4C36.8 31.9 35.1 34.4 32.5 36.1V41.9H40.2C44.7 37.8 47.5 31.7 47.5 24.5Z" />
            <path fill="#34A853" d="M24.5 48C30.9 48 36.4 45.9 40.2 41.9L32.5 36.1C30.4 37.5 27.7 38.3 24.5 38.3C18.3 38.3 13 34.1 11.1 28.5H3.2V34.6C7.1 42.4 15.2 48 24.5 48Z" />
            <path fill="#FBBC05" d="M11.1 28.5C10.6 27 10.3 25.4 10.3 23.8C10.3 22.2 10.6 20.6 11.1 19.1V13H3.2C1.6 16.2 0.7 19.9 0.7 23.8C0.7 27.7 1.6 31.4 3.2 34.6L11.1 28.5Z" />
            <path fill="#EA4335" d="M24.5 9.4C28 9.4 31.1 10.6 33.6 12.9L40.4 6C36.3 2.3 30.9 0 24.5 0C15.2 0 7.1 5.6 3.2 13.4L11.1 19.5C13 13.9 18.3 9.4 24.5 9.4Z" />
          </svg>
          <span style={{ fontSize: '15px', fontWeight: 500 }}>
            {loading ? 'Creating...' : 'Sign up with Google'}
          </span>
        </button>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: 'var(--text-tertiary)', margin: '16px 0 0 0' }}>
          By signing up you agree to<br/>MaaSathi terms of use
        </p>

      </div>
    </div>
  );
};

export default MotherSignupScreen;
