const express = require('express');
const router = express.Router();
const multer = require('multer');
const { extractTextFromPDF } = require('../../lib/pdf');
const { generateQuiz } = require('../../lib/generateQuiz');

const upload = multer({ dest: 'uploads/' });

// Temporary ping route for debugging
router.get('/ping', (req, res) => {
  res.json({ status: 'quiz route is alive' });
});

router.post('/generate', async (req, res) => {
  try {
    let content = req.body.content;

    if (!content || content.trim().length < 50) {
      return res.status(400).json({ error: 'Document/content too short or missing.' });
    }

    const quiz = await generateQuiz(content);
    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;