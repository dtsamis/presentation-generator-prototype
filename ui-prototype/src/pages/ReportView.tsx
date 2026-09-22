import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
  { name: 'Jan', value: 88 },
  { name: 'Feb', value: 91 },
  { name: 'Mar', value: 86 },
  { name: 'Apr', value: 89 },
  { name: 'May', value: 92 },
  { name: 'Jun', value: 90 },
  { name: 'Jul', value: 87 },
  { name: 'Aug', value: 65, fill: '#EF4444' }, // Red for anomaly
];

const ReportView = () => {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-brand-blue text-white rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">Fraud Detection — Monthly Report</h1>
            <p className="text-sm text-white/80 mb-3">Compliance · August 2026 · Scheduled report (MOC material)</p>
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 inline-block mt-2 border border-white/20">
          <p className="text-xs font-medium text-white flex items-center gap-2">
            <span className="uppercase tracking-wider opacity-70">Source Data:</span>
            <span className="bg-white/20 px-2 py-1 rounded">process_performance.csv</span>
            <span className="bg-white/20 px-2 py-1 rounded">incidents.csv</span>
            <span className="bg-white/20 px-2 py-1 rounded">crqs.csv</span>
            <span className="bg-white/20 px-2 py-1 rounded">risk_matrix.csv</span>
          </p>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="p-8 grid grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <div className="col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-semibold text-gray-800">Performance vs. target</h2>
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">Anomaly: -22% vs. baseline</span>
            </div>
            
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <ReferenceLine y={90} stroke="#9CA3AF" strokeDasharray="3 3" label={{ position: 'right', value: 'target', fill: '#6B7280', fontSize: 12 }} />
                  <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Narrative Section */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">What happened</h3>
            <ul className="space-y-4 text-sm text-gray-700 list-disc pl-4 marker:text-brand-blue">
              <li>Performance dropped 22% against its rolling baseline in August.</li>
              <li>5 related incidents in the same window (INC-0033 to INC-0037).</li>
              <li>Root cause: rule-engine misfire delaying transaction reviews.</li>
              <li>Remediation: CRQ-0007 in progress, target Sept 15.</li>
              <li className="text-green-700">Compliance check: claim consistent with open risk RSK-0011.</li>
            </ul>
          </div>
        </div>
        
        {/* Footer Strip */}
        <div className="bg-teal-50 border-t border-teal-100 px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-teal-600 px-2 py-0.5 rounded">Month-over-month</span>
            <span className="text-sm text-teal-900">Since July: + 3 new risks · 2 resolved · 1 CRQ implemented</span>
          </div>
          <span className="text-xs text-teal-700/70">Compliance-checked · Audit ID RUN-2026-08-014</span>
        </div>
      </div>

      {/* Month over month detail (Page 4 bottom) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Risk Register: July → August 2026</h2>
        <p className="text-sm text-gray-500 mb-6">Compares this run's structured data against the same tables from last month's run.</p>

        <div className="grid grid-cols-3 gap-6">
          {/* New */}
          <div>
            <div className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded mb-3 flex justify-between">
              <span>NEW</span>
              <span>3</span>
            </div>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded p-3 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 block mb-1">RSK-0015</span>
                <p className="text-sm text-gray-800">Elevated phishing attempts targeting Payments staff.</p>
              </div>
              <div className="border border-gray-200 rounded p-3 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 block mb-1">RSK-0016</span>
                <p className="text-sm text-gray-800">Vendor SLA breach risk for Fraud Detection service.</p>
              </div>
            </div>
          </div>

          {/* Resolved */}
          <div>
            <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded mb-3 flex justify-between">
              <span>RESOLVED</span>
              <span>2</span>
            </div>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded p-3 shadow-sm opacity-60">
                <span className="text-xs font-semibold text-gray-500 block mb-1">RSK-0009</span>
                <p className="text-sm text-gray-800 line-through">Manual reconciliation risk in Loan Origination — automated.</p>
              </div>
            </div>
          </div>

          {/* Unchanged */}
          <div>
            <div className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded mb-3 flex justify-between">
              <span>UNCHANGED</span>
              <span>13</span>
            </div>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded p-3 shadow-sm text-gray-500 text-sm">
                <span className="text-gray-800 font-medium block">carried over</span>
                No status change since July — excluded from the narrative to keep it short.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
