import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import pptxgen from 'pptxgenjs';
import { Download, Sparkles, ShieldAlert, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';

const data = [
  { name: 'Week 1', transactions: 4500, flagged: 120 },
  { name: 'Week 2', transactions: 5200, flagged: 150 },
  { name: 'Week 3', transactions: 4800, flagged: 90 },
  { name: 'Week 4', transactions: 6100, flagged: 210 },
];

const barData = [
  { name: 'NA', trustScore: 88 },
  { name: 'EMEA', trustScore: 76 },
  { name: 'APAC', trustScore: 92 },
  { name: 'LATAM', trustScore: 68 },
];

// Mock database mapping regions to specific customer anomalies for drill-down
const drillDownData: Record<string, any[]> = {
  'NA': [
    { id: 'CUST-10021', segment: 'Premium', trustLevel: 'Low', amount: '$4,200', status: 'Flagged' },
    { id: 'CUST-10045', segment: 'Corporate', trustLevel: 'Untrusted', amount: '$12,500', status: 'Suspended' },
  ],
  'EMEA': [
    { id: 'CUST-10111', segment: 'Retail', trustLevel: 'Low', amount: '€8,100', status: 'Under Review' },
    { id: 'CUST-10102', segment: 'Guest', trustLevel: 'Untrusted', amount: '€45', status: 'Suspended' },
  ],
  'APAC': [
    { id: 'CUST-10212', segment: 'Premium', trustLevel: 'Low', amount: '¥450,000', status: 'Under Review' }
  ],
  'LATAM': [
    { id: 'CUST-10311', segment: 'Retail', trustLevel: 'Untrusted', amount: 'R$1,200', status: 'Suspended' },
    { id: 'CUST-10323', segment: 'Corporate', trustLevel: 'Low', amount: 'R$8,400', status: 'Flagged' },
    { id: 'CUST-10355', segment: 'Guest', trustLevel: 'Untrusted', amount: 'R$3,100', status: 'Suspended' },
  ]
};

const ReportView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const sources: string[] = location.state?.sources || ['customer_transactions.csv'];

  const handleBarClick = (data: any) => {
    setSelectedRegion(selectedRegion === data.name ? null : data.name);
  };

  const exportToPPT = () => {
    setIsExporting(true);
    let pres = new pptxgen();
    
    // Slide 1: Title
    let slide1 = pres.addSlide();
    slide1.addText("Transactions Analysis — Monthly Report", {
      x: 0.5, y: 0.5, w: '90%', h: 0.8,
      fontSize: 24, bold: true, color: '1E293B'
    });
    
    pres.writeFile({ fileName: "Transactions_Analysis_Report.pptx" })
      .then(() => setIsExporting(false))
      .catch((e) => {
        console.error(e);
        setIsExporting(false);
      });
  };

  const currentDrillDown = selectedRegion ? drillDownData[selectedRegion] : [];
  
  // Prepare context data for the ChatWidget
  const reportContext = JSON.stringify({
    reportType: "Transactions Analysis Monthly Report",
    weeklyTrends: data,
    regionalPerformance: barData,
    incidentDetails: drillDownData
  });

  return (
    <div className="max-w-6xl mx-auto p-8 pb-20">
      {/* Header */}
      <div className="bg-brand-blue text-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">Transactions Analysis — Monthly Report</h1>
            <p className="text-sm text-white/80 mb-4">Compliance · August 2026 · Scheduled report (MOC material)</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 border border-blue-700 px-4 py-2 rounded transition text-sm font-medium"
            >
              Back to Home
            </button>
            <button 
              onClick={exportToPPT}
              disabled={isExporting}
              className="flex items-center gap-2 bg-white text-brand-blue hover:bg-gray-100 px-4 py-2 rounded transition text-sm font-medium shadow-sm"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Download size={16} />
              )}
              {isExporting ? 'Generating PPT...' : 'Export to PPT'}
            </button>
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 inline-block border border-white/20 mt-2">
          <p className="text-xs font-medium text-white/90 flex items-center gap-2">
            <span className="uppercase tracking-wider text-white/60">Source Data:</span>
            {sources.map(src => (
              <span key={src} className="bg-white/20 px-2 py-1 rounded">{src}</span>
            ))}
          </p>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="bg-red-50 text-red-500 p-3 rounded-lg"><ShieldAlert size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Suspicious Txs</p>
            <h3 className="text-2xl font-black text-gray-800">1,178</h3>
            <p className="text-xs text-red-500 font-semibold mt-1">+12% vs prev month</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="bg-green-50 text-green-500 p-3 rounded-lg"><CheckCircle size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Trusted Transactions</p>
            <h3 className="text-2xl font-black text-gray-800">1,749</h3>
            <p className="text-xs text-green-600 font-semibold mt-1">Backlog clearing</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="bg-blue-50 text-brand-blue p-3 rounded-lg"><Clock size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Avg Trust Score</p>
            <h3 className="text-2xl font-black text-gray-800">14.2h</h3>
            <p className="text-xs text-gray-500 font-semibold mt-1">Time to Resolve</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="bg-orange-50 text-orange-500 p-3 rounded-lg"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Value at Risk</p>
            <h3 className="text-2xl font-black text-gray-800">$1.4M</h3>
            <p className="text-xs text-red-500 font-semibold mt-1">Across 12 open cases</p>
          </div>
        </div>
      </div>

      {/* Grid Layout for Charts */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        
        {/* Chart 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-6">Flagged vs Trusted Transactions Transactions (Aug)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Line type="monotone" dataKey="flagged" stroke="#EF4444" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="Trusted Transactions" stroke="#10B981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Regional Customer Trust Score</h2>
          <p className="text-xs text-gray-500 mb-1">Percentage of incidents Trusted Transactions within the 24-hour Service Level Agreement.</p>
          <p className="text-xs text-brand-blue mb-4 font-semibold">Click a region bar to drill down into localized incidents</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <RechartsTooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                  formatter={(value: any) => [`${value}%`, 'Trust Score']}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '10px'}} />
                <Bar 
                  name="Trust Score (%)"
                  dataKey="trustScore" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]} 
                  onClick={handleBarClick} 
                  className="cursor-pointer hover:opacity-80 transition" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Drill Down Section */}
      {selectedRegion && (
        <div className="bg-white rounded-xl border border-brand-blue shadow-lg p-6 mb-6 animate-fade-in flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Customer Drill-Down: {selectedRegion} Region</h2>
            <button onClick={() => setSelectedRegion(null)} className="text-sm text-brand-blue hover:underline">Close</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer ID</th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Segment</th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Trust Level</th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount at Risk</th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentDrillDown.map((customer: any) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 text-sm font-medium text-brand-blue">{customer.id}</td>
                    <td className="p-3 text-sm text-gray-700">{customer.segment}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold
                        ${customer.trustLevel === 'Untrusted' ? 'bg-red-50 text-red-700 border border-red-100' : 
                          'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                        {customer.trustLevel}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-700">{customer.amount}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${customer.status === 'Suspended' ? 'bg-red-100 text-red-800' : 
                          customer.status === 'Flagged' ? 'bg-orange-100 text-orange-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Executive Summary Block */}
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Critical Incidents & MOC Findings</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-red-50 border border-red-100">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
            <div>
              <h3 className="font-semibold text-red-900">Spike in 'Account Takeover' flags (Week 3)</h3>
              <p className="text-sm text-red-700 mt-1">Correlates directly with the new credential stuffing campaign originating from APAC IPs. Recommend immediate geo-fencing review.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 border border-orange-100">
            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
            <div>
              <h3 className="font-semibold text-orange-900">LATAM Performance Drop (65%)</h3>
              <p className="text-sm text-orange-700 mt-1">Primarily driven by a backlog in manual reviews for Velocity Checks. SLA breached by 14 hours on average.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Chat Widget */}
      <ChatWidget context={reportContext} title="Transactions Analysis Report Assistant" />
    </div>
  );
};

export default ReportView;
