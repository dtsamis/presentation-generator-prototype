// generate_summary_ppt.cjs
// Generates a summary PowerPoint deck describing the AI Presentation Generator app.
// Run with: node generate_summary_ppt.cjs

const pptxgen = require('pptxgenjs');

const pres = new pptxgen();
pres.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
pres.layout = 'WIDE';

const COLORS = {
  navy: '1E293B',
  blue: '2563EB',
  slate: '64748B',
  lightBg: 'F8FAFC',
  indigo: '4F46E5',
  green: '10B981',
  red: 'EF4444',
  orange: 'F59E0B',
  white: 'FFFFFF',
};

function addFooter(slide, pageNum) {
  slide.addText('AI Presentation Generator — Project Summary', {
    x: 0.4, y: 7.1, w: 8, h: 0.3, fontSize: 9, color: '94A3B8',
  });
  slide.addText(String(pageNum), {
    x: 12.7, y: 7.1, w: 0.4, h: 0.3, fontSize: 9, color: '94A3B8', align: 'right',
  });
}

// ---------- Slide 1: Title ----------
let s1 = pres.addSlide();
s1.background = { color: COLORS.navy };
s1.addText('AI Presentation Generator', {
  x: 0.7, y: 2.5, w: 12, h: 1.2, fontSize: 44, bold: true, color: COLORS.white, align: 'left',
});
s1.addText('Turning raw business data into interactive dashboards & investor-ready decks — powered by Gemini AI', {
  x: 0.7, y: 3.7, w: 11, h: 0.8, fontSize: 18, color: 'CBD5E1', align: 'left',
});
s1.addText('React + Vite  •  Express Backend  •  Google Gemini  •  PptxGenJS Export', {
  x: 0.7, y: 6.4, w: 11, h: 0.5, fontSize: 13, color: '60A5FA', align: 'left', italic: true,
});

// ---------- Slide 2: What the App Does ----------
let s2 = pres.addSlide();
s2.background = { color: COLORS.lightBg };
s2.addText('What the App Does', { x: 0.5, y: 0.4, w: 12, fontSize: 28, bold: true, color: COLORS.navy });
s2.addText(
  'The AI Presentation Generator lets business users upload raw datasets (CSV, XLSX, JSON) and instantly ' +
  'receive a polished, interactive report — complete with KPIs, charts, AI-generated insights, and a ' +
  'one-click PowerPoint export. A built-in AI chat assistant lets users ask follow-up questions about their own data.',
  { x: 0.5, y: 1.2, w: 12, h: 1.3, fontSize: 16, color: '334155', lineSpacingMultiple: 1.3 }
);

const steps = [
  ['1', 'Upload Data', 'User uploads CSV/XLSX/JSON files and optional analysis instructions.'],
  ['2', 'AI Titles the Report', 'Gemini inspects a data sample and generates a concise report title.'],
  ['3', 'Dynamic Dashboard', 'Gemini returns structured JSON (KPIs, charts, insights) rendered live with Recharts.'],
  ['4', 'Chat & Export', 'Users chat with an AI assistant about the report, then export to PPTX in one click.'],
];

let x = 0.5;
steps.forEach((step) => {
  s2.addShape('roundRect', { x, y: 3.0, w: 2.9, h: 2.9, fill: { color: COLORS.white }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.12 });
  s2.addText(step[0], { x, y: 3.2, w: 2.9, h: 0.6, fontSize: 26, bold: true, color: COLORS.blue, align: 'center' });
  s2.addText(step[1], { x: x + 0.15, y: 3.9, w: 2.6, h: 0.5, fontSize: 14, bold: true, color: COLORS.navy, align: 'center' });
  s2.addText(step[2], { x: x + 0.15, y: 4.4, w: 2.6, h: 1.3, fontSize: 11, color: '64748B', align: 'center' });
  x += 3.1;
});
addFooter(s2, 2);

// ---------- Slide 3: Report Templates ----------
let s3 = pres.addSlide();
s3.background = { color: COLORS.white };
s3.addText('Three Report Templates', { x: 0.5, y: 0.4, w: 12, fontSize: 28, bold: true, color: COLORS.navy });

const templates = [
  {
    title: 'General Report',
    color: COLORS.blue,
    desc: 'Standard metrics & performance visualization for generic datasets. AI dynamically generates KPIs, a trend line chart, a category bar chart, and narrative insights from the uploaded file.',
  },
  {
    title: 'Transactions Analysis',
    color: COLORS.indigo,
    desc: 'Analyzes transaction anomalies, weekly flagged-vs-trusted trends, and regional trust scores. Drill down by region into customer-level anomaly tables (segment, trust level, amount at risk, status).',
  },
  {
    title: 'Risk Analysis',
    color: COLORS.red,
    desc: 'Interactive risk matrix (Cyber, Operational, Regulatory, IT) with click-to-drill-down case details, approve/reject workflows, and an AI-generated mitigation strategy per risk category.',
  },
];

let ty = 1.3;
templates.forEach((t) => {
  s3.addShape('rect', { x: 0.5, y: ty, w: 0.12, h: 1.6, fill: { color: t.color } });
  s3.addText(t.title, { x: 0.85, y: ty, w: 11.5, h: 0.4, fontSize: 18, bold: true, color: COLORS.navy });
  s3.addText(t.desc, { x: 0.85, y: ty + 0.45, w: 11.5, h: 1.1, fontSize: 13, color: '475569', lineSpacingMultiple: 1.25 });
  ty += 1.85;
});
addFooter(s3, 3);

// ---------- Slide 4: Architecture ----------
let s4 = pres.addSlide();
s4.background = { color: COLORS.lightBg };
s4.addText('System Architecture', { x: 0.5, y: 0.4, w: 12, fontSize: 28, bold: true, color: COLORS.navy });

// Frontend box
s4.addShape('roundRect', { x: 0.7, y: 1.4, w: 5.3, h: 4.6, fill: { color: COLORS.white }, line: { color: COLORS.blue, width: 2 }, rectRadius: 0.1 });
s4.addText('Frontend — ui-prototype', { x: 1.0, y: 1.6, w: 4.8, h: 0.5, fontSize: 16, bold: true, color: COLORS.blue });
s4.addText([
  { text: 'React 19 + TypeScript + Vite', options: { bullet: true } },
  { text: 'React Router (Home, General, Transactions, Risk views)', options: { bullet: true } },
  { text: 'Tailwind CSS UI styling', options: { bullet: true } },
  { text: 'Recharts for live dashboard visualizations', options: { bullet: true } },
  { text: 'xlsx for parsing uploaded spreadsheets client-side', options: { bullet: true } },
  { text: 'pptxgenjs for one-click PPTX export', options: { bullet: true } },
  { text: 'Floating ChatWidget calling backend /api/chat', options: { bullet: true } },
], { x: 1.0, y: 2.15, w: 4.8, h: 3.6, fontSize: 12.5, color: '334155', lineSpacingMultiple: 1.3 });

// Backend box
s4.addShape('roundRect', { x: 6.3, y: 1.4, w: 5.3, h: 4.6, fill: { color: COLORS.white }, line: { color: COLORS.indigo, width: 2 }, rectRadius: 0.1 });
s4.addText('Backend — backend/', { x: 6.6, y: 1.6, w: 4.8, h: 0.5, fontSize: 16, bold: true, color: COLORS.indigo });
s4.addText([
  { text: 'Node.js + Express server (port 3001)', options: { bullet: true } },
  { text: 'Google Gemini via @google/genai SDK', options: { bullet: true } },
  { text: 'GET /api/kpis — mock dashboard KPIs', options: { bullet: true } },
  { text: 'GET /api/flagged — mock flagged-case data', options: { bullet: true } },
  { text: 'POST /api/chat — live LLM chat + report/JSON generation', options: { bullet: true } },
  { text: 'Automatic retry on 429 rate-limit responses', options: { bullet: true } },
  { text: 'CORS enabled for local frontend dev', options: { bullet: true } },
], { x: 6.6, y: 2.15, w: 4.8, h: 3.6, fontSize: 12.5, color: '334155', lineSpacingMultiple: 1.3 });

// Arrow
s4.addShape('rightArrow', { x: 5.95, y: 3.4, w: 0.4, h: 0.4, fill: { color: COLORS.slate } });
addFooter(s4, 4);

// ---------- Slide 5: AI-Powered Data Flow ----------
let s5 = pres.addSlide();
s5.background = { color: COLORS.white };
s5.addText('AI-Powered Data Flow', { x: 0.5, y: 0.4, w: 12, fontSize: 28, bold: true, color: COLORS.navy });
s5.addText(
  'Uploaded file data is sampled client-side and sent to the backend, which prompts Gemini to return a title and, ' +
  'for the General Report, a strict JSON schema (KPIs, two charts, and narrative insights) rendered live in the dashboard.',
  { x: 0.5, y: 1.15, w: 12, h: 0.8, fontSize: 14, color: '475569', lineSpacingMultiple: 1.25 }
);

const flow = ['File Upload (CSV/XLSX/JSON)', 'Sample Extracted Client-Side', 'Gemini Generates Report Title', 'Gemini Generates Dashboard JSON', 'Recharts Renders Live Dashboard', 'Chat Assistant + PPTX Export'];
let fx = 0.5;
const fw = 2.0;
flow.forEach((label, i) => {
  s5.addShape('roundRect', { x: fx, y: 2.6, w: fw, h: 1.5, fill: { color: i % 2 === 0 ? COLORS.blue : COLORS.indigo }, rectRadius: 0.1 });
  s5.addText(label, { x: fx + 0.05, y: 2.65, w: fw - 0.1, h: 1.4, fontSize: 11, bold: true, color: COLORS.white, align: 'center', valign: 'middle' });
  if (i < flow.length - 1) {
    s5.addShape('rightArrow', { x: fx + fw + 0.02, y: 3.2, w: 0.3, h: 0.3, fill: { color: COLORS.slate } });
  }
  fx += fw + 0.35;
});

s5.addText('Powered by model: gemini-3.6-flash  •  Endpoint: POST /api/chat  •  Automatic 429 retry with backoff', {
  x: 0.5, y: 4.6, w: 12, h: 0.4, fontSize: 12, italic: true, color: COLORS.slate,
});
addFooter(s5, 5);

// ---------- Slide 6: Key Features ----------
let s6 = pres.addSlide();
s6.background = { color: COLORS.lightBg };
s6.addText('Key Features', { x: 0.5, y: 0.4, w: 12, fontSize: 28, bold: true, color: COLORS.navy });

const features = [
  ['📊', 'Dynamic Dashboards', 'AI-generated KPIs and charts tailored to the uploaded dataset — no hardcoded templates.'],
  ['🖱️', 'Interactive Drill-Downs', 'Click chart segments (pie slices, bars) to reveal case-level detail tables.'],
  ['✅', 'Approval Workflows', 'Risk items can be approved/rejected inline, tracked with visual status badges.'],
  ['🤖', 'Context-Aware Chat', 'Floating assistant answers questions using the exact report data as context.'],
  ['📥', 'One-Click PPTX Export', 'Every report can be exported to a branded PowerPoint deck via pptxgenjs.'],
  ['🕘', 'Report History', 'Sidebar tracks previously generated reports for quick re-access.'],
];

let col = 0, row = 0;
const fcW = 3.9, fcH = 1.8, gapX = 0.15, gapY = 0.25;
features.forEach((f) => {
  const fx2 = 0.5 + col * (fcW + gapX);
  const fy2 = 1.3 + row * (fcH + gapY);
  s6.addShape('roundRect', { x: fx2, y: fy2, w: fcW, h: fcH, fill: { color: COLORS.white }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.08 });
  s6.addText(f[0], { x: fx2 + 0.2, y: fy2 + 0.15, w: 0.7, h: 0.6, fontSize: 26 });
  s6.addText(f[1], { x: fx2 + 0.2, y: fy2 + 0.75, w: fcW - 0.4, h: 0.35, fontSize: 14, bold: true, color: COLORS.navy });
  s6.addText(f[2], { x: fx2 + 0.2, y: fy2 + 1.1, w: fcW - 0.4, h: 0.6, fontSize: 10.5, color: '64748B', lineSpacingMultiple: 1.2 });
  col++;
  if (col > 2) { col = 0; row++; }
});
addFooter(s6, 6);

// ---------- Slide 7: Tech Stack ----------
let s7 = pres.addSlide();
s7.background = { color: COLORS.white };
s7.addText('Technology Stack', { x: 0.5, y: 0.4, w: 12, fontSize: 28, bold: true, color: COLORS.navy });

const stackCols = [
  { header: 'Frontend', color: COLORS.blue, items: ['React 19', 'TypeScript', 'Vite 8', 'React Router 7', 'Tailwind CSS', 'Recharts', 'lucide-react (icons)', 'xlsx (file parsing)', 'pptxgenjs (export)'] },
  { header: 'Backend', color: COLORS.indigo, items: ['Node.js', 'Express 5', '@google/genai (Gemini)', 'openai (SDK available)', 'dotenv', 'cors'] },
  { header: 'Data & Sample Assets', color: COLORS.green, items: ['CSV / XLSX mock datasets', 'Risk matrices', 'Incident reports', 'Customer feedback data', 'Fraud transaction samples'] },
];

let scx = 0.5;
stackCols.forEach((c) => {
  s7.addShape('roundRect', { x: scx, y: 1.3, w: 4.0, h: 5.4, fill: { color: COLORS.lightBg }, line: { color: c.color, width: 1.5 }, rectRadius: 0.08 });
  s7.addText(c.header, { x: scx + 0.25, y: 1.5, w: 3.5, h: 0.5, fontSize: 16, bold: true, color: c.color });
  s7.addText(c.items.map((it) => ({ text: it, options: { bullet: true } })), { x: scx + 0.25, y: 2.1, w: 3.5, h: 4.4, fontSize: 12.5, color: '334155', lineSpacingMultiple: 1.35 });
  scx += 4.2;
});
addFooter(s7, 7);

// ---------- Slide 8: Closing / Value Prop ----------
let s8 = pres.addSlide();
s8.background = { color: COLORS.navy };
s8.addText('Why It Matters', { x: 0.7, y: 0.6, w: 11, fontSize: 30, bold: true, color: COLORS.white });
s8.addText([
  { text: 'Turns raw spreadsheets into decision-ready insights in minutes, not hours.', options: { bullet: true, color: 'E2E8F0' } },
  { text: 'Removes manual chart-building and PowerPoint formatting work for analysts.', options: { bullet: true, color: 'E2E8F0' } },
  { text: 'Keeps humans in the loop via drill-downs, approvals, and a contextual AI assistant.', options: { bullet: true, color: 'E2E8F0' } },
  { text: 'Modular report templates (General, Transactions, Risk) adapt to different business domains.', options: { bullet: true, color: 'E2E8F0' } },
], { x: 0.7, y: 1.6, w: 11.5, h: 2.8, fontSize: 17, lineSpacingMultiple: 1.5 });

s8.addText('Currently running locally: Backend on :3001  •  Frontend (Vite) on :5173', {
  x: 0.7, y: 6.3, w: 11.5, h: 0.5, fontSize: 13, color: '60A5FA', italic: true,
});
addFooter(s8, 8);

pres.writeFile({ fileName: 'AI_Presentation_Generator_Summary.pptx' })
  .then(() => console.log('✅ Presentation created: AI_Presentation_Generator_Summary.pptx'))
  .catch((err) => {
    console.error('Failed to generate presentation:', err);
    process.exit(1);
  });
