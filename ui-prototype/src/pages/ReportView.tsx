import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import pptxgen from 'pptxgenjs';
import { Download, Sparkles } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';

const data = [
  { name: 'Week 1', flagged: 400, resolved: 240 },
  { name: 'Week 2', flagged: 300, resolved: 139 },
  { name: 'Week 3', flagged: 200, resolved: 980 },
  { name: 'Week 4', flagged: 278, resolved: 390 },
];

const barData = [
  { name: 'NA', performance: 85 },
  { name: 'EMEA', performance: 72 },
  { name: 'APAC', performance: 90 },
  { name: 'LATAM', performance: 65 },
];

// Mock database mapping regions to specific incidents for drill-down
const drillDownData: Record<string, any[]> = {
  'NA': [
    { id: 'TRX-8821', type: 'Velocity Check', amount: '$4,200', status: 'Blocked' },
    { id: 'TRX-8845', type: 'Account Takeover', amount: '$12,500', status: 'Under Review' },
  ],
  'EMEA': [
    { id: 'TRX-9011', type: 'Sanctions Match', amount: '€8,100', status: 'Escalated' },
    { id: 'TRX-9102', type: 'Card Testing', amount: '€45', status: 'Blocked' },
  ],
  'APAC': [
    { id: 'TRX-7712', type: 'Geo-mismatch', amount: '¥450,000', status: 'Under Review' }
  ],
  'LATAM': [
    { id: 'TRX-6611', type: 'Velocity Check', amount: 'R$1,200', status: 'Blocked' },
    { id: 'TRX-6623', type: 'Known IP', amount: 'R$8,400', status: 'Escalated' },
    { id: 'TRX-6655', type: 'Device Fingerprint', amount: 'R$3,100', status: 'Blocked' },
  ]
};

const ReportView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const sources: string[] = location.state?.sources || ['fraud_logs.csv'];

  const handleBarClick = (data: any) => {
    setSelectedRegion(selectedRegion === data.name ? null : data.name);
  };

  useEffect(() => {
    if (!selectedRegion) return;
    setLoadingSuggestion(true);
    setAiSuggestion('');
    
    // Call our LLM backend
    fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Analyze this fraud data for the ${selectedRegion} region: ${JSON.stringify(drillDownData[selectedRegion])}. Provide a single, short paragraph (under 40 words) suggesting exactly one actionable improvement to reduce these fraud incidents.`
      })
    })
    .then(res => res.json())
    .then(data => {
      setAiSuggestion(data.reply);
      setLoadingSuggestion(false);
    })
    .catch(e => {
      console.error(e);
      setAiSuggestion("Implement stricter IP velocity limits and require step-up authentication for high-risk regions.");
      setLoadingSuggestion(false);
    });
  }, [selectedRegion]);

  const exportToPPT = () => {
    setIsExporting(true);
    let pres = new pptxgen();
    
    // Slide 1: Title
    let slide1 = pres.addSlide();
    slide1.addText("Fraud Detection — Monthly Report", {
      x: 0.5, y: 0.5, w: '90%', h: 0.8,
      fontSize: 24, bold: true, color: '1E293B'
    });
    
    pres.writeFile({ fileName: "Fraud_Detection_Report.pptx" })
      .then(() => setIsExporting(false))
      .catch((e) => {
        console.error(e);
        setIsExporting(false);
      });
  };

  const currentDrillDown = selectedRegion ? drillDownData[selectedRegion] : [];
  
  // Prepare context data for the ChatWidget
  const reportContext = JSON.stringify({
    reportType: "Fraud Detection Monthly Report",
    weeklyTrends: data,
    regionalPerformance: barData,
    incidentDetails: drillDownData
  });

  return (
    <div className="max-w-6xl mx-auto p-8 pb-20">
      {/* Header */}
      <div className="bg-brand-blue text-white rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">Fraud Detection — Monthly Report</h1>
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

      {/* Grid Layout for Charts */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        
        {/* Chart 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-6">Flagged vs Resolved Transactions (Aug)</h2>
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
                <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Process Performance by Region</h2>
          <p className="text-xs text-brand-blue mb-4">Click a region bar to drill down into localized incidents</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <RechartsTooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar 
                  dataKey="performance" 
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
            <h2 className="text-lg font-bold text-gray-800">Incident Drill-Down: {selectedRegion} Region</h2>
            <button onClick={() => setSelectedRegion(null)} className="text-sm text-brand-blue hover:underline">Close</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Incident ID</th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount at Risk</th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentDrillDown.map((incident: any) => (
                  <tr key={incident.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 text-sm font-medium text-brand-blue">{incident.id}</td>
                    <td className="p-3 text-sm text-gray-700">{incident.type}</td>
                    <td className="p-3 text-sm text-gray-700">{incident.amount}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${incident.status === 'Blocked' ? 'bg-red-100 text-red-800' : 
                          incident.status === 'Escalated' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {incident.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Suggestion Block */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 flex gap-4 items-start">
            <div className="bg-white p-2 text-brand-blue rounded-full shadow-sm border border-blue-100">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">AI Improvement Suggestion</h3>
              {loadingSuggestion ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-3 h-3 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                  Analyzing patterns...
                </div>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">{aiSuggestion}</p>
              )}
            </div>
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
      <ChatWidget context={reportContext} title="Fraud Report Assistant" />
    </div>
  );
};

export default ReportView;
