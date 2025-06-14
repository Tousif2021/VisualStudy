const express = require('express');
const router = express.Router();
const { generateQuiz } = require('../../lib/generateQuiz');

// Temporary ping route for debugging
router.get('/ping', (req, res) => {
  res.json({ status: 'quiz route is alive' });
});

// Generate quiz from document content
router.post('/generate', async (req, res) => {
  console.log('Quiz generation request received');
  console.log('Request body:', req.body);
  
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length < 50) {
      console.log('Content validation failed:', { 
        hasContent: !!content, 
        type: typeof content, 
        length: content?.length 
      });
      return res.status(400).json({ 
        error: 'Document content is too short or missing. Need at least 50 characters.' 
      });
    }

    console.log('Generating quiz for content length:', content.length);
    const quiz = await generateQuiz(content);
    console.log('Quiz generated successfully, questions:', quiz.length);
    
    res.json({ quiz });
  } catch (err) {
    console.error('Quiz generation error:', err);
    res.status(500).json({ 
      error: err.message || 'Failed to generate quiz',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;