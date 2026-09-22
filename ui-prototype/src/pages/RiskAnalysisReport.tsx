import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const riskData = [
  { name: 'Cyber', value: 3, color: '#EF4444' }, // Red
  { name: 'Operational', value: 5, color: '#F59E0B' }, // Orange
  { name: 'Regulatory', value: 2, color: '#3B82F6' }, // Blue
  { name: 'IT', value: 4, color: '#10B981' }, // Green
];

const RiskAnalysisReport = () => {
  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="bg-slate-800 text-white rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">Enterprise Risk Analysis — Q3 2026</h1>
            <p className="text-sm text-slate-300 mb-3">InfoSec & Compliance · September 2026 · Scheduled report</p>
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 inline-block mt-2 border border-slate-600">
          <p className="text-xs font-medium text-white flex items-center gap-2">
            <span className="uppercase tracking-wider text-slate-400">Source Data:</span>
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-600">risk_matrix.csv</span>
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-600">incidents.csv</span>
          </p>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="p-8 grid grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <div className="col-span-1 border-r border-gray-100 pr-8">
            <h2 className="text-sm font-semibold text-gray-800 mb-6">Open Risks by Category</h2>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 bg-red-50 text-red-700 p-3 rounded text-sm font-medium text-center border border-red-100">
              High Severity Alert: 2 Cyber Risks
            </div>
          </div>

          {/* Narrative Section */}
          <div className="col-span-2">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Executive Summary</h3>
            <ul className="space-y-4 text-sm text-gray-700 list-disc pl-4 marker:text-slate-500">
              <li><strong>Cyber Threat Increase:</strong> Elevated phishing attempts (RSK-0015) targeting Payments staff remain the highest critical risk this quarter.</li>
              <li><strong>Operational Stability:</strong> Manual reconciliation risk (RSK-0009) in Loan Origination was successfully automated and closed.</li>
              <li><strong>IT Infrastructure:</strong> Legacy failover gaps (RSK-0017) in the Mobile Banking App are marked for Q4 remediation.</li>
              <li className="text-green-700"><strong>Compliance Check:</strong> Regulatory reporting dependency (RSK-0011) has been mitigated and verified by Audit.</li>
            </ul>
          </div>
        </div>
        
        {/* Footer Strip */}
        <div className="bg-slate-100 border-t border-slate-200 px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-slate-600 px-2 py-0.5 rounded">Quarter-over-Quarter</span>
            <span className="text-sm text-slate-800">+1 Critical Cyber Risk · -2 Operational Risks</span>
          </div>
          <span className="text-xs text-slate-500">Compliance-checked · Audit ID RSK-2026-Q3-001</span>
        </div>
      </div>

      {/* Deep Dive Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Critical Open Risks</h2>
        <p className="text-sm text-gray-500 mb-6">Highest impact risks requiring immediate attention or mitigation plans.</p>

        <div className="grid grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="border border-red-200 bg-red-50/30 rounded-lg p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">RSK-0015</span>
              <span className="text-xs font-medium text-gray-500">Owner: InfoSec</span>
            </div>
            <h3 className="font-semibold text-gray-900 mt-2 mb-2">Targeted Phishing (Payments)</h3>
            <p className="text-sm text-gray-700 mb-4">Highly sophisticated phishing campaigns bypassing tier-1 email filters, specifically targeting staff with payment authorization limits.</p>
            <div className="flex gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Likelihood: High</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Impact: High</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-orange-200 bg-orange-50/30 rounded-lg p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">RSK-0017</span>
              <span className="text-xs font-medium text-gray-500">Owner: Engineering</span>
            </div>
            <h3 className="font-semibold text-gray-900 mt-2 mb-2">Mobile App Failover Gap</h3>
            <p className="text-sm text-gray-700 mb-4">The secondary active-active database cluster for mobile banking auth is under-provisioned, risking downtime during a primary failure.</p>
            <div className="flex gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Likelihood: Med</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Impact: High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysisReport;
