const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
ai.models.generateContent({ model: 'gemini-1.5-flash', contents: 'hello' }).then(r => console.log('1.5 works')).catch(console.error);

