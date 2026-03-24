import { jsPDF } from "jspdf";

/**
 * Generates random vitals for demonstration purposes
 * @param {number} count 
 * @returns {Array}
 */
const generateMockVitals = (count = 1) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      heartRate: Math.floor(Math.random() * (92 - 68 + 1)) + 68,
      spO2: Math.floor(Math.random() * (99 - 96 + 1)) + 96,
      temperature: (Math.random() * (37.2 - 36.4) + 36.4).toFixed(1),
      stepCount: Math.floor(Math.random() * (7500 - 1500 + 1)) + 1500,
      timestamp: Date.now() - (i * 12 * 60 * 60 * 1000) // Readings every 12 hours
    });
  }
  return data;
};

const MOCK_SURVEYS = [
  { aiStatus: 'Stable', aiParagraphEnglish: 'Based on current data, the patient is showing healthy vital signs. Cardiovascular stability is evident and oxygen saturation remains within the optimal range.' },
  { aiStatus: 'Moderate', aiParagraphEnglish: 'The patient shows occasional fluctuations in heart rate. While not critical, regular monitoring is recommended to ensure stability remains consistent.' }
];

/**
 * Generates an Instant Health Report (Using real data with mock fallback)
 */
export const generateInstantReport = (user, vitals, surveyData) => {
  const doc = new jsPDF();
  const now = new Date();
  
  // Use real data or generate mock if empty
  const reportVitals = (vitals && vitals.length > 0) ? vitals : generateMockVitals(5);
  const reportSurvey = surveyData || MOCK_SURVEYS[Math.floor(Math.random() * MOCK_SURVEYS.length)];
  const isMock = !vitals || vitals.length === 0;

  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  // --- HEADER ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(33, 37, 41);
  doc.text("MaaSathi Health Report", 20, 25);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(108, 117, 125);
  doc.text(isMock ? "Demo Analysis • Sample Health Metrics" : "AI Assisted Health Summary • Real-time Monitoring", 20, 32);
  doc.text(`Generated on: ${dateStr}`, 140, 25);
  
  doc.setDrawColor(222, 226, 230);
  doc.line(20, 38, 190, 38);

  // --- PATIENT INFO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(33, 37, 41);
  doc.text("Patient Information", 20, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Name: ${user?.name || 'Jane Doe (Sample)'}`, 20, 58);
  doc.text(`Age: ${user?.age || '28'}`, 100, 58);
  
  let pType = user?.patientType || 'wellness';
  const typeMap = { newMother: 'New Mother', pregnant: 'Pregnant Mother', elderly: 'Elderly Patient', wellness: 'Wellness Patient' };
  doc.text(`Patient Type: ${typeMap[pType] || pType}`, 20, 64);
  doc.text(`Status: ${isMock ? 'SIMULATED DATA' : 'AUTHENTICATED'}`, 100, 64);

  // --- MEDICAL BACKGROUND (FOR ELDERLY) ---
  let nextSectionY = 78;
  if (user?.elderlyHealthProfile?.answers) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Medical Background", 20, 78);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const answers = user.elderlyHealthProfile.answers;
    const conditions = answers.find(a => a.id === 'conditions')?.answer || 'None reported';
    const meds = answers.find(a => a.id === 'medications')?.answer || 'None reported';
    const falls = answers.find(a => a.id === 'falls')?.answer || 'No history';
    const mobility = answers.find(a => a.id === 'mobility')?.answer || 'Independent';

    doc.text(`Existing Conditions: ${conditions}`, 25, 86);
    doc.text(`Medications: ${meds}`, 105, 86);
    doc.text(`Fall History: ${falls}`, 25, 92);
    doc.text(`Mobility: ${mobility}`, 105, 92);
    
    nextSectionY = 105;
  }

  // --- CURRENT VITALS ---
  const latest = reportVitals[0];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Latest Metrics", 20, nextSectionY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Heart Rate: ${latest.heartRate} bpm`, 25, nextSectionY + 8);
  doc.text(`SpO2: ${latest.spO2}%`, 25, nextSectionY + 14);
  doc.text(`Temperature: ${latest.temperature} °C`, 105, nextSectionY + 8);
  doc.text(`Steps Today: ${latest.stepCount}`, 105, nextSectionY + 14);

  // --- SUMMARY ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Trend Analysis", 20, nextSectionY + 30);

  const avgHR = (reportVitals.reduce((acc, v) => acc + (Number(v.heartRate) || 0), 0) / reportVitals.length).toFixed(1);
  const avgSpO2 = (reportVitals.reduce((acc, v) => acc + (Number(v.spO2) || 0), 0) / reportVitals.length).toFixed(1);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Average Heart Rate (Last ${reportVitals.length} readings): ${avgHR} bpm`, 25, nextSectionY + 38);
  doc.text(`Average SpO2: ${avgSpO2}%`, 25, nextSectionY + 44);

  let trend = "Vitals are stable and within normal physiological ranges.";
  if (latest.heartRate > 90) trend = "Heart rate shows a slightly elevated trend. Continuous rest is advised.";
  doc.text(`Professional Note: ${trend}`, 25, nextSectionY + 52, { maxWidth: 165 });

  // --- AI INSIGHTS ---
  if (reportSurvey) {
    let aiY = nextSectionY + 68;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("AI Health Assessment", 20, aiY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const status = reportSurvey.aiStatus || 'Stable';
    doc.text(`Diagnosis Status: ${status.toUpperCase()}`, 25, aiY + 8);
    
    let recommendation = status.toLowerCase() === 'stable' ? "Continue regular monitoring." : "Schedule a follow-up consultation.";
    doc.setFont("helvetica", "bold");
    doc.text("Clinical Recommendation:", 25, aiY + 16);
    doc.setFont("helvetica", "normal");
    doc.text(recommendation, 25, aiY + 22);

    if (reportSurvey.aiParagraphEnglish) {
      doc.setFont("helvetica", "bold");
      doc.text("AI Analysis:", 25, aiY + 32);
      doc.setFont("helvetica", "normal");
      doc.text(reportSurvey.aiParagraphEnglish, 25, aiY + 38, { maxWidth: 165 });
    }
  }

  // --- FOOTER ---
  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(222, 226, 230);
  doc.line(20, pageHeight - 30, 190, pageHeight - 30);
  doc.setFontSize(9);
  doc.setTextColor(108, 117, 125);
  doc.text("This report is generated for informational purposes. Simulated data used where live readings were unavailable.", 20, pageHeight - 22, { maxWidth: 170 });
  doc.setFont("helvetica", "bold");
  doc.text("MaaSathi — Digital Health Companion", 20, pageHeight - 14);

  doc.save(`${user?.name || 'Patient'}_MaaSathi_Report.pdf`);
};

/**
 * Generates a Monthly Health Report (Last 30 Days)
 */
export const generateMonthlyReport = (user, vitals, surveyData) => {
  const doc = new jsPDF();
  const now = new Date();
  
  // Logic for 30 days
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  let monthlyVitals = (vitals || []).filter(v => {
    const t = v.timestamp?.toMillis ? v.timestamp.toMillis() : (v.timestamp?.seconds ? v.timestamp.seconds * 1000 : v.timestamp);
    return t >= thirtyDaysAgo;
  });

  const isMock = monthlyVitals.length === 0;
  if (isMock) {
    monthlyVitals = generateMockVitals(30); // Generate 30 days of data
  }

  // --- HEADER ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(33, 37, 41);
  doc.text("MaaSathi Monthly Health Report", 20, 25);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(108, 117, 125);
  doc.text(isMock ? "Historical Simulation • Demo Trends" : "Last 30 Days Clinical Trend Analysis", 20, 32);
  doc.text(`Date: ${now.toLocaleDateString()}`, 165, 25);
  
  doc.setDrawColor(222, 226, 230);
  doc.line(20, 38, 190, 38);

  // --- PATIENT INFO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Patient Information", 20, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Name: ${user?.name || 'Ramesh Kumar (Sample)'}`, 20, 58);
  doc.text(`Type: ${user?.patientType || 'Elderly'}`, 100, 58);

  // --- 30 DAY SUMMARY ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("30 Day Summary Statistics", 20, 75);

  const mAvgHR = (monthlyVitals.reduce((acc, v) => acc + (Number(v.heartRate) || 0), 0) / monthlyVitals.length).toFixed(1);
  const mAvgSpO2 = (monthlyVitals.reduce((acc, v) => acc + (Number(v.spO2) || 0), 0) / monthlyVitals.length).toFixed(1);
  const totalSteps = monthlyVitals.reduce((acc, v) => acc + (Number(v.stepCount) || 0), 0);
  const avgSteps = (totalSteps / monthlyVitals.length).toFixed(0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Average Heart Rate: ${mAvgHR} bpm`, 25, 85);
  doc.text(`Average SpO2 Level: ${mAvgSpO2}%`, 25, 92);
  doc.text(`Cumulative Step Count: ${totalSteps.toLocaleString()}`, 25, 99);
  doc.text(`Average Daily Steps: ${avgSteps}`, 105, 85);

  let mTrend = "Vital signs demonstrate high stability over the 30-day monitoring period.";
  if (mAvgHR > 85) mTrend = "Average heart rate is higher than baseline. Increased rest and hydration are suggested.";
  
  doc.setFont("helvetica", "bold");
  doc.text("Observational Analysis:", 25, 110);
  doc.setFont("helvetica", "normal");
  doc.text(mTrend, 25, 116, { maxWidth: 165 });

  // --- FOOTER ---
  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(222, 226, 230);
  doc.line(20, pageHeight - 30, 190, pageHeight - 30);
  doc.setFontSize(9);
  doc.setTextColor(108, 117, 125);
  doc.text("The data presented above is representative of simulation algorithms where live telemetry was unavailable.", 20, pageHeight - 22, { maxWidth: 170 });
  doc.setFont("helvetica", "bold");
  doc.text("MaaSathi — Intelligence in Healthcare.", 20, pageHeight - 14);

  doc.save(`${user?.name || 'Patient'}_Monthly_Trend.pdf`);
};
