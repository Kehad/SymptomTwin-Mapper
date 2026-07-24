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

### ⚙️ Which Parts of the Platform It Uses
- **Ontomorph DTP SDK (`@ontomorph/dtp-sdk`)**:
  - `dtp.twins.connect(grantToken)`: Establishes secure authenticated connections to patient digital twin instances via grant tokens.
  - `twin.events.stream({ system })`: Listens to live and historical system event streams on specific body systems.
  - `twin.flag(system, { title, description, code })`: Automatically dispatches digital twin alert flags when high-risk symptom clusters or severe events occur.
- **HOLON Clinical Knowledge & Phenotype Engine**:
  - `dtpServer.holon.concepts.search`: Resolves raw symptom descriptions into official HPO (Human Phenotype Ontology) concepts (e.g. `HP:0001658 - Chest Pain`) and SNOMED CT clinical codes.

---

## ✨ Key Features

### 1. 🧘 Interactive 3D Anatomical Body Mapping
- **Clickable Body Regions**: Click directly on 3D anatomical regions (**Head / Brain**, **Chest / Heart**, **Lungs / Respiratory**, **Abdomen / Gut**, **Joints / Musculoskeletal**).
- **Severity Ratings (1-10)**: Rate symptom severity with color-coded heatmap indicators (Green 1-3, Amber 4-6, Crimson 7-10).

### 2. 🧬 HOLON Phenotype Resolution Engine
- **HPO & SNOMED CT Resolution**: Resolves free-text symptoms (e.g. *"Chest tightness during exertion"*, *"Frontal headache"*, *"Morning joint stiffness"*) to official HPO codes (e.g., `HP:0001658`, `HP:0002315`, `HP:0002829`) and SNOMED CT terms.

### 3. 📌 Twin Event Pinning (Ontomorph DTP SDK)
- **System Pinned Logs**: Saves logged symptoms as timestamped health events pinned directly to target body systems (*Cardiovascular*, *Nervous*, *Pulmonary*, *Digestive*, *Musculoskeletal*) via `dtpServer.twins.connect(grantToken)`.

### 4. 📈 Longitudinal Pattern Spotting & Automated `twin.flag()` Alerts
- **Recurring Cluster Detection**: Streams past twin events over time to spot recurring symptom clusters (e.g. 2+ severe cardiovascular events in 7 days).
- **Automated Twin Alerts**: Automatically dispatches alerts to the patient's digital twin via `twin.flag(system, { title, description, code: 'SYMPTOM_CLUSTER' })`.

---

## 🗺️ Application Route Structure

- **`/` — Interactive Body Mapping**: Anatomical 3D body map canvas, region selector, symptom log modal, and recent pinned events.
- **`/phenotypes` — HPO Phenotype Resolver**: HOLON HPO and SNOMED CT search engine and reference library.
- **`/events` — Twin Health Events**: Filterable log of timestamped health events pinned to target body systems.
- **`/patterns` — Pattern Spotting & Alerts**: Longitudinal symptom cluster detection dashboard and automated `twin.flag()` alert status.

---

## 🔑 Pre-Configured Demo Accounts

| Username | Password | Role | Linked Grant Token |
| :--- | :--- | :--- | :--- |
| **`dr_smith`** | `password123` | **Cardiologist / Physician** | `dtp_grant_dr_smith_cardio_twin_9921` |
| **`patient_jane`** | `password123` | **Patient Digital Twin** | `dtp_grant_patient_jane_twin_7842` |

---

## 🚀 Getting Started

### 1. Environment Setup (`.env`)
```env
DTP_API_KEY="dtp_live_your_api_key_here"
HOLON_API_KEY="holon_your_api_key_here"
NEXT_PUBLIC_HOLON_API_URL="https://holon-api.ontomorph.com"
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
