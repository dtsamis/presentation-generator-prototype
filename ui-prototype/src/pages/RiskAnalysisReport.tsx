import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import pptxgen from 'pptxgenjs';
import { Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const riskData = [
  { name: 'Cyber', value: 3, color: '#EF4444' }, // Red
  { name: 'Operational', value: 5, color: '#F59E0B' }, // Orange
  { name: 'Regulatory', value: 2, color: '#3B82F6' }, // Blue
  { name: 'IT', value: 4, color: '#10B981' }, // Green
];

// Mock database mapping categories to specific risks for drill-down
const drillDownData: Record<string, any[]> = {
  Cyber: [
    { id: 'RSK-0015', name: 'Targeted Phishing (Payments)', likelihood: 'High', impact: 'High', owner: 'InfoSec', desc: 'Highly sophisticated phishing campaigns bypassing tier-1 email filters, specifically targeting staff with payment authorization limits.' },
    { id: 'RSK-0021', name: 'Ransomware threat via Vendor', likelihood: 'Med', impact: 'High', owner: 'InfoSec', desc: 'Recent breach at 3rd party vendor increases lateral movement risk.' },
    { id: 'RSK-0033', name: 'Unpatched VPN Gateway', likelihood: 'Low', impact: 'High', owner: 'NetSec', desc: 'Zero-day vulnerability announced; patching scheduled for this weekend.' }
  ],
  Operational: [
    { id: 'RSK-0009', name: 'Manual reconciliation risk (Automated)', likelihood: 'Low', impact: 'Med', owner: 'Retail', desc: 'Was manual, now successfully automated and closed.' },
    { id: 'RSK-0016', name: 'Vendor SLA breach risk', likelihood: 'Med', impact: 'Med', owner: 'Compliance', desc: 'Fraud detection service missing 99.9% uptime targets.' }
  ],
  Regulatory: [
    { id: 'RSK-0011', name: 'Reporting single-approver dependency', likelihood: 'Low', impact: 'High', owner: 'Compliance', desc: 'Mitigated by cross-training and dual-auth requirement.' },
    { id: 'RSK-0044', name: 'GDPR Data Subject Request backlog', likelihood: 'High', impact: 'Med', owner: 'Privacy', desc: 'Volume of requests exceeding 30-day SLA.' }
  ],
  IT: [
    { id: 'RSK-0017', name: 'Mobile App Failover Gap', likelihood: 'Med', impact: 'High', owner: 'Engineering', desc: 'Secondary active-active database cluster under-provisioned.' },
    { id: 'RSK-0050', name: 'Legacy Mainframe End-of-Life', likelihood: 'High', impact: 'High', owner: 'Architecture', desc: 'Hardware support expiring in 6 months, migration delayed.' }
  ]
};

const RiskAnalysisReport = () => {
  const location = useLocation();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [approvals, setApprovals] = useState<Record<string, 'approved' | 'rejected' | 'pending'>>({});

  const sources: string[] = location.state?.sources || ['risk_matrix.csv'];

  const handlePieClick = (data: any) => {
    setSelectedCategory(selectedCategory === data.name ? null : data.name);
  };

  const handleApproval = (id: string, status: 'approved' | 'rejected') => {
    setApprovals(prev => ({ ...prev, [id]: status }));
  };

  const exportToPPT = () => {
    setIsExporting(true);
    let pres = new pptxgen();
    
    // Slide 1: Title
    let slide1 = pres.addSlide();
    slide1.addText("Enterprise Risk Analysis — Q3 2026", {
      x: 0.5, y: 0.5, w: '90%', h: 0.8,
      fontSize: 24, bold: true, color: '1E293B'
    });
    slide1.addText(`Generated from system data (${riskData.length} categories tracked)`, {
      x: 0.5, y: 1.2, w: '90%', h: 0.4,
      fontSize: 12, color: '64748B'
    });

    // Extract critical risks dynamically from the data structure
    const allRisks = Object.values(drillDownData).flat();
    const criticalRisks = allRisks.filter(r => r.impact === 'High' || r.likelihood === 'High');

    // Slide 2: Critical Risks Data
    let slide2 = pres.addSlide();
    slide2.addText("Critical Open Risks (High Impact/Likelihood)", {
      x: 0.5, y: 0.5, w: '90%', h: 0.6, fontSize: 18, bold: true, color: '991B1B'
    });

    const criticalBullets = criticalRisks.flatMap(r => [
      { text: `[${r.id}] ${r.name} - Likelihood: ${r.likelihood}, Impact: ${r.impact}`, options: { bullet: true, color: '7F1D1D', bold: true } },
      { text: `Owner: ${r.owner} | ${r.desc}`, options: { indentLevel: 1, color: '7F1D1D' } }
    ]);
    
    slide2.addText(criticalBullets, { x: 0.5, y: 1.5, w: '90%', h: 3, fontSize: 11 });
    
    // Add Chart for Category breakdown
    const chartData = [
      {
        name: "Risks",
        labels: riskData.map(d => d.name),
        values: riskData.map(d => d.value)
      }
    ];
    
    slide2.addChart(pres.ChartType.bar, chartData, { x: 0.5, y: 3.5, w: 6, h: 2, showLegend: true });

    // Footer
    slide2.addText("Compliance-checked automatically.", {
      x: 0.5, y: 5.2, w: '90%', h: 0.3, fontSize: 9, color: '94A3B8'
    });

    // Save
    pres.writeFile({ fileName: "Dynamic_Risk_Analysis_Report.pptx" })
      .then(() => setIsExporting(false))
      .catch((e) => {
        console.error(e);
        setIsExporting(false);
      });
  };

  const currentDrillDown = selectedCategory ? drillDownData[selectedCategory] : [];

  return (
    <div className="max-w-6xl mx-auto p-8 pb-20">
      {/* Header */}
      <div className="bg-slate-800 text-white rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">Enterprise Risk Analysis — Q3 2026</h1>
            <p className="text-sm text-slate-300 mb-3">InfoSec & Compliance · September 2026 · Scheduled report</p>
          </div>
          <button 
            onClick={exportToPPT}
            disabled={isExporting}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 border border-slate-500 px-4 py-2 rounded transition text-sm font-medium"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download size={16} />
            )}
            {isExporting ? 'Generating PPT...' : 'Export to PPT'}
          </button>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 inline-block mt-2 border border-slate-600">
          <p className="text-xs font-medium text-white flex items-center gap-2">
            <span className="uppercase tracking-wider text-slate-400">Source Data:</span>
            {sources.map(src => (
              <span key={src} className="bg-slate-800 px-2 py-1 rounded border border-slate-600">{src}</span>
            ))}
          </p>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="p-8 grid grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <div className="col-span-1 border-r border-gray-100 pr-8">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Open Risks by Category</h2>
            <p className="text-xs text-brand-blue mb-4">Click a slice to drill down into underlying data</p>
            <div className="h-48 relative cursor-pointer">
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
                    onClick={handlePieClick}
                  >
                    {riskData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className="transition duration-300 hover:opacity-80"
                        stroke={selectedCategory === entry.name ? '#1E293B' : 'none'}
                        strokeWidth={selectedCategory === entry.name ? 3 : 0}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" onClick={handlePieClick} wrapperStyle={{ cursor: 'pointer' }} />
                </PieChart>
              </ResponsiveContainer>
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

    // Deep Dive Section - Dynamically renders based on pie chart clicks
      {selectedCategory && (
        <div className="bg-white rounded-xl border border-brand-blue shadow-lg p-8 mb-6 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedCategory} Risks Breakdown</h2>
              <p className="text-sm text-gray-500">Filtering underlying source data (risk_matrix.csv) for {selectedCategory} category. Needs review.</p>
            </div>
            <button onClick={() => setSelectedCategory(null)} className="text-sm text-brand-blue hover:underline">Close Layer</button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {currentDrillDown.map(item => {
              const status = approvals[item.id] || 'pending';
              return (
                <div key={item.id} className={`border rounded-lg p-5 transition ${
                  status === 'approved' ? 'border-green-300 bg-green-50/50' : 
                  status === 'rejected' ? 'border-red-300 bg-red-50/50' : 
                  'border-gray-200 bg-gray-50/50'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-1 rounded">{item.id}</span>
                    <span className="text-xs font-medium text-gray-500">Owner: {item.owner}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mt-2 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-700 mb-4">{item.desc}</p>
                  <div className="flex justify-between items-end">
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${item.likelihood === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>Likelihood: {item.likelihood}</span>
                      <span className={`text-xs px-2 py-1 rounded ${item.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>Impact: {item.impact}</span>
                    </div>
                    
                    {/* Inline Approval Controls */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApproval(item.id, 'approved')}
                        className={`text-xs px-3 py-1.5 rounded transition ${status === 'approved' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleApproval(item.id, 'rejected')}
                        className={`text-xs px-3 py-1.5 rounded transition ${status === 'rejected' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAnalysisReport;
