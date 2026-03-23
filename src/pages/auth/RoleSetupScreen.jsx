import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserNurse, FaStethoscope, FaFemale, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const RoleSetupScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setupRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(location.state?.preSelectedRole || null);
  
  const handleCompleteSetup = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      await setupRole(selectedRole);
      navigate(`/${selectedRole}/dashboard`);
    } catch (e) {
      console.error(e);
      setLoading(false);
      alert("Role setup failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary px-24 py-40">
      <div className="w-full max-w-md">
        <h1 className="display text-center m-b-8">Welcome to MaaSathi</h1>
        <p className="body-large text-secondary text-center m-b-40">
          Please select your role to continue.
        </p>

        <div className="flex flex-col gap-16">
          <button 
            onClick={() => setSelectedRole('asha')}
            className={`card flex items-center justify-between p-24 w-full transition-all text-left border-2 ${selectedRole === 'asha' ? 'border-accent bg-accent-subtle shadow-elevated' : 'border-[var(--border)] bg-surface'}`}
          >
            <div className="flex items-center gap-16">
              <div className="p-16 rounded-pill" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                <FaUserNurse size={24} />
              </div>
              <div>
                <h3 className="h2 text-primary">ASHA Worker</h3>
                <p className="body-small text-secondary" style={{textTransform:'none', marginTop: '4px'}}>Community health volunteer</p>
              </div>
            </div>
            {selectedRole === 'asha' && <FaCheck size={20} className="text-accent" />}
          </button>

          <button 
            onClick={() => setSelectedRole('doctor')}
            className={`card flex items-center justify-between p-24 w-full transition-all text-left border-2 ${selectedRole === 'doctor' ? 'border-info bg-info-light shadow-elevated' : 'border-[var(--border)] bg-surface'}`}
          >
            <div className="flex items-center gap-16">
              <div className="p-16 rounded-pill" style={{ backgroundColor: '#E3F2FD', color: 'var(--info)' }}>
                <FaStethoscope size={24} />
              </div>
              <div>
                <h3 className="h2 text-primary">Doctor or Nurse</h3>
                <p className="body-small text-secondary" style={{textTransform:'none', marginTop: '4px'}}>PHC Medical Officer or ANM</p>
              </div>
            </div>
            {selectedRole === 'doctor' && <FaCheck size={20} className="text-info" />}
          </button>

          <button 
            onClick={() => setSelectedRole('mother')}
            className={`card flex items-center justify-between p-24 w-full transition-all text-left border-2 ${selectedRole === 'mother' ? 'border-success bg-success-light shadow-elevated' : 'border-[var(--border)] bg-surface'}`}
          >
            <div className="flex items-center gap-16">
              <div className="p-16 rounded-pill" style={{ backgroundColor: '#DCFCE7', color: 'var(--success)' }}>
                <FaFemale size={24} />
              </div>
              <div>
                <h3 className="h2 text-primary">Mother</h3>
                <p className="body-small text-secondary" style={{textTransform:'none', marginTop: '4px'}}>Pregnant or New Mother</p>
              </div>
            </div>
            {selectedRole === 'mother' && <FaCheck size={20} className="text-success" />}
          </button>
        </div>

        <button 
          className="btn btn-primary w-full m-t-40"
          onClick={handleCompleteSetup}
          disabled={!selectedRole || loading}
          style={{ opacity: selectedRole && !loading ? 1 : 0.6, height: '56px' }}
        >
          {loading ? 'Setting up profile...' : 'Continue to Dashboard'}
        </button>
      </div>
    </div>
  );
};

export default RoleSetupScreen;
