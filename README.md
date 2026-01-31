---

# Sysnova AI Organization

## AgoraOCR

AgoraOCR is a layout-preserving OCR web application designed for structured, real-world documents such as challans, invoices, receipts, official forms, and legal notices.

The system extracts text from images and PDF files while maintaining original formatting, including spacing, alignment, paragraph structure, and line breaks. It supports English, Bangla (Bengali), and mixed-language documents.

---

## Overview

Traditional OCR systems focus primarily on text extraction. AgoraOCR is designed for document reconstruction. It aims to preserve structural integrity so that the output resembles the original document as closely as possible.

This makes it suitable for administrative, financial, and legal document workflows where formatting accuracy matters.

---

## Core Capabilities

### Document Input

* Image formats: JPG, JPEG, PNG, WEBP, and other common formats
* PDF files (including multi-page documents)

### OCR Processing

* Accurate text extraction
* Preservation of:

  * Line breaks
  * Paragraph grouping
  * Spacing and indentation
  * Section alignment
* Supports:

  * English text
  * Bangla text
  * Mixed English and Bangla content

### Editable Output

After processing, extracted text is displayed in an editable interface. Users can:

* Modify or correct recognized text
* Adjust formatting
* Copy content for further use

The editable output enables human-in-the-loop validation for high-accuracy workflows.

---

## Advanced Configuration

### Model Selection

The application includes a collapsible model selection panel. Users can choose the model used for OCR processing. Only the selected model is invoked for inference.

This enables:

* Accuracy comparison
* Performance tuning
* Cost optimization

### Token and Cost Analytics

A collapsible analytics section provides:

* Input token count
* Output token count
* Total tokens consumed
* Estimated cost based on selected model

This feature provides transparency and is suitable for enterprise usage tracking.

---

## Target Use Cases

AgoraOCR is designed for structured document environments, including:

* Government fee challans
* Official administrative documents
* Banking or financial receipts
* Legal summons or notices
* Invoices and billing documents

---

## System Workflow

1. User uploads an image or PDF
2. The document is preprocessed
3. Selected model performs OCR
4. Layout-aware formatting reconstructs document structure
5. Token usage is calculated
6. Editable output is rendered
7. Optional analytics panel displays usage metrics

---

## Installation

Clone the repository:

```bash
git clone https://github.com/alifarman007/agoraOCR.git
cd agoraOCR
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

---

## Environment Variables

Create a `.env.local` file in the project root directory:

```
API_KEY=your_api_key
MODEL_PROVIDER_KEY=your_provider_key
```

Do not commit this file to version control.

---

## Security Note

API keys and credentials must be stored in environment variables and excluded from the repository. Ensure `.env.local` is listed in `.gitignore`.

---

## License

Specify your license here (MIT / Proprietary / etc.).

---

---
