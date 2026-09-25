export interface DemoDocumentPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  rawText: string;
}

export const DEMO_DOCUMENTS: DemoDocumentPreset[] = [
  {
    id: 'hp-snapdragon-service-intake',
    name: 'HP PC Service & Diagnostics Intake (Primary Demo)',
    category: 'HP Hardware Service',
    description: 'Confidential customer hardware diagnostic form featuring Maya Sharma synthetic credentials.',
    rawText: `================================================================================
SYNTHETIC DEMO DATA — NOT REAL PERSONAL INFORMATION
HP CUSTOMER SERVICE & HARDWARE DIAGNOSTICS INTAKE RECORD
Snapdragon-Powered PC Technical Support Unit
================================================================================

DOCUMENT REF: HP-SNAP-2026-0982
DATE OF INTAKE: 24 September 2026
DEVICE MODEL: HP OmniBook X 14 (Snapdragon X Elite Platform)
SERVICE FACILITY: HP Technology Park, Electronic City, Bengaluru

1. CUSTOMER IDENTITY & CONTACT PARTICULARS:
   Customer Full Name: Maya Sharma
   Contact Email: maya.sharma@example.com
   Primary Phone: +91 90000 12345
   Residential Address: 123 Example Street, Bengaluru, Karnataka 560001
   Government ID Reference: DEMO-ID-123456
   Date of Birth: 12 March 1999

2. SYSTEM CONFIGURATION & HARDWARE DIAGNOSTICS:
   Processor: Qualcomm Snapdragon X Elite (12-Core, up to 4.3 GHz)
   NPU Accelerator: Qualcomm Hexagon NPU (45 TOPS rated)
   Operating System: Windows 11 On ARM (Build 26100)
   System Serial Number: DEMO-HPX-8829-4110
   Registered Account Number: ACC-9844-3321-091

3. CUSTOMER REPORTED SYMPTOMS & TECHNICAL LOG:
   The customer, Maya Sharma (DOB: 12 March 1999), brought the HP OmniBook X
   laptop for routine Snapdragon NPU driver calibration and battery longevity inspection.
   All diagnostics logs were collected locally under customer authorization.
   Device was delivered in person from 123 Example Street, Bengaluru.

4. SERVICE ACTIONS & AUTHORIZATION:
   - Diagnostic validation of Qualcomm AI Runtime (QNN) execution provider.
   - Power consumption profile benchmarked under 28W TDP envelope.
   - Status: System verified operational. Firmware update 2.14 applied.
   - Service Representative: Rajesh K., HP Tech Services.
   - Support Portal: https://support.hp.com/demo-diagnostics-verify

================================================================================
NOTICE: THIS IS STRICTLY SYNTHETIC DEMO DATA CREATED FOR THE SNAPDRAGON AI LAB
BUILD & PRESENT CHALLENGE. NO ACTUAL USER PRIVACY IS COMPROMISED.
================================================================================`,
  },
  {
    id: 'executive-employment-agreement',
    name: 'Executive Employment & IP Agreement',
    category: 'Legal & HR',
    description: 'Corporate agreement containing synthetic executive identity, tax ID, payroll account, and address.',
    rawText: `================================================================================
SYNTHETIC DEMO DATA — NOT REAL PERSONAL INFORMATION
CONFIDENTIAL EXECUTIVE EMPLOYMENT AGREEMENT
================================================================================

AGREEMENT ID: AGR-2026-CORP-4882
EFFECTIVE DATE: 15 October 2026
JURISDICTION: State of Washington, USA

PARTIES:
Employer: CyberShield Technologies Corp., 100 Innovation Way, Seattle, WA 98101
Employee: Jonathan Vance
Personal Email: j.vance.demo@example-corp.net
Mobile Contact: +1 (555) 349-8812
Home Residence: 742 Evergreen Terrace, Seattle, WA 98109
Social Security Number: 000-12-3456
Date of Birth: 04 July 1985

COMPENSATION & DIRECT DEPOSIT AUTHORIZATION:
Annual Base Salary: $240,000 USD payable semi-monthly.
Designated Payroll Bank: First National Trust Bank
Account Number: 4920-8819-3301-55
Routing / Transit Number: 021000021
Corporate Card Allotment: 4532-8901-2345-6789

TERMS & CONFIDENTIALITY:
The Employee, Jonathan Vance, agrees that all proprietary algorithmic designs,
including local neural network models compiled for on-device edge accelerators,
remain the exclusive intellectual property of CyberShield Technologies Corp.
Employee portal URL: https://portal.cybershield-technologies.internal/hr-intake

================================================================================
SYNTHETIC DEMO DATA — NOT REAL PERSONAL INFORMATION
================================================================================`,
  },
  {
    id: 'medical-consultation-record',
    name: 'Outpatient Clinical Consultation & Diagnostic Report',
    category: 'Healthcare & Clinical',
    description: 'Medical health intake document with synthetic patient identifiers, medical ID, and emergency contact.',
    rawText: `================================================================================
SYNTHETIC DEMO DATA — NOT REAL PERSONAL INFORMATION
APOLLO-METRO CLINICAL HEALTHCARE NETWORK
CONFIDENTIAL PATIENT OUTPATIENT CONSULTATION REPORT
================================================================================

CLINIC VISIT ID: MED-2026-99120
DATE OF CONSULTATION: 18 August 2026
DEPARTMENT: Preventive Cardiology & Metabolic Health

1. PATIENT DEMOGRAPHICS:
   Patient Name: Dr. Ananya Sen
   Email Address: ananya.sen.demo@med-example.org
   Emergency Contact Phone: +91 98888 54321
   Residential Address: Flat 402, Lotus Orchid Heights, Indiranagar, Bengaluru 560038
   National Health ID: 91-8842-1093-4412
   Date of Birth: 22 November 1978
   Billing Insurance Card: 6011-2299-8877-3344

2. CLINICAL OBSERVATIONS & VITALS:
   Blood Pressure: 118/76 mmHg (Normotensive)
   Resting Pulse: 68 bpm
   Fasting Blood Glucose: 92 mg/dL
   Patient Dr. Ananya Sen presents for annual preventive executive evaluation.
   No cardiovascular anomalies detected. Exercise tolerance test normal.

3. DISCHARGE RECOMMENDATIONS:
   - Continue balanced Mediterranean dietary regimen.
   - Follow-up lipid screening in 12 calendar months.
   - Patient records secured under ISO/IEC 27701 privacy standard.
   - Physician In-charge: Dr. Vikram Malhotra, MD.
   - Medical Portal: https://apollo-metro.demo-health.org/patient-portal

================================================================================
SYNTHETIC DEMO DATA — NOT REAL PERSONAL INFORMATION
================================================================================`,
  },
];
