const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize Gemini client if API key is present
let ai;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log("Gemini API key loaded successfully.");
} else {
  console.warn("WARNING: GEMINI_API_KEY is not set in backend/.env");
}

// Mock API endpoints for dashboard data
app.get('/api/kpis', (req, res) => {
  res.json({
    runs: 24,
    scanned: 1204,
    flagged: 3,
    activeUsers: 18,
    approvedModels: 3
  });
});

app.get('/api/flagged', (req, res) => {
  res.json([
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
    }
  ]);
});

// Live LLM Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const userMsg = req.body.message;
  const customSystemInstruction = req.body.systemInstruction;
  
  if (!ai) {
    return res.json({ 
      reply: "⚠️ System: `GEMINI_API_KEY` is not set in the `backend/.env` file. Please add your key to enable the live LLM." 
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userMsg,
      config: {
        systemInstruction: customSystemInstruction || "You are a data analyzer. Base your reports and analysis entirely on the type of data provided.",
      }
    });
    
    res.json({ reply: response.text });
  } catch (error) {
    console.error("LLM Generation Error:", error);
    res.status(500).json({ reply: "Sorry, I encountered an error communicating with the LLM." });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
