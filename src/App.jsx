import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/auth/SplashScreen';
import WelcomeScreen from './pages/auth/WelcomeScreen';
import LoginScreen from './pages/auth/LoginScreen';
import RoleSetupScreen from './pages/auth/RoleSetupScreen';
import AshaDashboard from './pages/asha/AshaDashboard';
import PatientListScreen from './pages/asha/PatientListScreen';
import CheckupSelectionScreen from './pages/asha/CheckupSelectionScreen';
import PatientSelectionScreen from './pages/asha/PatientSelectionScreen';
import PregnantMotherSurveyScreen from './pages/asha/PregnantMotherSurveyScreen';
import NewMotherSurveyScreen from './pages/asha/NewMotherSurveyScreen';
import PatientProfileScreen from './pages/asha/PatientProfileScreen';
import AIReportResultScreen from './pages/shared/AIReportResultScreen';
import AddPatientScreen from './pages/asha/AddPatientScreen';
import VillageOverviewScreen from './pages/asha/VillageOverviewScreen';
import IncentivesScreen from './pages/asha/IncentivesScreen';
import AshaProfileScreen from './pages/asha/AshaProfileScreen';

import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AlertDetailScreen from './pages/doctor/AlertDetailScreen';
import PatientHistoryScreen from './pages/doctor/PatientHistoryScreen';
import DoctorProfileScreen from './pages/doctor/DoctorProfileScreen';
import ReportsListScreen from './pages/doctor/ReportsListScreen';
import ReportViewerScreen from './pages/doctor/ReportViewerScreen';

import MotherDashboard from './pages/mother/MotherDashboard';
import MotherVitalsScreen from './pages/mother/MotherVitalsScreen';
import MotherProfileScreen from './pages/mother/MotherProfileScreen';
import MotherEntryScreen from './pages/mother/MotherEntryScreen';
import MotherSignupScreen from './pages/mother/MotherSignupScreen';
import MotherMedicalHistoryScreen from './pages/mother/MotherMedicalHistoryScreen';
import MotherReportsScreen from './pages/mother/MotherReportsScreen';
import MotherReportViewerScreen from './pages/mother/MotherReportViewerScreen';
import PatientTypeSelect from './pages/auth/PatientTypeSelect';

import ElderlyHealthSurvey from './pages/patient/ElderlyHealthSurvey';
import WellnessHealthSurvey from './pages/patient/WellnessHealthSurvey';
import ElderlyDashboard from './pages/patient/ElderlyDashboard';
import WellnessDashboard from './pages/patient/WellnessDashboard';
import CaretakerType from './pages/auth/CaretakerType';
import FamilyDashboard from './pages/family/FamilyDashboard';
import CaretakerVitals from './pages/caretaker/CaretakerVitals';
import CaretakerReports from './pages/caretaker/CaretakerReports';
import CaretakerAlerts from './pages/caretaker/CaretakerAlerts';
import CaretakerProfile from './pages/caretaker/CaretakerProfile';

import ReportViewer from './pages/shared/ReportViewer';

import RingAlertScreen from './pages/shared/RingAlertScreen';
import SettingsScreen from './pages/shared/SettingsScreen';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth & Setup */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/role-setup" element={<RoleSetupScreen />} />
        <Route path="/patient-type-select" element={<PatientTypeSelect />} />
        
        {/* Patient / Elderly / Wellness Surveys */}
        <Route path="/elderly/health-survey" element={<ElderlyHealthSurvey />} />
        <Route path="/wellness/health-survey" element={<WellnessHealthSurvey />} />
        
        {/* Dashboards */}
        <Route path="/dashboard/elderly" element={<ElderlyDashboard />} />
        <Route path="/dashboard/wellness" element={<WellnessDashboard />} />
        
        {/* ASHA Routes */}
        <Route path="/asha/dashboard" element={<AshaDashboard />} />
        <Route path="/asha/profile" element={<AshaProfileScreen />} />
        <Route path="/asha/patients" element={<PatientListScreen />} />
        <Route path="/asha/patients/add" element={<AddPatientScreen />} />
        <Route path="/asha/patients/:id" element={<PatientProfileScreen />} />
        <Route path="/asha/village" element={<VillageOverviewScreen />} />
        <Route path="/asha/incentives" element={<IncentivesScreen />} />
        <Route path="/checkup/select-type" element={<CheckupSelectionScreen />} />
        <Route path="/checkup/select-patient" element={<PatientSelectionScreen />} />
        <Route path="/asha/surveys/pregnant" element={<PregnantMotherSurveyScreen />} />
        <Route path="/asha/surveys/new-mother" element={<NewMotherSurveyScreen />} />
        
        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/alert/:id" element={<AlertDetailScreen />} />
        <Route path="/doctor/patients" element={<PatientHistoryScreen />} />
        <Route path="/doctor/profile" element={<DoctorProfileScreen />} />
        <Route path="/doctor/reports" element={<ReportsListScreen />} />
        <Route path="/doctor/report/:id" element={<ReportViewerScreen />} />

        {/* Patient / Mother Routes */}
        <Route path="/mother-entry" element={<MotherEntryScreen />} />
        <Route path="/mother-signup" element={<MotherSignupScreen />} />
        <Route path="/mother/dashboard" element={<MotherDashboard />} />
        <Route path="/mother/reports" element={<MotherReportsScreen />} />
        <Route path="/mother/report/:id" element={<MotherReportViewerScreen />} />
        <Route path="/mother/vitals" element={<MotherVitalsScreen />} />
        <Route path="/mother/profile" element={<MotherProfileScreen />} />
        <Route path="/mother/medical-history" element={<MotherMedicalHistoryScreen />} />
        <Route path="/mother/health-history" element={<MotherMedicalHistoryScreen />} />

        {/* Caretaker & Family Routes */}
        <Route path="/caretaker-type" element={<CaretakerType />} />
        <Route path="/family-dashboard" element={<FamilyDashboard />} />
        <Route path="/caretaker/dashboard" element={<FamilyDashboard />} />
        <Route path="/family-patients" element={<FamilyDashboard />} />
        <Route path="/family-alerts" element={<FamilyDashboard />} />
        <Route path="/family-reports" element={<FamilyDashboard />} />
        <Route path="/family-profile" element={<FamilyDashboard />} />
        <Route path="/caretaker/vitals" element={<CaretakerVitals />} />
        <Route path="/caretaker/reports" element={<CaretakerReports />} />
        <Route path="/caretaker/alerts" element={<CaretakerAlerts />} />
        <Route path="/caretaker/profile" element={<CaretakerProfile />} />
        
        {/* Alias / Patient specific */}
        <Route path="/patient/dashboard" element={<ElderlyDashboard />} />

        {/* Shared / Global Routes */}
        <Route path="/shared/ai-report" element={<AIReportResultScreen />} />
        <Route path="/report/:reportId" element={<ReportViewer />} />
        <Route path="/shared/ring-alert" element={<RingAlertScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        
      </Routes>
    </Router>
  );
}

export default App;
