# SnapShield AI

> **Privacy-first document intelligence assistant designed for Snapdragon-powered HP PCs.**  
> Developed for the **Snapdragon AI Lab Build & Present Challenge**.

SnapShield AI detects personally identifiable information (PII) in sensitive documents, enables granular or bulk redaction into `[REDACTED]`, generates privacy-safe executive summaries, and provides document Q&A without leaking personal credentials.

---

## 🛡️ Core Concept & Principles

Sensitive enterprise, healthcare, financial, and hardware service documents should never leave a user's workstation unprotected. SnapShield AI is architected from the ground up for **on-device edge intelligence**:

- **Local Inference by Design**: The entire PII detection and redaction pipeline runs in client-side memory buffers. Zero raw document data is transmitted over the network.
- **Architected for Qualcomm AI Hub**: The modular AI provider interface is structured so that compiled Qualcomm AI Hub models (running via ONNX Runtime with Qualcomm AI Runtime / QNN Execution Provider) can be dropped in without changing the UI layer.
- **Honest Hardware State**: The application runs an active, client-side **Demo Local Inference Runtime** and clearly labels hardware targets as **Integration Target**—strictly avoiding fabricated NPU benchmarks or simulated execution claims until physical hardware binding is performed.

---

## 🚀 Key Features

### 1. Document Ingestion & Demo Data
- **File Support**: Ingests PDF documents, optical image scans (`PNG`, `JPG`), or plain text files.
- **1-Click Synthetic Demo**: Instantly loads a synthetic HP customer intake document featuring fictional records (*Maya Sharma*, synthetic DEMO-ID, Bengaluru address, phone, and birth date).
- **Synthetic Guarantee**: Prominently labeled with `SYNTHETIC DEMO DATA — NOT REAL PERSONAL INFORMATION`. Includes extra templates for Executive Employment and Clinical Healthcare records.

### 2. Multi-Category PII Detection & Protection
Detects high-risk entities:
- **Person Names** (contextual role labels and NER)
- **Email Addresses** (RFC 5322 compliance)
- **Phone Numbers** (International, Indian, US formats)
- **Physical Residences & Mailing Addresses**
- **Government IDs** (National IDs, SSNs, Aadhaar formats, synthetic DEMO-IDs)
- **Financial Account Numbers & Bank Routing Numbers**
- **Dates of Birth**
- **Credit & Debit Cards** (PCI-DSS 16-digit patterns)
- **Web URLs & Endpoints**
- **Hardware Serials & Document Reference Numbers**

### 3. PII Protection Table & Masked Display
- Displays **Entity Type | Masked Value | Confidence | Status | Action**.
- Previews are masked by default (e.g., `M•••• S•••••`, `+91 ••••• ••45`) to prevent shoulder surfing, with an optional inspection eye icon for verification.

### 4. Interactive Redaction Engine
- **Redact All**: Transforms all detected entities into standard `[REDACTED]` tokens.
- **Redact Selected**: Checkbox selection for selective or targeted redaction.
- **Clickable Spans**: Click any highlighted entity in the Document Preview to toggle its redaction state directly.
- **Restore Preview**: Restores original document view in one click.
- **Safe Copy & Export**: Copies or downloads sanitized text with redaction tokens preserved.

### 5. Privacy-Safe Executive Summaries
- Analyzes sanitized document buffers to synthesize high-level operational intent, main obligations, and structural findings without reproducing or exposing PII.

### 6. Confidential Document Q&A
- Query document facts through recommended prompts (*"What is this document about?"*, *"What are the important dates?"*, *"What organization is mentioned?"*, *"Summarize the document."*, *"What are the main sections?"*) or custom questions.
- Built-in privacy guardrails explicitly withhold personal phone numbers, addresses, emails, and credentials from answers.

### 7. Snapdragon AI Mode & Privacy Panel
- **Snapdragon AI Mode Control**: Toggle switch enforcing local-only processing boundaries.
- **Privacy Dashboard**: Displays Processing Mode (*Local / Cloud*), Sensitive Data (*Detected*), Redaction (*Available*), Snapdragon AI (*Enabled / Disabled*), and Cloud Processing (*Optional*).
- **Directive**: *"Your sensitive document should be processed locally whenever possible."*

### 8. Technical Architecture Dashboard
Displays the formal target specification:
- **Target Platform**: Snapdragon-powered HP PC (HP OmniBook X / HP EliteBook Ultra)
- **AI Framework**: Qualcomm AI Hub
- **Local Runtime**: ONNX Runtime / Qualcomm AI Runtime (QNN)
- **Execution Target**: NPU / CPU / GPU (*Integration target*)
- **Model**: Presidio-QNN / Llama-3.2-1B-QNN (*Integration target*)
- **Inference Mode**: Local AI pipeline (*Active demo runtime*)

---

## 🏗️ Architecture & Pipeline Flow

The document intelligence pipeline follows a strict, sequential privacy funnel:

```
Document Ingestion (PDF / PNG / JPG / Text)
       ↓
Preprocessing & Tokenization (Offset mapping)
       ↓
AI Inference (Qualcomm AI Hub Local Target)
       ↓
PII Detection & Confidence Scoring
       ↓
Redaction Engine (Selective or Batch to [REDACTED])
       ↓
Privacy-Safe Document Representation
       ↓
Optional Reasoning (Executive Summary & Document Q&A)
```

### Modular Provider Hierarchy

```
AIProvider (Base Interface)
  ├── LocalAIProvider (Abstract - On-device isolation)
  │     └── QualcommAIHubProvider (Active Demo Local Inference -> Target: QNN/WebNN)
  └── CloudAIProvider (Abstract - Optional network reasoning)
        └── GeminiProvider (Server-side proxy with pre-sanitized context)
```

The UI components (`DocumentPreview`, `PIITable`, `SummaryPanel`, `QAPanel`) consume only the abstract `AIProvider` interface, allowing the backend runtime to switch without modifying frontend presentation code.

---

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Build Tool**: Vite 8 with `@tailwindcss/vite`
- **Backend / Proxy**: Express, Node.js (`tsx`)
- **Cloud Reasoning SDK**: `@google/genai` (Optional cloud reasoning proxy)
- **Target Runtimes**: Qualcomm AI Hub, ONNX Runtime Web / QNN Execution Provider

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm

### Installation

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (optional, for cloud reasoning fallback):
   ```bash
   cp .env.example .env
   # Add GEMINI_API_KEY if testing cloud reasoning. Local AI inference runs without any API key.
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:3000`.

---

## 🔌 Connecting to Qualcomm AI Hub (Production Deployment)

To connect compiled Qualcomm AI Hub models on native Snapdragon X Elite / Plus hardware:

1. **Compile the model using the Qualcomm AI Hub CLI**:
   ```bash
   qai-hub compile \
     --model "llama-3.2-1b-instruct" \
     --target-runtime "qnn_lib_windows_arm64" \
     --target-device "Snapdragon X Elite"
   ```

2. **Load into the ONNX Runtime QNN Execution Provider in `src/services/ai/QualcommAIHubProvider.ts`**:
   ```typescript
   import { InferenceSession } from 'onnxruntime-node';

   const session = await InferenceSession.create('assets/models/llama3_qnn.onnx', {
     executionProviders: [
       {
         name: 'QNN',
         deviceType: 'HTP', // Hexagon Tensor Processor (NPU)
       },
     ],
   });
   ```

---

## 📄 License

Apache-2.0 License. Built for the Snapdragon AI Lab Build & Present Challenge.
