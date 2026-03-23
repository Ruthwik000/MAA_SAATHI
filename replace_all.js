const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Recursive function to get files
function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, filesList);
    } else if (fullPath.endsWith('.jsx')) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const allFiles = getFiles(srcDir);

// Static mapping array of raw literal string -> dynamic {t.auth.loginTitle} replacements
const TEXT_REPLACEMENTS = [
  // Auth Screen logic (Welcome, Login, RoleSetup)
  ['>Empowering every', '>{t.auth.welcomeTitle1}'],
  ['>village, every mother.', '>{t.auth.welcomeTitle2}'],
  ['>A real-time health companion for ASHA workers and rural mothers across India.<', '>{t.auth.welcomeSubtitle}<'],
  ['>Login as ASHA Worker<', '>{t.auth.loginAsAsha}<'],
  ['>Login as Doctor or Nurse<', '>{t.auth.loginAsDoctor}<'],
  ['>I am a Mother<', '>{t.auth.iAmMother}<'],
  ['>Login to MaaSathi<', '>{t.auth.loginTitle}<'],
  ['>Select your role to continue<', '>{t.auth.selectRole}<'],
  ['>Continue with Google<', '>{t.auth.continueGoogle}<'],
  ['>Skip for Demo<', '>{t.auth.skipDemo}<'],
  ['>Welcome back<', '>{t.auth.welcomeBack}<'],
  ['>Login to my account', '>{t.auth.loginAccount}'],
  ['>I have logged in before', '>{t.auth.loginAccountSub}'],
  ['>Create my account', '>{t.auth.createAccount}'],
  ['>Register with MaaSathi', '>{t.auth.createAccountSub}'],
  ['>Are you already registered with MaaSathi?', '>{t.auth.motherEntry}'],

  // Common globals
  ['>Save<', '>{t.common.save}<'],
  ['>Cancel<', '>{t.common.cancel}<'],
  ['>Back<', '>{t.common.back}<'],
  ['>Loading...<', '>{t.common.loading}<'],
  ['>Something went wrong<', '>{t.common.error}<'],
  ['>Success<', '>{t.common.success}<'],
  ['>View All<', '>{t.common.viewAll}<'],

  // App Level routes and others where simple text is found
  ['>Home<', '>{t.nav.home}<'],
  ['>Patients<', '>{t.nav.patients}<'],
  ['>Village<', '>{t.nav.village}<'],
  ['>Alerts<', '>{t.nav.alerts}<'],
  ['>Reports<', '>{t.nav.reports}<'],
  ['>Profile<', '>{t.nav.profile}<'],

  // Patient Card
  ['>Pregnant<', '>{t.patient.pregnant}<'],
  ['>New Mother<', '>{t.patient.newMother}<'],
  ['>House Number<', '>{t.patient.houseNumber}<'],

  // Mother details specific mappings where no translation maps exist yet
  ['>Create Account<', '>{t.auth.signupTitle}<'],
  ['>Register to track your health with MaaSathi<', '>{t.auth.signupSubtitle}<'],
  ['Placeholder="Your full name"', 'placeholder={t.addPatient.fullNamePlaceholder}'],
  // Too many direct substitutions to catch... 
];

allFiles.forEach(file => {
  let originalCode = fs.readFileSync(file, 'utf8');
  let code = originalCode;

  // Insert general translation hook
  if (!code.includes('useTranslation')) {
    const importDepth = file.split('/').length - file.split('/src/')[0].split('/').length - 2;
    const dots = importDepth > 0 ? '../'.repeat(importDepth) : './';
    const importStr = `import { useTranslation } from '${dots}hooks/useTranslation';\n`;
    code = code.replace(/(import React[^;]+;)/, `$1\n${importStr}`);
  }

  // Insert const t inside components
  const compRegex = /(const [A-Z]\w+\s*=\s*(async\s+)?\([^)]*\)\s*=>\s*\{(?:\s*const [^=]+ = [^;]+;)*)/g;
  if (!code.includes('const t = useTranslation()')) {
    code = code.replace(compRegex, `$1\n  const t = useTranslation();\n`);
  }

  // Erase existing local 't' objects
  const localDictRegex = /const t = \{\s*en: \{[^]*?te: \{[^]*?\}\s*\};\s*const text = t\[language\] \|\| t\.en;/g;
  code = code.replace(localDictRegex, '');

  if (code !== originalCode) {
    fs.writeFileSync(file, code);
  }
});
console.log('Done script execution.');
