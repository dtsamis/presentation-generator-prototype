import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import pptxgen from 'pptxgenjs';
import { Download } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';

const performanceData = [
  { name: 'Jan', revenue: 4000, target: 2400 },
  { name: 'Feb', revenue: 3000, target: 1398 },
  { name: 'Mar', revenue: 2000, target: 9800 },
  { name: 'Apr', revenue: 2780, target: 3908 },
  { name: 'May', revenue: 1890, target: 4800 },
  { name: 'Jun', revenue: 2390, target: 3800 },
  { name: 'Jul', revenue: 3490, target: 4300 },
];

const metricData = [
  { name: 'Q1', growth: 85, attrition: 15 },
  { name: 'Q2', growth: 72, attrition: 18 },
  { name: 'Q3', growth: 90, attrition: 10 },
  { name: 'Q4', growth: 65, attrition: 22 },
];

const GeneralReportView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  const sources: string[] = location.state?.sources || ['performance_metrics_q3.xlsx'];

  const exportToPPT = () => {
    setIsExporting(true);
    let pres = new pptxgen();
    
    // Slide 1: Title
    let slide1 = pres.addSlide();
    slide1.addText("General Performance Report", {
      x: 0.5, y: 0.5, w: '90%', h: 0.8,
      fontSize: 24, bold: true, color: '1E293B'
    });
    
    pres.writeFile({ fileName: "General_Performance_Report.pptx" })
      .then(() => setIsExporting(false))
      .catch((e) => {
        console.error(e);
        setIsExporting(false);
      });
  };

  // Prepare context data for the ChatWidget
  const reportContext = JSON.stringify({
    reportType: "General Performance Report",
    timeline: performanceData,
    quarterlyMetrics: metricData
  });

  return (
    <div className="max-w-6xl mx-auto p-8 pb-20">
      {/* Header */}
      <div className="bg-indigo-900 text-white rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">General Performance Report</h1>
            <p className="text-sm text-indigo-200 mb-4">Operations & Strategy · YTD 2026</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-indigo-800 hover:bg-indigo-700 border border-indigo-600 px-4 py-2 rounded transition text-sm font-medium"
            >
              Back to Home
            </button>
            <button 
              onClick={exportToPPT}
              disabled={isExporting}
              className="flex items-center gap-2 bg-white text-indigo-900 hover:bg-gray-100 px-4 py-2 rounded transition text-sm font-medium shadow-sm"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin"></div>
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

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
           <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">YTD Revenue</p>
           <h3 className="text-3xl font-bold text-gray-800">$14.2M</h3>
           <p className="text-xs text-green-600 font-medium mt-2">+12% vs last year</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
           <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Active Users</p>
           <h3 className="text-3xl font-bold text-gray-800">124,500</h3>
           <p className="text-xs text-green-600 font-medium mt-2">+4% vs last quarter</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
           <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Avg Conversion</p>
           <h3 className="text-3xl font-bold text-gray-800">4.2%</h3>
           <p className="text-xs text-red-500 font-medium mt-2">-0.5% vs last month</p>
        </div>
      </div>

      {/* Grid Layout for Charts */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        
        {/* Chart 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-6">Revenue vs Target (YTD)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fill="#EEF2FF" strokeWidth={3} />
                <Area type="monotone" dataKey="target" stroke="#9CA3AF" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-6">Quarterly Growth vs Attrition</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <RechartsTooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="growth" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attrition" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget context={reportContext} title="General Report Assistant" />
    </div>
  );
};

export default GeneralReportView;
