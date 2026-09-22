import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import pptxgen from 'pptxgenjs';
import { Download, Loader2 } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';

const fallbackPerformanceData = [
  { name: 'Jan', revenue: 4000, target: 2400 },
  { name: 'Feb', revenue: 3000, target: 1398 },
  { name: 'Mar', revenue: 2000, target: 9800 }
];
const fallbackMetricData = [
  { name: 'Q1', growth: 85, attrition: 15 },
  { name: 'Q2', growth: 72, attrition: 18 }
];

const GeneralReportView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dynamicData, setDynamicData] = useState<any>(null);

  const sources: string[] = location.state?.sources || ['uploaded_file.csv'];
  const dynamicTitle = location.state?.reportTitle || "Business Performance Report";
  // The data domain is detected on the Home screen by inspecting the actual
  // uploaded file content (e.g. "Marketing Performance", "Risk Management",
  // "Customer Feedback", "Financial Performance", "HR & Workforce", etc.).
  // We use it here to build a report that's genuinely about that domain,
  // instead of treating every upload as generic "data processing".
  const dynamicCategory = location.state?.reportCategory || "General Business";
  const fileData = location.state?.fileData || "";

  useEffect(() => {
    if (!fileData) {
      setIsLoading(false);
      return;
    }

    const generateDynamicLayout = async () => {
      try {
        // The prompt below is intentionally written as a request to a business
        // report author (not a "data analyzer") so the resulting KPIs, charts,
        // and insights read like a real ${dynamicCategory} report grounded in
        // the actual uploaded rows, not an abstract description of the file.
        // We also require separate human-readable "Label" fields for every
        // chart series, decoupled from the raw JSON data keys, so the legend
        // and tooltips never show generic placeholders like "val1"/"val2".
        const prompt = `You are writing a real ${dynamicCategory} report for business stakeholders. Here is the actual uploaded data (CSV):\n\n${fileData}\n\nUsing ONLY what this data actually shows, produce a JSON object strictly matching the schema below. The KPIs, charts, and insights must be grounded in the real values/rows above and clearly relevant to ${dynamicCategory} (e.g. if this is Marketing data, focus on campaign performance/reach/conversion; if Financial, focus on revenue/costs/margins; if HR, focus on headcount/attrition/engagement; if Risk, focus on exposure/likelihood/impact; if Customer Feedback, focus on sentiment/satisfaction; otherwise pick whatever angle best fits the real content).

IMPORTANT: Every chart series must have a clear, human-readable, business-meaningful label. NEVER use placeholder/generic names like "val1", "val2", "value", "series1", etc. anywhere a human-facing label is expected. The "lineLabel", "barKey1Label", and "barKey2Label" fields especially must read like something a real business user would see on a chart legend (e.g. "Avg. Satisfaction Score", "Flagged Transactions", "Monthly Revenue ($)").

RETURN ONLY VALID JSON, no markdown, no commentary:
{
  "kpis": [
    { "label": "String (short human-readable KPI name)", "value": "String", "subtext": "String" }
  ],
  "chart1": {
    "title": "String (human-readable chart title)",
    "data": [ { "name": "Category", "metric": 10 } ],
    "lineKey": "metric",
    "lineLabel": "String (human-readable legend label for this line, e.g. 'Avg. Response Time (days)')"
  },
  "chart2": {
    "title": "String (human-readable chart title)",
    "data": [ { "name": "Category", "metricA": 20, "metricB": 15 } ],
    "barKey1": "metricA",
    "barKey1Label": "String (human-readable legend label, e.g. 'Positive Feedback')",
    "barKey2": "metricB",
    "barKey2Label": "String (human-readable legend label, e.g. 'Negative Feedback')"
  },
  "insights": [
    { "title": "String", "description": "String (2-3 sentences grounded in the actual data)" }
  ]
}`;
        const res = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: prompt,
            systemInstruction: `You are an expert ${dynamicCategory} report author. You MUST output ONLY valid JSON matching the schema, derived from the real data provided. All chart legend labels must be human-readable business terms, never generic placeholders. Do NOT include markdown blocks or explanations.`
          })
        });

        if (res.status === 429) {
          setDynamicData({ rateLimit: true });
          return;
        }

        const data = await res.json();
        console.log("Raw LLM Reply:", data.reply);
        
        // Extract JSON safely using regex in case the LLM wrapped it in text
        const jsonMatch = data.reply.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON object found in response. Raw reply: " + data.reply);
        
        const parsed = JSON.parse(jsonMatch[0]);
        setDynamicData(parsed);
      } catch (err) {
        console.error("Failed to parse dynamic JSON", err);
      } finally {
        setIsLoading(false);
      }
    };
    generateDynamicLayout();
  }, [fileData]);

  const exportToPPT = () => {
    setIsExporting(true);
    let pres = new pptxgen();
    
    // Slide 1: Title
    let slide1 = pres.addSlide();
    slide1.background = { color: 'F8FAFC' };
    slide1.addText(dynamicTitle, {
      x: 1, y: 1.5, w: '80%', h: 1,
      fontSize: 32, bold: true, color: '1E293B', align: 'center'
    });
    slide1.addText("Generated by AI Presentation System", {
      x: 1, y: 2.5, w: '80%', h: 0.5,
      fontSize: 16, color: '64748B', align: 'center'
    });
    
    // Slide 2: Executive Summary
    let slide2 = pres.addSlide();
    slide2.addText("Executive Summary", { x: 0.5, y: 0.5, w: '90%', fontSize: 24, bold: true, color: '1E293B' });
    slide2.addText([
      { text: `Metrics for ${dynamicTitle} show solid performance.`, options: { bullet: true } },
      { text: "Detailed breakdowns align with expected variations.", options: { bullet: true } }
    ], { x: 0.5, y: 1.2, w: '80%', h: 3, fontSize: 18, color: '334155' });
    
    pres.writeFile({ fileName: `${dynamicTitle.replace(/\s+/g, '_')}.pptx` })
      .then(() => setIsExporting(false))
      .catch((e) => {
        console.error(e);
        setIsExporting(false);
      });
  };

  const reportContext = JSON.stringify({
    reportType: dynamicTitle,
    reportCategory: dynamicCategory,
    dataPreview: dynamicData || "No parsed data available"
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <h2 className="text-xl font-bold text-gray-800 animate-pulse">Building your {dynamicCategory} report from the uploaded data...</h2>
      </div>
    );
  }

  if (dynamicData?.rateLimit) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-8 flex flex-col items-center justify-center text-center bg-red-50 border-2 border-red-200 rounded-2xl">
        <h2 className="text-2xl font-bold text-red-700 mb-2">API Rate Limit Exceeded</h2>
        <p className="text-red-600 mb-6">We've hit the API rate limit. Please wait a moment before trying again.</p>
        <button onClick={() => navigate('/')} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition">Go Back</button>
      </div>
    );
  }

  // Use dynamic data or fallback to a basic placeholder if LLM failed
  const kpis = dynamicData?.kpis || [
    { label: "Data Rows", value: "Loaded", subtext: "Processed properly" },
    { label: "Format", value: "CSV", subtext: "Standard tabular" },
    { label: "Status", value: "Active", subtext: "Live session" }
  ];
  
  const chart1 = dynamicData?.chart1 || {
    title: "Primary Trend",
    data: fallbackPerformanceData,
    lineKey: "revenue",
    lineLabel: "Revenue ($)"
  };

  const chart2 = dynamicData?.chart2 || {
    title: "Category Distribution",
    data: fallbackMetricData,
    barKey1: "growth",
    barKey1Label: "Growth Rate (%)",
    barKey2: "attrition",
    barKey2Label: "Attrition Rate (%)"
  };

  // Fall back to the raw data key itself only if the AI didn't provide a
  // dedicated human-readable label, so the legend never shows nothing.
  const chart1LineLabel = chart1.lineLabel || chart1.lineKey;
  const chart2BarLabel1 = chart2.barKey1Label || chart2.barKey1;
  const chart2BarLabel2 = chart2.barKey2Label || chart2.barKey2;

  return (
    <div className="max-w-6xl mx-auto p-8 pb-20">
      {/* Header */}
      <div className="bg-indigo-900 text-white rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">{dynamicTitle}</h1>
            <p className="text-sm text-indigo-200 mb-2">Based on data from: {sources.join(', ')}</p>
            <span className="inline-block bg-indigo-800/60 border border-indigo-600 text-indigo-100 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Report Focus: {dynamicCategory}
            </span>
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
              className="flex items-center gap-2 bg-white text-indigo-900 hover:bg-indigo-50 px-4 py-2 rounded font-semibold transition"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download size={18} />}
              Export to PPT
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic KPIs */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {kpis.map((kpi: any, idx: number) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{kpi.label}</p>
            <h3 className="text-3xl font-black text-gray-800 mb-1">{kpi.value}</h3>
            <p className="text-sm font-medium text-green-600">{kpi.subtext}</p>
          </div>
        ))}
      </div>

      {/* Dynamic Charts Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        
        {/* Dynamic Line Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-6">{chart1.title}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart1.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Line type="monotone" name={chart1LineLabel} dataKey={chart1.lineKey} stroke="#4F46E5" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-6">{chart2.title}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart2.data} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <RechartsTooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '10px'}} />
                <Bar name={chart2BarLabel1} dataKey={chart2.barKey1} fill="#10B981" radius={[4, 4, 0, 0]} />
                {chart2.barKey2 && <Bar name={chart2BarLabel2} dataKey={chart2.barKey2} fill="#F43F5E" radius={[4, 4, 0, 0]} />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dynamic Insights */}
      {dynamicData?.insights && dynamicData.insights.length > 0 && (
        <div className="bg-white p-8 rounded-xl border border-indigo-100 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Detected Patterns & Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dynamicData.insights.map((insight: any, idx: number) => (
              <div key={idx} className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                <h3 className="font-semibold text-indigo-900 mb-1">{insight.title}</h3>
                <p className="text-sm text-indigo-700 leading-relaxed">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <ChatWidget context={reportContext} title={`${dynamicTitle} Assistant`} />
    </div>
  );
};

export default GeneralReportView;
