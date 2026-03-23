const fs = require('fs');
const path = require('path');

const fileList = [
  'src/pages/asha/AshaDashboard.jsx',
  'src/pages/asha/PatientListScreen.jsx',
  'src/pages/asha/VillageOverviewScreen.jsx',
  'src/pages/asha/AshaProfileScreen.jsx',
  'src/pages/asha/AddPatientScreen.jsx',
  'src/pages/asha/PregnantMotherSurveyScreen.jsx',
  'src/pages/asha/NewMotherSurveyScreen.jsx',
  'src/pages/asha/CheckupSelectionScreen.jsx',
  'src/pages/asha/IncentivesScreen.jsx',
  'src/pages/auth/LoginScreen.jsx',
  'src/pages/auth/RoleSetupScreen.jsx',
  'src/pages/auth/WelcomeScreen.jsx',
  'src/pages/doctor/DoctorDashboard.jsx',
  'src/pages/doctor/AlertDetailScreen.jsx',
  'src/pages/doctor/DoctorProfileScreen.jsx',
  'src/pages/doctor/PatientHistoryScreen.jsx',
  'src/pages/mother/MotherDashboard.jsx',
  'src/pages/mother/MotherProfileScreen.jsx',
  'src/pages/mother/MotherSignupScreen.jsx',
  'src/pages/mother/MotherEntryScreen.jsx',
  'src/pages/mother/MotherVitalsScreen.jsx',
  'src/pages/shared/AIReportResultScreen.jsx',
  'src/pages/shared/RingAlertScreen.jsx'
];

function getRelativeDepth(filePath) {
  const depth = filePath.split('/').length - 2; 
  return depth > 0 ? '../'.repeat(depth) : './';
}

fileList.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  // Inject import
  if (!code.includes('useTranslation')) {
    const importStr = `import { useTranslation } from '${getRelativeDepth(file)}hooks/useTranslation';\n`;
    code = code.replace(/import React/, importStr + 'import React');
  }

  // Inject const t = useTranslation(); inside component
  const compRegex = /(const \w+ = \([^)]*\) => {\n)/;
  if (!code.includes('const t = useTranslation()')) {
    code = code.replace(compRegex, `$1  const t = useTranslation();\n`);
  }

  // A manual robust array of replacements replacing exact JSX text or exact local dictionaries.
  // Instead of risking syntax errors on 20+ files via regex, we specifically replace the 'const t = { en: ... }' block where it exists.
  
  const localDictRegex = /const t = \{\s*en: \{[^]*?te: \{[^]*?\}\s*\};\s*const text = t\[language\] \|\| t\.en;/g;
  code = code.replace(localDictRegex, '// Translations moved to global hook');
  
  // Replace references to `text.` with `t.something.` for the specific file
  if (file.includes('AshaDashboard')) {
    code = code.replace(/text\.greeting/g, 't.dashboard.greeting("Lakshmi")');
    code = code.replace(/text\.visits/g, 't.dashboard.visitsToday(4)');
    code = code.replace(/text\.alertTitle/g, 't.emergency.emergencyAlert');
    code = code.replace(/text\.alertPatient/g, '"Meera Bai"');
    code = code.replace(/text\.alertReason/g, 't.dashboard.ringSOSPressed');
    code = code.replace(/text\.viewBtn/g, 't.common.viewAll');
    code = code.replace(/text\.coverage/g, 't.dashboard.villageCoverage');
    code = code.replace(/text\.pending/g, 't.dashboard.pendingVisits');
    code = code.replace(/text\.reports/g, 't.dashboard.reportsSent');
    code = code.replace(/text\.quickActions/g, 't.dashboard.quickActions');
    code = code.replace(/text\.qa1sub/g, 't.dashboard.startCheckupSub');
    code = code.replace(/text\.qa2sub/g, 't.dashboard.addPatientSub');
    code = code.replace(/text\.qa3sub/g, 't.dashboard.villageMapSub');
    code = code.replace(/text\.qa4sub/g, 't.dashboard.myIncentivesSub');
    code = code.replace(/text\.qa1/g, 't.dashboard.startCheckup');
    code = code.replace(/text\.qa2/g, 't.dashboard.addPatient');
    code = code.replace(/text\.qa3/g, 't.dashboard.villageMap');
    code = code.replace(/text\.qa4/g, 't.dashboard.myIncentives');
    code = code.replace(/text\.priorityHomes/g, 't.dashboard.priorityHomes');
    code = code.replace(/text\.viewAll/g, 't.common.viewAll');
  }
  
  if (file.includes('VillageOverviewScreen')) {
    code = code.replace(/"Village Overview"/g, '{t.village.title}');
    code = code.replace(/"Total Homes"/g, '{t.village.totalHomes}');
    code = code.replace(/"High Risk"/g, '{t.village.highRisk}');
    code = code.replace(/"Safe"/g, '{t.village.safe}');
    code = code.replace(/"Visited today"/g, '{t.village.visitedToday}');
    code = code.replace(/"Visited yesterday"/g, '{t.village.visitedYesterday}');
  }

  if (file.includes('WelcomeScreen')) {
    code = code.replace(/"Empowering every"/g, '{t.auth.welcomeTitle1}');
    code = code.replace(/"village, every mother\."/g, '{t.auth.welcomeTitle2}');
    code = code.replace(/"A real-time health companion for ASHA workers and rural mothers across India\."/g, '{t.auth.welcomeSubtitle}');
    code = code.replace(/"Login as ASHA Worker"/g, '{t.auth.loginAsAsha}');
    code = code.replace(/"Login as Doctor or Nurse"/g, '{t.auth.loginAsDoctor}');
    code = code.replace(/"I am a Mother"/g, '{t.auth.iAmMother}');
  }

  // General strict replacements across all screens
  code = code.replace(/"Save"/g, '{t.common.save}');
  code = code.replace(/"Cancel"/g, '{t.common.cancel}');
  code = code.replace(/"Back"/g, '{t.common.back}');
  code = code.replace(/"Success"/g, '{t.common.success}');

  fs.writeFileSync(file, code);
  console.log('Processed', file);
});
console.log('Script execution partial complete block.');
