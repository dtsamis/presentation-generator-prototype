import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import EmployeeHome from './pages/EmployeeHome';
import AdminDashboard from './pages/AdminDashboard';
import ReportView from './pages/ReportView';
import RiskAnalysisReport from './pages/RiskAnalysisReport';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Simple Global Nav for Prototype */}
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm z-10 relative">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-brand-blue"></div>
            <span className="font-semibold text-gray-800">Presentation Generator</span>
          </div>
          <nav className="flex space-x-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-brand-blue">Employee Home</Link>
            <Link to="/admin" className="hover:text-brand-blue">Admin Dashboard</Link>
            <Link to="/report" className="hover:text-brand-blue">Fraud Report</Link>
            <Link to="/report/risk" className="hover:text-brand-blue">Risk Report</Link>
          </nav>
        </header>

        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<EmployeeHome />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/report" element={<ReportView />} />
            <Route path="/report/risk" element={<RiskAnalysisReport />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
