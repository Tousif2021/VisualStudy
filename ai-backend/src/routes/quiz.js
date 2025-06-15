const express = require('express');
const router = express.Router();
const path = require('path');

// Try to import generateQuiz and handle if missing
let generateQuiz;
try {
  const lib = require('../../lib/generateQuiz');
  generateQuiz = lib.generateQuiz || lib;
  if (!generateQuiz) {
    throw new Error('generateQuiz not found in module');
  }
  console.log('[quiz.js] generateQuiz loaded!');
} catch (err) {
  console.error('[quiz.js] Failed to load generateQuiz:', err.message);
}

// Health check
router.get('/ping', (req, res) => {
  res.json({ status: 'quiz route is alive' });
});

// POST /api/quiz/generate
router.post('/generate', async (req, res) => {
  console.log('===== /api/quiz/generate called =====');
  console.log('Request body:', req.body);

  const { content } = req.body;

  // Validate content
  if (!content || typeof content !== 'string' || content.trim().length < 50) {
    console.log('[quiz.js] Content validation failed:', {
      hasContent: !!content,
      type: typeof content,
      length: content?.length
    });
    return res.status(400).json({
      error: 'Document content is too short or missing. Need at least 50 characters.'
    });
  }

  // Debug: show content sample
  console.log('[quiz.js] Content length:', content.length, 'Sample:', content.slice(0, 80) + '...');

  // Try main generateQuiz, fallback to dummy quiz if broken
  if (!generateQuiz) {
    console.log('[quiz.js] generateQuiz not available, using dummy quiz!');
    return res.json({
      quiz: [
        {
          type: "mcq",
          question: "What is the capital of Sweden?",
          options: ["Stockholm", "Gothenburg", "Malmo"],
          answer: "Stockholm"
        }
      ]
    });
  }

  try {
    const quiz = await generateQuiz(content);

    if (!Array.isArray(quiz) || quiz.length === 0) {
      console.log('[quiz.js] No quiz generated, using dummy fallback.');
      return res.json({
        quiz: [
          {
            type: "mcq",
            question: "What is the capital of Sweden?",
            options: ["Stockholm", "Gothenburg", "Malmo"],
            answer: "Stockholm"
          }
        ]
      });
    }

    console.log(`[quiz.js] Quiz generated! Questions: ${quiz.length}`);
    res.json({ quiz });

  } catch (err) {
    console.error('[quiz.js] Quiz generation error:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate quiz',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;
