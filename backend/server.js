const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize OpenRouter client (OpenAI-compatible API)
const OPENROUTER_MODEL = 'openai/gpt-4o-mini';
let ai;
if (process.env.OPENROUTER_API_KEY) {
  ai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  });
  console.log('OpenRouter API key loaded successfully. Using model: ' + OPENROUTER_MODEL);
} else {
  console.warn('WARNING: OPENROUTER_API_KEY is not set in backend/.env');
}

// Mock API endpoints for dashboard data
app.get('/api/kpis', (req, res) => {
  res.json({ runs: 24, scanned: 1204, flagged: 3, activeUsers: 18, approvedModels: 3 });
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
    return res.json({ reply: 'System: OPENROUTER_API_KEY is not set.' });
  }

  // Default framing is intentionally domain-agnostic: this app can receive
  // ANY kind of business data (marketing, financial, HR, sales, operations,
  // risk, customer feedback, etc.), so the assistant should act as a
  // knowledgeable business report author for whatever domain the data
  // actually represents - not a generic "data processor".
  const systemInstruction = customSystemInstruction || 'You are an expert business report author. Read the data/context you are given, determine what business domain it actually represents, and respond with clear, insightful, decision-ready analysis tailored to that specific domain.';

  let attempt = 0;
  const maxAttempts = 3;
  while (attempt < maxAttempts) {
    try {
      const completion = await ai.chat.completions.create({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userMsg }
        ]
      });
      const reply = completion.choices?.[0]?.message?.content || '';
      return res.json({ reply });
    } catch (error) {
      const status = error?.status || error?.response?.status;
      if (status === 429 && attempt < maxAttempts - 1) {
        attempt++;
        console.warn('Rate limit hit (429). Retrying attempt ' + attempt + '... waiting 25 seconds.');
        await new Promise(resolve => setTimeout(resolve, 25000));
      } else if (status === 429) {
        console.error('Rate limit completely exhausted:', error);
        return res.status(429).json({ reply: 'API Quota Exceeded. Please wait 1 minute before trying again.' });
      } else {
        console.error('LLM Generation Error:', error);
        return res.status(500).json({ reply: 'Sorry, I encountered an error communicating with the LLM.' });
      }
    }
  }
});

app.listen(port, () => {
  console.log('Backend listening on port ' + port);
});
