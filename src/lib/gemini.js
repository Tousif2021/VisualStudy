const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) throw new Error('Gemini API key not set!');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

module.exports = genAI;
