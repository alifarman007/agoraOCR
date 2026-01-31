import React from 'react';
import { ScanText } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ScanText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Sysnova AI Organization</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Advanced OCR System</p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="text-xs bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-slate-300">
            v1.0.0 • Secure Processing
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;