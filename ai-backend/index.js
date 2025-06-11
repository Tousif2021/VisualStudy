require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000; // Changed to port 4000

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Log environment variables (remove in production)
console.log('Environment check:');
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_ANON_KEY);

// Routes
const summarizeRoute = require('./src/routes/summarize');
const documentsRoute = require('./src/routes/documents');

app.use('/api/summarize', summarizeRoute);
app.use('/api/documents', documentsRoute);

// Add AI chat route
app.post('/api/ask', async (req, res) => {
  try {
    const genAI = require('./lib/gemini');
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'No question provided' });
    }
    
    console.log('AI Chat question received:', question);
    
    // Use Gemini to answer the question
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a helpful AI study assistant. Answer the following question in a clear, educational manner:\n\n${question}`;
    
    const result = await model.generateContent(prompt);
    const answer = result.response.text();
    
    console.log('AI Chat response generated');
    res.json({ answer });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process your question. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY
    }
  });
});

app.listen(PORT, () => {
  console.log(`AI Backend server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});