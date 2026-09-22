const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
ai.models.generateContent({ model: 'gemini-1.5-pro', contents: 'test' }).then(r => console.log('PRO WORKS')).catch(console.error);
