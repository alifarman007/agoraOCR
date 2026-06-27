<div align="center">

# OCR Agent

**AI-powered OCR & structured data extraction for English / Bangla business documents**

`React 19` · `TypeScript` · `Vite` · `Google Gemini`

</div>

---

## Overview

OCR Agent is a browser-based application that reads text from scanned or photographed
business documents and turns it into clean, editable, exportable data. It is optimized for
documents that mix **English and Bangla (Bengali)** — challans, invoices, receipts, official
letters, fee-payment slips and legal summons.

The app uses Google's **Gemini** multimodal models as the recognition engine, with a
human-in-the-loop UI: the model extracts, the user reviews and corrects (guided by per-field
confidence indicators), and then exports the result.

It offers two workflows:

| Mode | Tab | What it does |
|------|-----|--------------|
| **V1 — Raw OCR** | *Raw OCR (V1)* | Transcribes any image/PDF to layout-preserving, editable text. |
| **V2 — Structured Editor** | *Structured Editor (Delivery Chalan)* | Parses a **Delivery Chalan** into structured fields (header, parties, line-item table, totals) you can edit and export to JSON or Excel. |

---

## Features

- 📄 **Image & PDF input** — JPG, PNG, WEBP and PDF (sent directly to the model).
- 🌐 **Bilingual OCR** — English, Bangla, and mixed-script documents; original language is preserved (no translation).
- 🧱 **Layout preservation** — line breaks, spacing and column alignment are kept in the raw-text output.
- 🧾 **Structured extraction (Delivery Chalan)** — chalan/PO numbers, date, supplier & buyer, a dynamic line-item table, and summary totals.
- ✍️ **Full editing** — every extracted field, table row and column is editable; add/remove rows, columns, metadata and summary fields.
- 🎯 **Confidence badges** — each field is colour-coded (high / review / low) so reviewers know what to double-check.
- 🔢 **Model selection** — choose between Gemini 3 Pro, 3 Flash, and 2.5 Flash.
- 📊 **Token & cost analytics** — per-request input/output tokens and an estimated USD cost.
- ⬇️ **Exports** — copy or download JSON, or export a formatted `.xlsx` workbook.

---

## Tech stack

- **UI:** React 19 + ReactDOM
- **Build tooling:** Vite 6 (`@vitejs/plugin-react`)
- **Language:** TypeScript 5.8
- **AI:** Google Gemini via the `@google/genai` SDK
- **Styling:** Tailwind CSS (CDN) + Google Fonts (Inter, Hind Siliguri for Bangla)
- **Icons:** `lucide-react`
- **Spreadsheet export:** `exceljs` + `file-saver`

---

## Project structure

```
agoraOCR/
├── index.html                       App shell (Tailwind CDN, fonts, ESM import-map)
├── index.tsx                        React entry — mounts <App/>
├── App.tsx                          Tab shell + V1 (Raw OCR) state & UI
├── vite.config.ts                   Dev server + env-key injection + "@" alias
├── tsconfig.json
├── package.json
│
├── services/
│   ├── geminiService.ts             performOCR()  — image → text (Gemini)
│   └── structureService.ts          structureDeliveryChalan() — text → structured JSON (Gemini)
│
├── components/
│   ├── Header.tsx                   Branded header
│   ├── ModelSelector.tsx            Collapsible model picker
│   ├── AnalyticsPanel.tsx           Collapsible token + cost panel
│   └── StructuredEditor/            V2 — Delivery Chalan editor
│       ├── StructuredEditorTab.tsx  Orchestrates the 2-step pipeline + status machine
│       ├── ChalanEditor.tsx         Split-pane editor (image | form)
│       ├── HeaderSection.tsx        Chalan no. / PO no. / date
│       ├── PartyInfoSection.tsx     Supplier & buyer cards
│       ├── MetadataSection.tsx      Dynamic extra fields
│       ├── LineItemsTable.tsx       Dynamic columns + rows table
│       ├── SummarySection.tsx       Totals / summary fields
│       ├── SubmitPanel.tsx          Copy / download JSON, export Excel
│       └── ConfidenceBadge.tsx      Confidence indicator
│
├── types.ts                         V1 types (ModelType, OCRResult, FileData, …)
├── types/
│   └── delivery-chalan.ts           V2 domain model (DeliveryChalanDocument, …)
│
├── utils/
│   ├── costCalculator.ts            Token → USD estimation
│   └── excelGenerator.ts            Builds & downloads the .xlsx export
│
└── migrated_prompt_history/         Build transcript (reference only)
```

---

## Getting started

### Prerequisites
- **Node.js** (18+ recommended)
- A **Google Gemini API key** — https://aistudio.google.com/

### 1. Install
```bash
npm install
```

### 2. Configure your API key
Create a `.env.local` file in the project root:
```bash
GEMINI_API_KEY=your_api_key_here
```
At build time Vite injects this into the client as `process.env.API_KEY`.

> ⚠️ **Security note:** because the key is bundled into the browser app, it is visible to
> end users of any deployed build. Use this setup for local development/demos only. For
> production, route Gemini calls through a backend so the key stays server-side, and rotate
> any key that has been shared.

### 3. Run
```bash
npm run dev        # http://localhost:3000
```

### Other scripts
```bash
npm run build      # production build
npm run preview    # preview the production build
npm run lint       # type-check (tsc --noEmit)
```

---

## Usage

### V1 — Raw OCR
1. Open the **Raw OCR (V1)** tab.
2. (Optional) Open **Model Configuration** and pick a model.
3. Upload an image or PDF.
4. Click **Run OCR Agent**.
5. Review/edit the transcribed text in the output box, then **Copy** it. Token usage and cost are shown in **Processing Analytics**.

### V2 — Structured Editor (Delivery Chalan)
1. Open the **Structured Editor (Delivery Chalan)** tab.
2. Upload a delivery chalan, then click **Process Chalan Structure**.
3. The app runs two steps — **Step 1: OCR**, then **Step 2: Structuring** — and opens a split editor:
   - **Left:** the original image + a drawer with the raw OCR text for reference.
   - **Right:** editable Header, Supplier/Buyer, Metadata, Line Items table, and Summary.
4. Correct any fields flagged by confidence badges. Edits are counted at the bottom.
5. Export with **Copy JSON**, **Download JSON**, or **Export to Excel**.

---

## How it works

```
                ┌─────────────── V1: Raw OCR ───────────────┐
 Upload ──► base64 ──► performOCR(image) ──► layout-preserving text ──► editable box
                └───────────────────────────────────────────┘

                ┌──────────── V2: Structured Chalan ─────────┐
 Upload ──► base64 ──► performOCR(image) ──► raw text
                              │
                              ▼
        structureDeliveryChalan(text)  ──► Gemini (JSON mode)
                              │
                              ▼
        parse + hydrate (IDs, timestamps, usage) ──► DeliveryChalanDocument
                              │
                              ▼
                    ChalanEditor (review/edit) ──► JSON / Excel
                └────────────────────────────────────────────┘
```

- **OCR step** (`services/geminiService.ts`): the image/PDF is sent to Gemini with a system
  prompt instructing it to transcribe everything, support English + Bangla, and preserve
  layout. Temperature is set low (`0.1`) for fidelity.
- **Structuring step** (`services/structureService.ts`): the OCR **text** is sent to Gemini
  with a chalan-specific prompt and `responseMimeType: "application/json"`. The response is
  cleaned of any stray markdown fences, parsed, and enriched with client-side IDs and metadata.

The same selected model is used for both steps. Each field carries a model-reported
**confidence** (0–1) that drives the review badges.

### Extracted structure (V2)
```jsonc
{
  "document_type": "delivery_chalan",
  "chalan_number": "…", "po_number": "…", "date": "…",
  "supplier": { "name": "…", "address": "…", "phone": "…", "additional": {} },
  "buyer":    { "name": "…", "address": "…", "phone": "…", "additional": {} },
  "delivery_address": "…",
  "additional_metadata": [ { "key": "…", "value": "…", "field_type": "text", "confidence": 0.95 } ],
  "line_items": {
    "columns": [ { "id": "product_name", "label": "পণ্যের নাম", "type": "text" } ],
    "rows":    [ { "cells": { "product_name": "…" }, "confidence": 0.95 } ]
  },
  "summary": [ { "key": "Total", "value": 50000, "field_type": "currency", "confidence": 0.98 } ],
  "ai_confidence": 0.92
}
```

---

## Models & cost

| Display name | Model ID | Notes |
|---|---|---|
| 3.0 Pro | `gemini-3-pro-preview` | Highest reasoning & layout preservation |
| 3.0 Flash | `gemini-3-flash-preview` | **Default** — fast, optimized for high volume |
| 2.5 Flash | `gemini-2.5-flash-latest` | Balanced performance |

The **Processing Analytics** panel estimates cost from the model's reported token counts using
the rates in `utils/costCalculator.ts`. These rates are approximations for display only — verify
against current Gemini pricing before relying on them.

---

## Limitations & roadmap

Current limitations (by design — this is a front-end demo):

- **Structured extraction supports Delivery Chalans only.** Other document types fall back to V1 raw-text OCR; there is no automatic document-type detection.
- **No backend, database, or persistence** — extracted data lives only in the browser until exported.
- **The API key is client-side** (see the security note above).
- **Minimal error handling** — no retry/backoff or schema validation around the model calls.
- All preprocessing, orientation correction, handwriting and language handling are delegated to the Gemini model rather than implemented locally.

Possible next steps:

- Proxy Gemini calls through a backend and persist results.
- Add a document-type classifier and per-type structured schemas (invoice, receipt, consignment note, …).
- Add response validation + retry, and explicit multi-page PDF handling.
- Build out the submission API (the `SubmitChalanRequest`/`SubmitChalanResponse` types already exist in `types/delivery-chalan.ts`).

---

## License

Proprietary — OCR Agent. All rights reserved.
