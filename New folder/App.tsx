import React, { useState, useRef } from 'react';
import Header from './components/Header';
import ModelSelector from './components/ModelSelector';
import AnalyticsPanel from './components/AnalyticsPanel';
import { ModelType, FileData, OCRResult } from './types';
import { performOCR } from './services/geminiService';
import { UploadCloud, FileText, Loader2, Copy, Check, File as FileIcon, X, Wand2, Scan, TableProperties } from 'lucide-react';
import StructuredEditorTab from './components/StructuredEditor/StructuredEditorTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ocr' | 'structured'>('ocr');
  
  // --- V1 OCR State ---
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.GEMINI_3_FLASH);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [editableText, setEditableText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getModelDisplayName = (model: string) => {
    if (model.includes('pro')) return '3.0 Pro';
    if (model.includes('flash') && model.includes('3')) return '3.0 Flash';
    return '2.5 Flash';
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);
    setEditableText('');

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError("Please upload a valid image or PDF document.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1];
        setFileData({
          file,
          previewUrl: result,
          base64,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to read file.");
      console.error(err);
    }
  };

  const handleOCR = async () => {
    if (!fileData) return;
    setIsProcessing(true);
    setError(null);
    try {
      const ocrResult = await performOCR(fileData.base64, fileData.mimeType, selectedModel);
      setResult(ocrResult);
      setEditableText(ocrResult.text);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during OCR processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const clearFile = () => {
    setFileData(null);
    setResult(null);
    setEditableText('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      
      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
                <button
                    onClick={() => setActiveTab('ocr')}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                        activeTab === 'ocr' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <Scan className="h-4 w-4" />
                    <span>Raw OCR (V1)</span>
                </button>
                <button
                    onClick={() => setActiveTab('structured')}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                        activeTab === 'structured' 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <TableProperties className="h-4 w-4" />
                    <span>Structured Editor (Delivery Chalan)</span>
                    <span className="ml-1.5 bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-xs font-bold">V2</span>
                </button>
            </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Render New Structured Tab */}
        {activeTab === 'structured' && <StructuredEditorTab />}

        {/* Render Existing V1 OCR Tab */}
        {activeTab === 'ocr' && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="flex flex-col space-y-6">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                    <UploadCloud className="h-5 w-5 mr-2 text-blue-600" />
                    Document Input
                  </h2>
                </div>
                
                <div className="p-6">
                  {!fileData ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group h-[300px] flex flex-col items-center justify-center"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileChange} 
                        accept="image/*,application/pdf"
                      />
                      <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-slate-700 font-medium text-lg mb-2">Click to Upload Document</h3>
                      <p className="text-slate-500 text-sm">Support for Images (JPG, PNG) & PDF</p>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-red-100 p-2 rounded-lg">
                            <FileIcon className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{fileData.file.name}</p>
                            <p className="text-xs text-slate-500">{(fileData.file.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <button 
                          onClick={clearFile}
                          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                          title="Remove file"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="relative w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200 h-[300px] flex items-center justify-center">
                        {fileData.mimeType === 'application/pdf' ? (
                           <object 
                           data={fileData.previewUrl} 
                           type="application/pdf" 
                           className="w-full h-full"
                         >
                           <div className="flex items-center justify-center h-full text-slate-500">
                             <p>PDF Preview</p>
                           </div>
                         </object>
                        ) : (
                          <img 
                            src={fileData.previewUrl} 
                            alt="Document Preview" 
                            className="w-full h-full object-contain" 
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <ModelSelector 
                selectedModel={selectedModel} 
                onModelChange={setSelectedModel} 
                disabled={isProcessing}
              />
              
              <AnalyticsPanel result={result} />

              <div className="mt-auto pt-4">
                 {error && (
                  <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm flex items-start">
                    <span className="font-bold mr-2">Error:</span> {error}
                  </div>
                )}

                <button
                  onClick={handleOCR}
                  disabled={isProcessing || !fileData}
                  className={`w-full py-4 rounded-xl shadow-md flex items-center justify-center text-lg font-bold transition-all transform hover:-translate-y-1 ${
                    !fileData
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : isProcessing 
                        ? 'bg-slate-800 text-white cursor-not-allowed opacity-90' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin mr-3 h-6 w-6" />
                      Processing Document...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      Run Sysnova OCR
                    </>
                  )}
                </button>
                {!fileData && (
                   <p className="text-center text-xs text-slate-400 mt-2">Upload a document to enable processing</p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[600px] transition-all">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 p-1.5 rounded-md">
                    <FileText className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Extracted Output</h2>
                    <p className="text-xs text-slate-500">Editable • Formatted • {getModelDisplayName(selectedModel)}</p>
                  </div>
                </div>
                {result && (
                  <button
                    onClick={handleCopy}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isCopied 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{isCopied ? 'Copied to Clipboard' : 'Copy Text'}</span>
                  </button>
                )}
              </div>

              <div className="flex-grow relative bg-white">
                 {isProcessing && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20 backdrop-blur-[2px]">
                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 mb-6"></div>
                     <p className="text-slate-800 font-semibold text-lg animate-pulse">Extracting Text & Layout...</p>
                     <p className="text-slate-500 mt-2">Please wait while our AI processes your document</p>
                   </div>
                 )}

                 <div className="relative w-full h-full">
                    {!editableText && !isProcessing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none p-8 text-center">
                            <FileText className="h-16 w-16 mb-4 opacity-20" />
                            <p className="text-xl font-medium opacity-40">Output will appear here</p>
                            <p className="text-sm opacity-40 mt-2 max-w-md">
                                The extracted text will preserve the original layout, spacing, and language of your uploaded document.
                            </p>
                        </div>
                    )}
                    <textarea
                        value={editableText}
                        onChange={(e) => setEditableText(e.target.value)}
                        placeholder=""
                        className="w-full h-full p-8 resize-none focus:outline-none focus:ring-0 bangla-text text-slate-800 font-mono text-base leading-7 whitespace-pre-wrap border-none"
                        spellCheck="false"
                        style={{ minHeight: '600px' }}
                    />
                 </div>
              </div>
              
              <div className="bg-slate-50 p-3 border-t border-slate-200 text-xs text-slate-500 flex justify-between px-6">
                 <span>Sysnova OCR Engine Output</span>
                 <div className="flex space-x-4">
                     <span>{editableText.length} characters</span>
                     <span>{editableText.split(/\s+/).filter(w => w.length > 0).length} words</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
        )}
      </main>
    </div>
  );
};

export default App;