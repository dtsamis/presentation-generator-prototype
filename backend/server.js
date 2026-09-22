const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { OpenAI } = require('openai');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log('OpenAI API key loaded successfully.');

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
  
  let attempt = 0;
  const maxAttempts = 3;
  while (attempt < maxAttempts) {
    try {
      const response = await ai.chat.completions.create({
        model: 'gpt-4o', // using standard fast/capable model
        messages: [
            { role: 'system', content: customSystemInstruction || 'You are a data analyzer. Base your reports and analysis entirely on the type of data provided.' },
            { role: 'user', content: userMsg }
        ]
      });
      return res.json({ reply: response.choices[0].message.content });
    } catch (error) {
      if (error.status === 429 && attempt < maxAttempts - 1) {
        attempt++;
        console.warn('Rate limit hit (429). Retrying attempt ' + attempt + '... waiting 5 seconds.');
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else if (error.status === 429) {
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

