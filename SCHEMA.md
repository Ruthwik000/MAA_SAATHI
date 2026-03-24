# MaaSathi App Schema

## Assumptions
- “Schema” covers the persisted data model (Firestore + Storage) plus the routing map.
- Derived from the current `src` code; some flows still use mock/local state.

## Routing Schema (React Router)
```
Auth & Setup
/                       -> SplashScreen
/welcome                -> WelcomeScreen
/login                  -> LoginScreen
/role-setup             -> RoleSetupScreen
/patient-type-select    -> PatientTypeSelect
/caretaker-type         -> CaretakerType

Patient (Elderly/Wellness)
/elderly/health-survey  -> ElderlyHealthSurvey
/wellness/health-survey -> WellnessHealthSurvey
/dashboard/elderly      -> ElderlyDashboard
/dashboard/wellness     -> WellnessDashboard

ASHA
/asha/dashboard         -> AshaDashboard
/asha/profile           -> AshaProfileScreen
/asha/patients          -> PatientListScreen
/asha/patients/add      -> AddPatientScreen
/asha/patients/:id      -> PatientProfileScreen
/asha/village           -> VillageOverviewScreen
/asha/incentives        -> IncentivesScreen
/checkup/select-type    -> CheckupSelectionScreen
/checkup/select-patient -> PatientSelectionScreen
/asha/surveys/pregnant  -> PregnantMotherSurveyScreen
/asha/surveys/new-mother-> NewMotherSurveyScreen

Doctor
/doctor/dashboard       -> DoctorDashboard
/doctor/alert/:id       -> AlertDetailScreen
/doctor/patients        -> PatientHistoryScreen
/doctor/profile         -> DoctorProfileScreen
/doctor/reports         -> ReportsListScreen
/doctor/report/:id      -> ReportViewerScreen

Mother
/mother-entry           -> MotherEntryScreen
/mother-signup          -> MotherSignupScreen
/mother/dashboard       -> MotherDashboard
/mother/reports         -> MotherReportsScreen
/mother/report/:id      -> MotherReportViewerScreen
/mother/vitals          -> MotherVitalsScreen
/mother/profile         -> MotherProfileScreen
/mother/medical-history -> MotherMedicalHistoryScreen
/mother/health-history  -> MotherMedicalHistoryScreen

Caretaker / Family
/family-dashboard       -> FamilyDashboard
/family-patients        -> FamilyDashboard
/family-alerts          -> FamilyDashboard
/family-reports         -> FamilyDashboard
/family-profile         -> FamilyDashboard
/caretaker/vitals       -> CaretakerVitals
/caretaker/reports      -> CaretakerReports
/caretaker/alerts       -> CaretakerAlerts
/caretaker/profile      -> CaretakerProfile

Shared / Global
/shared/ai-report       -> AIReportResultScreen
/report/:reportId       -> ReportViewer
/shared/ring-alert      -> RingAlertScreen
/settings               -> SettingsScreen
```

## Data Schema (Firestore)

### `users/{uid}`
```ts
uid: string                     // matches doc id
name: string
email: string
photoURL: string
role: "asha" | "doctor" | "mother" | "patient" | "caretaker"
patientType: "pregnant" | "newMother" | "elderly" | "wellness"
isSurveyCompleted: boolean
createdAt: Timestamp
updatedAt: Timestamp

// ASHA profile
ashaId: string
village: string
yearsService: string
dateJoined: string

// Doctor profile
regNum: string
phc: string
specialization: string
experience: string

// Mother / patient profile
age: number | string
address: string
status: string
weeks: string
edd: string
gravida: string
plan: string
bloodGroup: string
emerName: string
emerPhone: string

// Linking
linkedDoctorId: string
linkedDoctorEmail: string
linkedDoctorName: string

// Surveys / assessments
medicalHistory: map              // answers keyed by question id
medicalHistoryOther: map         // free-text for "Other"
elderlyHealthProfile: {
  answers: Array<{ id: string, question: string, answer: string }>
  createdAt: string              // ISO string in code
  updatedAt: string              // ISO string in code
}
aiAssessment: {
  aiStatus: "STABLE" | "MODERATE" | "CRITICAL"
  aiParagraphEnglish: string
  updatedAt: string              // ISO string in code
}
wellnessProfile: map             // question text -> answer
```

### `patients/{patientId}`
```ts
id: string                       // stored alongside doc id
ashaWorkerId: string             // uid of ASHA
type: "pregnant" | "newMother"
name: string
age: number | string
phone: string
house: string
village: string
distance: string
emergency: string
nutrition: string
weeksPregnant: string
edd: string
prevPregnancies: string
babyDob: string
babyWeight: string
deliveryType: string

riskScore: number
riskLevel: "LOW" | "MODERATE" | "CRITICAL"
createdAt: Timestamp
lastVisitDate: Timestamp
```

### `surveys/{surveyId}`
```ts
id: string
patientId: string
ashaWorkerId: string
answers: map | array             // survey-specific payload
aiStatus: "stable" | "moderate" | "critical"
riskScore: number
sentToDoctor: boolean
createdAt: Timestamp
```

### `vitals/{vitalId}`
```ts
patientId: string
heartRate: number
spO2: number
temperature: number
stepCount: number
source: "manual" | "ring"
timestamp: Timestamp
```

### `alerts/{alertId}`
```ts
id: string
type: "sos" | "aiCritical" | "abnormalVitals" | string
status: "active" | "resolved"
createdAt: Timestamp
resolvedAt: Timestamp

patientId: string
patientName: string
patientType: "mother" | "elderly" | "wellness" | string
patientAge: string | number
patientPhone: string
weeksPregnant: string

ashaWorkerId: string
doctorId: string

location: string
message: string
trigger: string

heartRate: number
oxygen: number
vitals: { hr: string, spo2: string }  // some UI expects this shape
```

### `reports/{reportId}`
```ts
patientId: string
patientName: string
patientType: "elderly" | "mother" | "wellness" | string
aiStatus: "STABLE" | "MODERATE" | "CRITICAL"
aiParagraphEnglish: string
type: string                       // e.g., "Initial Assessment"
createdAt: Timestamp
```

## Storage Schema
- `profiles/{uid}_{timestamp}` for profile photos uploaded by ASHA users.

## Relationships
- `users/{uid}` is the root identity for all roles.
- `patients/{patientId}` belongs to `users/{ashaWorkerId}`.
- `surveys/{surveyId}` belongs to `patients/{patientId}` and `users/{ashaWorkerId}`.
- `vitals/{vitalId}` belongs to `users/{patientId}`.
- `alerts/{alertId}` reference `patientId`, `doctorId`, and optionally `ashaWorkerId`.
- `reports/{reportId}` reference `patientId`.

## Index Requirements (from current queries)
- `surveys`: `patientId + createdAt desc`, `ashaWorkerId + createdAt desc`
- `patients`: `ashaWorkerId + riskScore desc`
- `vitals`: `patientId + timestamp desc`
- `alerts`:
  - `status + createdAt desc`
  - `ashaWorkerId + status + createdAt desc`
  - `doctorId + status + createdAt desc`
  - `patientId + status + createdAt desc`

## Notes
- `elderlyHealthProfile` and `aiAssessment` store ISO timestamps, while most other writes use Firestore `serverTimestamp`. If you want strict consistency, standardize these.
