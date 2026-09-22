import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mar', runs: 16, flags: 2 },
  { name: 'Apr', runs: 18, flags: 3 },
  { name: 'May', runs: 20, flags: 4 },
  { name: 'Jun', runs: 19, flags: 2 },
  { name: 'Jul', runs: 22, flags: 5 },
  { name: 'Aug', runs: 24, flags: 3 },
];

const AdminDashboard = () => {
  const [kpis, setKpis] = useState<any>({});
  const [flagged, setFlagged] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, these would be fetch calls to the backend
    setKpis({
      runs: 24,
      scanned: 1204,
      flagged: 3,
      activeUsers: 18,
      approvedModels: 3
    });

    setFlagged([
      {
        id: 'INC-0009',
        description: 'Case escalated by customer [name masked] (account [account masked]) after duplicate charge in Loan Origination.',
        score: 68,
        factors: ['name', 'account number']
      },
      {
        id: 'INC-0018',
        description: 'Support ticket referenced customer [name masked], national ID [ID masked], complaining about Payment Processing delay.',
        score: 74,
        factors: ['name', 'national ID']
      },
      {
        id: 'INC-0027',
        description: 'Support ticket referenced customer [name masked], national ID [ID masked], complaining about Mobile Banking App delay.',
        score: 71,
        factors: ['name', 'national ID']
      }
    ]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">The control point between employees and the model: review flagged requests, watch usage.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-3xl font-bold text-brand-blue">{kpis.runs}</p>
          <p className="text-xs text-gray-500 mt-1">Runs this month</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-3xl font-bold text-brand-blue">{kpis.scanned}</p>
          <p className="text-xs text-gray-500 mt-1">Incidents scanned</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
          <p className="text-3xl font-bold text-red-500">{kpis.flagged}</p>
          <p className="text-xs text-gray-500 mt-1">Flagged, awaiting you</p>
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500"></div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-3xl font-bold text-brand-blue">{kpis.activeUsers}</p>
          <p className="text-xs text-gray-500 mt-1">Active users</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-3xl font-bold text-brand-blue">{kpis.approvedModels}</p>
          <p className="text-xs text-gray-500 mt-1">Approved models</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Runs & PII flags over time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F3F4F6'}} />
                <Bar dataKey="runs" fill="#818CF8" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Usage */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Model usage & status</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Claude Sonnet 5</span>
                <span className="text-gray-500">62%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-brand-blue h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
              <span className="inline-block mt-2 text-[10px] uppercase font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">Enabled</span>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Claude Opus 5</span>
                <span className="text-gray-500">23%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }}></div>
              </div>
              <span className="inline-block mt-2 text-[10px] uppercase font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">Enabled</span>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Claude Haiku 4.5</span>
                <span className="text-gray-500">15%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-orange-400 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <span className="inline-block mt-2 text-[10px] uppercase font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged for Review Queue */}
      <div className="mb-8 bg-gray-50/50 p-6 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Flagged for Review</h3>
            <p className="text-sm text-gray-500">Already auto-masked by the Masking Agent — flagged because the risk score stayed at or above 60.</p>
          </div>
          <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded">{flagged.length} pending</span>
        </div>

        <div className="space-y-3">
          {flagged.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex gap-4 items-start">
                <div className="w-24">
                  <span className="font-semibold text-sm text-gray-900 block">{item.id}</span>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase font-medium mt-1 inline-block">auto-masked</span>
                </div>
                <div className="text-sm text-gray-700 max-w-2xl leading-relaxed" 
                     dangerouslySetInnerHTML={{ __html: item.description.replace(/\[(.*?)\]/g, '<span class="bg-blue-100 text-blue-800 px-1 rounded mx-1 font-medium text-xs">[$1]</span>') }} />
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                  Risk {item.score}/100 : {item.factors.join(' + ')}
                </span>
                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1.5 rounded bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">Approve</button>
                  <button className="text-xs px-3 py-1.5 rounded bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100">Redact</button>
                  <button className="text-xs px-3 py-1.5 rounded bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
