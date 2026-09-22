import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, Upload, X, Plus, PlayCircle, Clock } from 'lucide-react';

const EmployeeHome = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Default mock conversations in history
  const [chatHistory] = useState([
    { id: 1, text: "Fraud Detection Monthly Review", date: "Sep 22, 2026", type: "report" },
    { id: 2, text: "Risk Analysis - InfoSec", date: "Sep 20, 2026", type: "report" },
    { id: 3, text: "Expense policy question", date: "Sep 18, 2026", type: "chat" }
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
      const fileNames = uploadedFiles.map(f => f.name.toLowerCase());
      const state = { sources: uploadedFiles.map(f => f.name) };
      
      // Navigate dynamically based on filename keywords
      if (fileNames.some(f => f.includes('risk'))) {
        navigate('/report/risk', { state });
      } else {
        // generic route
        navigate('/report', { state });
      }
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 pb-24 h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, Sarah</h1>
        <p className="text-gray-500">Your recent interaction history is below.</p>
      </div>

      {!isCreatingNew ? (
        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock size={18} className="text-brand-blue" /> 
              Recent Reports & Interactions
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
             {chatHistory.map(item => (
                <div key={item.id} className="p-4 mx-4 my-2 border border-gray-100 rounded-2xl hover:bg-blue-50/50 hover:border-blue-100 cursor-pointer transition flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center border border-blue-100">
                      {item.type === 'report' ? <FileText size={20} /> : <MessageSquare size={20} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-[15px]">{item.text}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                    </div>
                  </div>
                  <button className="text-brand-blue font-semibold text-sm px-4 py-2 hover:bg-blue-100 rounded-xl transition opacity-0 group-hover:opacity-100">View</button>
                </div>
             ))}
          </div>
          <div className="p-6 border-t border-gray-100 bg-gray-50/80">
             <button 
                onClick={() => setIsCreatingNew(true)}
                className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
             >
               <Plus size={24} />
               Create New Report
             </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-fade-in relative">
          <button 
             onClick={() => { setIsCreatingNew(false); setUploadedFiles([]); setPrompt(''); }}
             className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 bg-gray-100 rounded-full p-2 transition"
          >
             <X size={20} />
          </button>
          
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 pr-10">New Analysis</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Upload your dataset (CSV, Excel) and provide optional instructions. The system will automatically build the appropriate interactive deck layout (e.g. Risk Matrix, Chart, Pareto) based on the data provided.
            </p>
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
                placeholder="E.g., Analyze this data for scheduling conflicts and build a Gantt chart..."
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
      )}
    </div>
  );
};

export default EmployeeHome;
