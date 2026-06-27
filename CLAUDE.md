# CLAUDE.md — OCR Agent (repo folder: agoraOCR)

Working context for this repository. Read this before making changes.

> ⚠️ This repo lives under `c:\Python_Projects\` but is **NOT a Python project**. It is a
> browser-only **TypeScript + React 19 + Vite** single-page app. There is no Python,
> no backend, no database, and no custom ML — all "OCR" is delegated to Google Gemini.

---

## 1. What this project is

A client-side web app that extracts information from business documents (challans,
invoices, receipts, official letters, fee slips, legal summons) that may contain
**English, Bangla (Bengali), or a mix of both**. It exposes two pipelines via a tab UI:

- **V1 — Raw OCR:** upload image/PDF → Gemini transcribes it preserving layout → editable text box (copy/edit).
- **V2 — Structured Editor (Delivery Chalan):** upload chalan → Gemini OCR → second Gemini call parses the text into a structured `DeliveryChalanDocument` JSON → split-pane editor with per-field confidence badges → export to JSON or Excel.

Product name: **OCR Agent** (UI tagline "Advanced OCR System"). npm package name `ocr-agent`. The repo folder is `agoraOCR`.
Origin: scaffolded in Google AI Studio (see `migrated_prompt_history/` build transcript — a historical log that still contains the old "Sysnova" working name and is intentionally left unedited).

## 2. Tech stack

- **Framework:** React 19.2.4 + ReactDOM, `React.StrictMode`.
- **Build/dev:** Vite 6 (`@vitejs/plugin-react`), dev server on **port 3000, host 0.0.0.0**.
- **Language:** TypeScript ~5.8 (ES2022, `react-jsx`, `noEmit` — Vite transpiles).
- **AI SDK:** `@google/genai` ^1.39.0 (the only network/AI dependency).
- **Styling:** Tailwind via CDN `<script>` in `index.html`; fonts Inter + **Hind Siliguri** (Bangla); `.bangla-text` CSS class applied to every Bangla-bearing input.
- **Icons:** `lucide-react`.
- **Exports:** `exceljs` (xlsx build) + `file-saver` (download).
- **Module loading quirk:** `index.html` also contains an **import-map** that pulls `react`, `react-dom`, `@google/genai`, `lucide-react` from `esm.sh`. So deps are declared twice (npm for the build, import-map for runtime ESM).

## 3. Run / scripts

```bash
npm install
# set GEMINI_API_KEY in .env.local
npm run dev        # vite dev server → http://localhost:3000
```
Scripts (`package.json`): `dev`, `build`, `preview`, `lint` (`tsc --noEmit`). No tests, no formatter/linter config.

## 4. Configuration

- **Env var:** `GEMINI_API_KEY` in `.env.local` (gitignored via `*.local`).
- `vite.config.ts` injects it at build time into **both** `process.env.API_KEY` and `process.env.GEMINI_API_KEY`. Services read `process.env.API_KEY`.
- `temperature: 0.1` is hardcoded in both service calls (for fidelity).
- `@` path alias → project root (`vite.config.ts` + `tsconfig.json`).
- A fresh `GoogleGenAI` client is created **per call** (not a shared singleton).

## 5. Models

Defined in `types.ts` (`ModelType` enum), one selected via `ModelSelector` for both pipeline steps:
- `gemini-3-pro-preview` — "3.0 Pro" (highest reasoning/layout)
- `gemini-3-flash-preview` — "3.0 Flash" (**default**, fast/high-volume)
- `gemini-2.5-flash-latest` — "2.5 Flash" (balanced)

> ⚠️ These preview model IDs are not verified against the live API; there's no error handling that distinguishes an invalid model ID from any other failure.

## 6. Architecture & data flow

Layers: **UI components** → **service layer (`services/`, the only place the network is touched)** → **Gemini**. Domain types in `types.ts` (V1) and `types/delivery-chalan.ts` (V2). Pure helpers in `utils/`.

V2 pipeline (`StructuredEditorTab.processDocument`):
```
image → base64 → performOCR() → raw text → structureDeliveryChalan(text) → JSON
      → strip ``` fences → JSON.parse → hydrate (client IDs, processed_at, raw_ocr_text, usage)
      → DeliveryChalanDocument → ChalanEditor (editable) → export JSON/Excel
```
Structuring runs on the **OCR text string, not the image** — V2 quality is capped by the OCR step.

## 7. File map

- `index.html` — shell; Tailwind CDN, fonts, `.bangla-text`, ESM import-map. **References `/index.css` which does NOT exist (harmless 404).**
- `index.tsx` — mounts `<App/>`.
- `App.tsx` — tab shell + **all V1 state/UI** (`handleFileChange`, `handleOCR`, `handleCopy`, `clearFile`).
- `vite.config.ts`, `tsconfig.json`, `package.json`, `metadata.json` — config.
- `services/geminiService.ts` — `performOCR(base64, mimeType, model)`; OCR system prompt lives here.
- `services/structureService.ts` — `structureDeliveryChalan(rawOcrText, modelId)`; the big `DELIVERY_CHALAN_STRUCTURE_PROMPT`, `generateId()`, hydration.
- `types.ts` — `ModelType`, `OCRResult`, `FileData`, `UsageMetadata`, `CostEstimate`.
- `types/delivery-chalan.ts` — `DeliveryChalanDocument` + sub-types; **also `SubmitChalanRequest/Response` & `EditorState` which are UNUSED (a planned backend that was never built).**
- `utils/costCalculator.ts` — per-million-token pricing table + `calculateCost`.
- `utils/excelGenerator.ts` — builds/downloads styled `.xlsx`.
- `components/Header.tsx` — static branded header.
- `components/ModelSelector.tsx` — collapsible model picker.
- `components/AnalyticsPanel.tsx` — collapsible token+cost panel; handles V1 (one usage) and V2 (ocr + structuring usages summed).
- `components/StructuredEditor/`
  - `StructuredEditorTab.tsx` — V2 orchestrator + `idle→ocr→structuring→ready/error` state machine + progress bar.
  - `ChalanEditor.tsx` — split-pane editor; holds editable `document`; single `handleUpdate` merges partial updates + increments `correctionCount`; raw-OCR drawer.
  - `HeaderSection.tsx` — chalan no./PO no./date.
  - `PartyInfoSection.tsx` — supplier & buyer (name/address/phone + dynamic `additional`).
  - `MetadataSection.tsx` — dynamic `{key,value,field_type,confidence}` rows.
  - `LineItemsTable.tsx` — dynamic **columns + rows** table (most complex); add/remove either; per-cell edit; `prompt()`/`window.confirm` for column ops.
  - `SummarySection.tsx` — totals rows.
  - `SubmitPanel.tsx` — Copy JSON / Download JSON / Export Excel. **No server submit.**
  - `ConfidenceBadge.tsx` — normalizes 0–1 vs 0–100; green ≥0.9 / yellow "Review" ≥0.7 / red "Low Conf." else.
- `migrated_prompt_history/prompt_*.json` — AI Studio build transcript (≈282 KB, 30 messages). Documentation only, not runtime.
- `New folder/` — empty stray directory.

## 8. Known gaps & caveats (verified against the code — keep these in mind)

1. **Security:** the Gemini API key is bundled into the client via `vite define`, so it is exposed to any end user. Needs a server-side proxy for production. Rotate the key if it was ever shared.
2. **Only one structured type:** despite the brief listing receipts/invoices/consignment/dispatch notes, only **Delivery Chalan** has a structured path. There is **no document-type classifier**; `document_type` is force-set to `"delivery_chalan"` during hydration.
3. **No real preprocessing / orientation / noise removal / handwriting / language-detection code** — all delegated to Gemini and steered only by natural-language prompts.
4. **Thin error handling:** no retry/backoff, no rate-limit handling, no JSON-schema validation; the only post-processing is markdown-fence stripping + `JSON.parse`. A malformed response throws a generic error.
5. **No persistence / no backend / no DB / no tests.** All state is ephemeral React `useState`; reload loses everything.
6. PDFs are passed straight to Gemini as inline data — **no client-side PDF rendering or page splitting**; V2 also skips MIME validation (V1 validates image/* or pdf).

## 9. Conventions

- All AI/network logic stays in `services/`. Swapping provider/model = edit those two files only.
- Keep the OCR↔structuring two-stage separation.
- Bangla-bearing inputs must carry the `bangla-text` class so Hind Siliguri renders.
- Service functions are stateless and create their own client; preserve that unless intentionally refactoring.
- Do NOT commit `.env.local` or real keys.
