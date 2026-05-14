# Anti-Gravity Platform Detailed Planning Document

**Role:** Legal Tech Product Owner & System Architect
**Project:** Anti-Gravity (안티그래비티)
**Concept:** A "Zero-Gravity" litigation platform for individuals burdened by the weight of law.
**Core Goal:** Solving collective damages through technological solidarity.

---

## 1. Specialized User Journey Map

### A. Personal Information Leak Damages (Mass/Small Claims)
*Benchmarking: ClassAction.org, Top Class Actions*

**1. Recruitment & Verification (Lead Generation)**
- **Landing Page:** "Check if my information was leaked" search bar.
    - User enters Name + Phone Number (partial).
    - System checks against known leak databases (hashed).
- **Identity Verification:** Integration with **PASS / Kakao Cert / Naver Cert**.
    - Essential for valid legal standing in Korean courts.
    - **UX:** One-click verification replaces complex paper forms.

**2. Litigation Delegation (Selection Party System - Min. Civ. Proc. Act Art. 53)**
- **The Hurdle:** Unlike US Class Actions (Opt-out), Korea requires Opt-in (active participation).
- **Solution:** **"1-Minute Electronic Delegation"**
    - User views the "Selection Party Selection Document" (선정당사자 선정서).
    - Signs electronically via the authenticated mobile cert.
    - **System Action:** Automatically generates a PDF with the user's digital stamp/signature appended to the plaintiff list.

**3. Damages Calculation (Statutory Damages)**
- **Legal Basis:** Personal Information Protection Act Art. 39-2.
- **Logic:**
    - User selects the leaked company.
    - System retrieves the specific leak incident details (date, types of data leaked).
    - **Algorithm:**
        - Basic Info (Name/Phone) -> 100,000 KRW
        - Sensitive Info (RRN/Account) -> 300,000 KRW +
        - Mental Distress Multiplier -> Auto-calculated claim amount.
    - **Output:** "Estimated Claim Amount: 300,000 KRW" displayed immediately.

### B. Apartment Defect Warranty Litigation (High Value/Complex)
*Benchmarking: FairShake, PeopleClerk*

**1. Evidence Collection (AI-Assisted)**
- **Mobile Web App:** User takes a photo of the defect.
- **AI Classification:**
    - Image Analysis -> Identifies "Crack", "Leak", "Mold", "Tile Separation".
    - **Metadata Capture:** GPS Location, Date/Time, Unit/Room Number (from user profile).
- **UX:** "Just snap a photo, we'll name the legal defect."

**2. Pre-Litigation Preparation**
- **Defect Report Generation:**
    - Aggregates individual photos into a "Unit 101 Defect Report".
    - Auto-sends to the Management Office / Construction Company via **Content-Certified Mail (Naeyong Jeungmyung)** API (e.g., Post Office API integration).
- **Expert Matching:**
    - If the construction company denies responsibility, the system suggests a "Pre-diagnosis" by a partner safety diagnosis firm.

---

## 2. Civil Procedure Automation Logic (Document Automation)

**Goal:** Convert Natural Language to Legal Documents (Complaint / Payment Order Application).

**Mapping Table Example:**

| User Input (Natural Language) | Process (NLP & Logic) | Output (Legal Document - Complaint) |
| :--- | :--- | :--- |
| "Water is leaking from the ceiling in the master bedroom." | **Entity:** Location="Master Bedroom Ceiling", Defect="Water Leak"<br>**Legal Basis:** Act on Ownership and Management of Condominium Buildings Art. 9 (Warranty Liability)<br>**Action:** Request "Photo of wet ceiling" & "Repair estimate" | **Cause of Action:** "The defendant, as the constructor of the building, is liable for the functional defect (water leakage) occurring in the exclusive area (master bedroom ceiling) of the plaintiff's residence..." |
| "My ID and password were stolen from Shopping Mall A." | **Entity:** Target="Shopping Mall A", Data="ID/PW"<br>**Legal Basis:** PIPA Art. 39 (Liability for Damages)<br>**Action:** Check "Shopping Mall A Leak Incident" DB | **Cause of Action:** "The defendant failed to fulfill the technical and administrative protection measures required by the Personal Information Protection Act, resulting in the leakage of the plaintiff's personal information..." |

**Document Generation Engine:**
- **Template:** HWP/PDF templates for "Application for Payment Order" (지급명령신청서).
- **Variable Injection:** `{Plaintiff_Name}`, `{Defendant_Name}`, `{Claim_Amount}`, `{Cause_Text}`.
- **Final Output:** A ready-to-file `.hwp` file compatible with the Korean E-Court System (ECFS).

---

## 3. Security & Data Architecture

**Philosophy:** Zero-Trust & Privacy-First.

**Architecture Diagram Concept:**

1.  **Vault Zone (High Security):**
    - **Storage:** AWS S3 (Encrypted) / Azure Blob Storage.
    - **Data:** Resident Registration Numbers (RRN), Passport Numbers, Raw Evidence Photos.
    - **Encryption:** AES-256 at rest. Keys managed via AWS KMS / Azure Key Vault.
    - **Access:** Only accessible by the automated document generator (server-side) for brief moments. No human admin access.

2.  **Service Zone (App Logic):**
    - **Data:** User ID, Case Status, Hashed Phone Numbers.
    - **Logic:** Web server, AI processing.

3.  **Zero-Knowledge Proof (ZKP) Implementation:**
    - **Scenario:** Verifying a user is a victim of "Company A Leak" without the platform storing the user's full history.
    - **Method:**
        - User's device generates a proof based on a confirmed data point (e.g., a notification email from Company A).
        - Platform verifies the proof: "This user received the leak notification" -> True.
        - **Result:** User is added to the plaintiff group *without* the platform reading the email content.

---

## 4. Regulatory Sandbox & Revenue Model

**Constraint:** Attorney-at-Law Act Art. 34 (Prohibition of Non-Attorney Partnership/Fee Sharing).

**Strategic Business Models:**

### A. SaaS Model (B2B2C)
- **Target:** Plaintiff Representatives (Lawyers/Law Firms).
- **Service:** "Litigation Management System (LMS)"
- **Revenue:**
    - **Subscription Fee:** Monthly fee for the law firm to use the "Plaintiff Management Dashboard".
    - **Data Processing Fee:** Per-user fee for collecting, organizing, and generating the "Selection Party List" and "Evidence Bundle".
    - *Legality:* This is a technical service fee, not a share of the legal fees or settlement.

### B. Litigation Finance (Litigation Funding)
- **Concept:** Third-party funding for litigation costs (stamp tax, service fees, expert witness fees).
- **Revenue:**
    - Fund covers the upfront costs.
    - If the case wins, the Fund takes the principal + agreed return (e.g., 20% of settlement).
- **Korea Context:** Not explicitly illegal, but grey area. Needs careful structuring as an "Investment Contract" rather than "Attorney Fee Sharing".
    - *Strategy:* Operate as a separate "Litigation Fund" entity that invests in the *claim itself* (bond assignment) or supports the *plaintiffs directly*, not the lawyer.

### C. "Anti-Gravity" Membership (B2C)
- **Service:** "Legal Wellness" Subscription.
- **Benefit:**
    - Free "Content-Certified Mail" (Naeyong Jeungmyung) generation.
    - Automatic "Leak Monitoring" for their personal info.
    - Discounted access to partner lawyers.
- **Revenue:** Monthly subscription (e.g., 4,900 KRW).

---

**Next Steps:**
1.  **Prototype:** Build the "1-Minute Selection Party Delegation" mobile web flow.
2.  **Pilot:** Target a recent, specific "Personal Info Leak" incident (e.g., recent telecom or shopping mall hack) to test the recruitment funnel.
