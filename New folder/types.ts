export enum ModelType {
  GEMINI_3_PRO = 'gemini-3-pro-preview',
  GEMINI_3_FLASH = 'gemini-3-flash-preview',
  GEMINI_2_5_FLASH = 'gemini-2.5-flash-latest',
}

export interface OCRResult {
  text: string;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
  modelUsed: string;
}

export interface FileData {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export interface CostEstimate {
  inputCost: number;
  outputCost: number;
  totalCost: number;
}