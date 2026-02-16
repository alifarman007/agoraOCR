import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, Sparkles, FileInput } from 'lucide-react';
import { ModelType } from '../../types';
import ModelSelector from '../ModelSelector';
import { performOCR } from '../../services/geminiService';
import { structureDeliveryChalan } from '../../services/structureService';
import { DeliveryChalanDocument } from '../../types/delivery-chalan';
import ChalanEditor from './ChalanEditor';

const StructuredEditorTab: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.GEMINI_3_FLASH);
  const [fileData, setFileData] = useState<{file: File, previewUrl: string, base64: string, mimeType: string} | null>(null);
  const [status, setStatus] = useState<'idle' | 'ocr' | 'structuring' | 'ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [structuredDoc, setStructuredDoc] = useState<DeliveryChalanDocument | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getModelDisplayName = (model: string) => {
      if (model.includes('pro')) return '3.0 Pro';
      if (model.includes('flash') && model.includes('3')) return '3.0 Flash';
      return '2.5 Flash';
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setStatus('idle');
    setStructuredDoc(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFileData({
        file,
        previewUrl: result,
        base64: result.split(',')[1],
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const processDocument = async () => {
    if (!fileData) return;
    setErrorMessage(null);
    
    try {
      // Step 1: OCR
      setStatus('ocr');
      const ocrResult = await performOCR(fileData.base64, fileData.mimeType, selectedModel);
      
      // Step 2: Structuring
      setStatus('structuring');
      const structuredResult = await structureDeliveryChalan(ocrResult.text, selectedModel);
      
      setStructuredDoc(structuredResult);
      setStatus('ready');

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred.");
      setStatus('error');
    }
  };

  if (status === 'ready' && structuredDoc && fileData) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Structured Editor</h2>
            <button 
                onClick={() => { setStatus('idle'); setStructuredDoc(null); setFileData(null); }}
                className="text-sm text-slate-500 hover:text-slate-800 underline"
            >
                Upload New Document
            </button>
         </div>
         <ChalanEditor initialDocument={structuredDoc} imageUrl={fileData.previewUrl} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
       <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Delivery Chalan Extractor</h2>
          <p className="text-slate-500">Upload a Chalan image to extract structured data (Bangla/English) into editable JSON.</p>
       </div>

       <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
             <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} disabled={status !== 'idle' && status !== 'error'} />
          </div>

          <div className="p-8">
            {!fileData ? (
               <div 
               onClick={() => fileInputRef.current?.click()}
               className="border-2 border-dashed border-slate-300 rounded-xl p-16 text-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group"
             >
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 onChange={handleFileChange} 
                 accept="image/*,application/pdf"
               />
               <div className="bg-indigo-100 p-5 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Sparkles className="h-10 w-10 text-indigo-600" />
               </div>
               <h3 className="text-slate-900 font-semibold text-xl mb-2">Upload Delivery Chalan</h3>
               <p className="text-slate-500">Supports JPG, PNG & PDF</p>
             </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="relative w-64 h-80 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 mb-6 shadow-md">
                        <img src={fileData.previewUrl} className="w-full h-full object-contain" alt="Preview" />
                    </div>
                    
                    {status === 'idle' || status === 'error' ? (
                        <div className="w-full max-w-md space-y-4">
                            {status === 'error' && (
                                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center mb-4 border border-red-200">
                                    {errorMessage}
                                </div>
                            )}
                            <button
                                onClick={processDocument}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center"
                            >
                                <Sparkles className="mr-2 h-5 w-5" /> Process Chalan Structure
                            </button>
                             <button
                                onClick={() => setFileData(null)}
                                className="w-full py-2 text-slate-500 hover:text-slate-700 font-medium text-sm"
                            >
                                Remove File
                            </button>
                        </div>
                    ) : (
                        <div className="w-full max-w-md text-center">
                            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                {status === 'ocr' ? 'Step 1/2: Extracting Text...' : 'Step 2/2: Structuring Data...'}
                            </h3>
                            <p className="text-sm text-slate-500">Using {getModelDisplayName(selectedModel)} AI model</p>
                            
                            <div className="w-full bg-slate-200 rounded-full h-2 mt-6 overflow-hidden">
                                <div 
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-1000 ease-in-out" 
                                    style={{ width: status === 'ocr' ? '40%' : '85%' }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
          </div>
       </div>
    </div>
  );
};

export default StructuredEditorTab;