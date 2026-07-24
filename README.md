# SymptomTwin Mapper 🧘🧬

> **Interactive Anatomical Symptom Tracker, HOLON HPO Phenotype Resolver & Digital Twin Longitudinal Pattern Spotter**  
> Powered by the **Ontomorph DTP SDK** and **HOLON Phenotype Engine**.

---

## 🌟 Overview

### 💡 What It Does
**SymptomTwin Mapper** allows patients and clinicians to log symptoms directly onto interactive 3D anatomical body regions (**Head / Brain**, **Chest / Heart**, **Lungs / Thorax**, **Abdomen / Gut**, **Joints / Musculoskeletal**). It automatically resolves free-text symptoms to official **HPO (Human Phenotype Ontology)** concepts and **SNOMED CT** codes, pins timestamped health events to target body systems on the patient's Digital Twin, and monitors longitudinal event streams to spot recurring symptom clusters and automatically trigger twin alert flags (`twin.flag()`).

### 👥 Who It Is For
- **Patients & Individuals**: Who want an intuitive, visual way to track where and how severely they experience symptoms over time and understand their anatomical health trends.
- **Clinicians & Physicians**: Who require structured, HPO/SNOMED CT-resolved symptom data and automated longitudinal risk alerts to spot subtle disease progression or drug side-effect clusters early.
- **Clinical Researchers**: Who need standardized phenotype tracking linked directly to digital twin organ systems.

### ⚙️ Platform Technologies Used
- **Ontomorph DTP SDK (`@ontomorph/dtp-sdk`)**:
  - `dtp.twins.connect(grantToken)`: Establishes secure authenticated connections to patient digital twin instances via grant tokens.
  - `twin.events.stream({ system })`: Listens to live and historical system event streams on specific body systems.
  - `twin.flag(system, { title, description, code })`: Automatically dispatches digital twin alert flags when high-risk symptom clusters or severe events occur.
- **HOLON Clinical Knowledge & Phenotype Engine**:
  - `dtpServer.holon.concepts.search`: Resolves raw symptom descriptions into official HPO (Human Phenotype Ontology) concepts (e.g. `HP:0001658 - Chest Pain`) and SNOMED CT clinical codes.
  - `dtpServer.holon.interactions.checkList`: Screens polypharmacy regimens across 1.7M+ drug-drug interactions.
- **Supabase Auth & Database**:
  - Powers user authentication (`auth.users`) and persistent symptom/cluster storage.

---

## 📖 Feature Guide: How Each Feature Works & How to Use It

### 1. 🧘 Interactive Anatomical Body Mapping (`/body-mapping`)
#### **How It Works Under the Hood**:
- Renders an interactive vector body silhouette highlighting 5 main anatomical regions (**Head/Brain**, **Chest/Heart**, **Lungs/Thorax**, **Abdomen/Gut**, **Joints/Musculoskeletal**).
- Clicking any body region opens the `SymptomLogModal`.
- As the user types a symptom description, `resolvePhenotypeAction` fires a debounced request to `dtpServer.holon.concepts.search(symptom, { domain: 'Phenotype' })` to resolve the text into an official HPO code (e.g. `HP:0001658`) and SNOMED CT term.
- Upon submission, `logSymptomAction` connects to the patient's Digital Twin via `dtpServer.twins.connect(grantToken)` and pins the event to the target body system (*Cardiovascular*, *Nervous*, *Pulmonary*, *Digestive*, or *Musculoskeletal*).

#### **What to Do to Make It Work**:
1. Open the application and navigate to **Body Mapping** (`/body-mapping`).
2. Click directly on any body region (e.g., **Chest / Heart** or **Head / Brain**).
3. Select a quick tag or type a custom symptom (e.g., *"Substernal chest tightness"*).
4. Set the **Severity Slider** (1 to 10 scale).
5. Click **"Log Symptom & Pin to Digital Twin"**. The event is immediately saved and pinned to your Digital Twin.

---

### 2. 🧬 HOLON HPO Phenotype Resolver & Library (`/phenotypes`)
#### **How It Works Under the Hood**:
- Integrates directly with the HOLON Clinical Knowledge API (`dtpServer.holon.concepts.search`).
- Takes free-text symptoms or clinical terms and searches the Human Phenotype Ontology (HPO) and SNOMED CT vocabularies to return standardized medical concept identifiers and clinical definitions.

#### **What to Do to Make It Work**:
1. Navigate to **HPO Phenotypes** (`/phenotypes`).
2. Type any medical symptom or term into the search bar (e.g., *"dizziness"*, *"chest pain"*, *"nausea"*, *"arthralgia"*).
3. View the resolved **HPO Code**, **SNOMED CT Code**, and standardized clinical definition.

---

### 3. 📈 Longitudinal Pattern Spotting & Automated `twin.flag()` Alerts (`/patterns`)
#### **How It Works Under the Hood**:
- Runs the cluster detection algorithm `detectSymptomClusters(userId)`.
- Groups historical symptom events by target body system over a rolling 7-day window.
- When **2 or more events** occur in the same body system:
  - If average severity is $\ge 7/10$, it classifies the cluster as **CRITICAL**.
  - Aggregates unique HPO codes and generates clinical recommendations.
  - Automatically dispatches a digital twin alert flag via the Ontomorph DTP SDK:
    ```ts
    await twin.flag(system, {
      title: `Symptom Cluster Alert: ${regionName}`,
      description: `Logged severe ${symptomName} (Severity ${severity}/10).`,
      code: "SYMPTOM_CLUSTER",
    });
    ```
- Displays live status badges showing `twin.flag() Triggered`.

#### **What to Do to Make It Work**:
1. Go to **Body Mapping** (`/body-mapping`) and log 2 or more symptoms in the same body region (e.g. log 2 Chest/Heart symptoms with a severity of 7+).
2. Navigate to **Pattern Spotting** (`/patterns`).
3. You will see the newly formed **Longitudinal System Cluster**, average severity rating, aggregate HPO codes, and the active `twin.flag() Triggered` badge.

---

### 4. 📌 Digital Twin Health Events Stream (`/events`)
#### **How It Works Under the Hood**:
- Fetches all timestamped symptom events via `getSymptomHistoryAction()`.
- Renders a filterable event stream displaying organ system tags, severity badges, notes, and pinned HPO phenotype codes.

#### **What to Do to Make It Work**:
1. Log symptoms via the Body Map.
2. Navigate to **Twin Health Events** (`/events`).
3. Use the system filter buttons (*All Systems*, *Cardiovascular*, *Nervous*, etc.) to inspect historical twin health events.

---

### 5. 💊 Polypharmacy Prescriptions & Safety Screening (`/prescriptions`)
#### **How It Works Under the Hood**:
- Uses `dtpServer.holon.interactions.checkList(rxNormCodes)` to screen active prescription regimens across HOLON's database of 1.7M+ known drug interactions.
- If high-risk polypharmacy interactions are detected, it dispatches an automated `twin.flag("cardiovascular", { title: "Drug Interaction Alert", code: "DRUG_INTERACTION" })`.

#### **What to Do to Make It Work**:
1. Navigate to **Prescriptions** (`/prescriptions`).
2. Add medications to your active prescription list (e.g., *Atorvastatin*, *Clopidogrel*, *Warfarin*, *Omeprazole*).
3. The app automatically runs real-time HOLON safety screening and flags potential drug-drug interactions.

---

### 6. 🩺 3D Digital Twin Organ Telemetry (`/simulation`)
#### **How It Works Under the Hood**:
- Connects to the user's digital twin via `dtpClient.twins.connect(grantToken)`.
- Renders 3D telemetry canvas visualizing organ impact, clearance kinetics, and active risk metrics across Cardiovascular, Renal, and Hepatic systems.

#### **What to Do to Make It Work**:
1. Navigate to **Simulation / Telemetry** (`/simulation`).
2. Switch between **Cardiovascular**, **Renal**, and **Hepatic** system tabs to observe organ health metrics and telemetry.

---

### 7. 🔐 User Session & Auth Management (`/settings`)
#### **How It Works Under the Hood**:
- Authenticates users against Supabase Auth (`auth.users`) via `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()`.
- Generates patient scoped grant tokens (`dtp_grant_...`) used to connect to Ontomorph Digital Twins.

#### **What to Do to Make It Work**:
1. Click **Sign In** or **Get Started** in the top navigation bar or mobile drawer.
2. Log in using pre-configured demo credentials or register a new user account.
3. Manage profile details and inspect Digital Twin grant tokens on the **Settings** page (`/settings`).

---

## 🔑 Pre-Configured Demo Accounts

| Username | Password | Role | Linked Grant Token |
| :--- | :--- | :--- | :--- |
| **`dr_smith`** | `password123` | **Cardiologist / Physician** | `dtp_grant_dr_smith_cardio_twin_9921` |
| **`patient_jane`** | `password123` | **Patient Digital Twin** | `dtp_grant_patient_jane_twin_7842` |

---

## 🗺️ Application Routes Summary

- **`/body-mapping`**: Interactive anatomical body map canvas, region selector, symptom log modal, and recent pinned events.
- **`/patterns`**: Longitudinal symptom cluster detection dashboard and automated `twin.flag()` alert status.
- **`/phenotypes`**: HOLON HPO and SNOMED CT search engine and reference library.
- **`/events`**: Filterable log of timestamped health events pinned to target body systems.
- **`/prescriptions`**: Prescription management and real-time HOLON polypharmacy interaction screening.
- **`/simulation`**: 3D Digital Twin organ telemetry visualization.
- **`/settings`**: Profile settings, grant tokens, and account management.

---

## 🚀 Getting Started

### 1. Environment Setup (`.env`)
```env
DTP_API_KEY="dtp_test_personal_6c7af52d4ba7e6f25f4ce700cfaee652e277ec4c43626eefe0aca484bdc573a6"
HOLON_API_KEY="holon_117ff6e390f05b92935a50219a65ded44bbc2d960ca4733774d720ac529177e1"
NEXT_PUBLIC_HOLON_API_URL="https://holon-api.ontomorph.com"

NEXT_PUBLIC_SUPABASE_URL="https://swepblfntvvpnsmmkxva.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 3. Production Build
```bash
npm run build
npm run start
```
