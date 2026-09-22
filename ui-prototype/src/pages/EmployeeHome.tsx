import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ShieldAlert, BarChart3, Upload, X, PlayCircle, Clock, ChevronLeft } from 'lucide-react';

const EmployeeHome = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeView, setActiveView] = useState<'menu' | 'upload_general' | 'upload_fraud' | 'upload_risk'>('menu');
  const [prompt, setPrompt] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Default mock history
  const [history] = useState([
    { id: 1, text: "Fraud Detection Monthly Review", date: "Sep 22, 2026", type: "fraud" },
    { id: 2, text: "Risk Analysis - InfoSec", date: "Sep 20, 2026", type: "risk" },
    { id: 3, text: "Q3 General Performance", date: "Sep 18, 2026", type: "general" }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateReport = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const state = { sources: uploadedFiles.map(f => f.name) };
      
      // Navigate dynamically based on selected view
      if (activeView === 'upload_risk') {
        navigate('/report/risk', { state });
      } else {
        // Fraud and General share the /report view for now
        navigate('/report', { state });
      }
    }, 1500);
  };

  const renderUploadWindow = (title: string, desc: string) => (
    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-fade-in relative">
      <button 
         onClick={() => { setActiveView('menu'); setUploadedFiles([]); setPrompt(''); }}
         className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 bg-gray-100 rounded-full p-2 transition z-10"
      >
         <X size={20} />
      </button>
      
      <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
        <button 
          onClick={() => { setActiveView('menu'); setUploadedFiles([]); setPrompt(''); }} 
          className="p-2 hover:bg-gray-200 text-gray-600 rounded-full transition"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title} Upload</h2>
          <p className="text-gray-500 text-sm mt-1">{desc}</p>
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col gap-6 bg-white overflow-y-auto">
        {/* Upload Area */}
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/40 p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/80 transition min-h-[220px]"
        >
           <div className="w-16 h-16 bg-white shadow-sm text-brand-blue rounded-full flex items-center justify-center mb-4 border border-blue-100">
             <Upload size={28} />
           </div>
           <p className="font-bold text-gray-800 mb-1">Click to upload source files</p>
           <p className="text-xs text-gray-500">Supports .csv, .xlsx, .json</p>
           <input 
              type="file" 
              accept=".csv,.xlsx,.json" 
              multiple 
              hidden 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
           />
        </div>

        {/* Staged Files */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm px-4 py-2.5 rounded-xl">
                <FileText size={16} className="text-brand-blue" />
                <span className="text-sm font-semibold text-gray-700 max-w-[200px] truncate">{file.name}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="text-gray-400 hover:text-red-500 ml-2 p-1 rounded-full hover:bg-red-50 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-auto">
          <label className="block text-sm font-bold text-gray-700 mb-2">Analysis Instructions (Optional)</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`E.g., Format the ${title.toLowerCase()} for the Q3 stakeholder meeting...`}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent focus:bg-white outline-none resize-none transition"
            rows={3}
          />
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
         <button 
            onClick={generateReport}
            disabled={uploadedFiles.length === 0 || isUploading}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-3 ${uploadedFiles.length === 0 || isUploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-brand-blue text-white hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'}`}
         >
           {isUploading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing Data...</>
           ) : (
              <><PlayCircle size={22} /> Generate Interactive Deck</>
           )}
         </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto p-8 pb-24 h-[calc(100vh-80px)] flex gap-10">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full">
        
        {/* Title and description */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">AI Report & Analysis Generator</h1>
          <p className="text-gray-600 text-lg max-w-3xl leading-relaxed">
            Transform raw data into interactive, presentation-ready insights. Upload your datasets, add custom instructions, and instantly generate comprehensive dashboards for general metrics, fraud detection, or risk analysis.
          </p>
        </div>

        {/* Content View */}
        {activeView === 'menu' && (
          <div className="flex-1 flex flex-col bg-transparent animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">Select a Report Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* General Report */}
              <div 
                onClick={() => setActiveView('upload_general')}
                className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:border-brand-blue cursor-pointer transition-all flex flex-col gap-4 group"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 transition duration-300">
                  <BarChart3 size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2">General Report</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Standard metrics and performance visualization. Great for generic or overarching datasets.</p>
                </div>
              </div>

              {/* Fraud Report */}
              <div 
                onClick={() => setActiveView('upload_fraud')}
                className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-500 cursor-pointer transition-all flex flex-col gap-4 group"
              >
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition duration-300">
                  <ShieldAlert size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2">Fraud Report</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Analyze transaction anomalies, regional performance trends, and block statuses.</p>
                </div>
              </div>

              {/* Risk Report */}
              <div 
                onClick={() => setActiveView('upload_risk')}
                className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:border-rose-500 cursor-pointer transition-all flex flex-col gap-4 group"
              >
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover:scale-110 transition duration-300">
                  <FileText size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2">Risk Report</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Interactive risk matrix with detailed case-by-case drill-downs and approval workflows.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Upload Views */}
        {activeView === 'upload_general' && renderUploadWindow('General Report', 'Upload standard metric files for a generic performance deck.')}
        {activeView === 'upload_fraud' && renderUploadWindow('Fraud Report', 'Upload transaction logs and anomaly files for the fraud detection deck.')}
        {activeView === 'upload_risk' && renderUploadWindow('Risk Analysis', 'Upload incident reports and matrices for the interactive risk analysis deck.')}

      </div>

      {/* Right Sidebar - History */}
      <div className="w-96 flex-shrink-0 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col h-full">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50 rounded-t-3xl">
          <Clock size={20} className="text-brand-blue" />
          <h2 className="font-bold text-gray-800 text-lg">Report History</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {history.map(item => (
            <div 
              key={item.id} 
              className="p-5 border border-gray-100 rounded-2xl hover:bg-blue-50/50 hover:border-blue-100 cursor-pointer transition group shadow-sm hover:shadow"
              onClick={() => {
                if(item.type === 'risk') navigate('/report/risk');
                else navigate('/report');
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-100 group-hover:text-brand-blue group-hover:bg-blue-50 transition shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-[15px] leading-tight group-hover:text-brand-blue transition">{item.text}</h3>
                  <p className="text-xs font-semibold text-gray-400 mt-2 uppercase tracking-wide">{item.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default EmployeeHome;
