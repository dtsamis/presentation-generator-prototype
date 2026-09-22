import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmployeeHome from './pages/EmployeeHome';
import ReportView from './pages/ReportView';
import RiskAnalysisReport from './pages/RiskAnalysisReport';
import GeneralReportView from './pages/GeneralReportView';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Simple Global Nav for Prototype */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-center shadow-sm z-10 relative">
          <h1 className="text-xl font-bold text-gray-800 tracking-wide uppercase">AI Presentation Generator</h1>
        </header>

        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<EmployeeHome />} />
            <Route path="/report" element={<ReportView />} />
            <Route path="/report/general" element={<GeneralReportView />} />
            <Route path="/report/risk" element={<RiskAnalysisReport />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
