console.log("Summarize route module loaded!");
//
const express = require('express');
const pdf = require('pdf-parse');
const fetch = require('node-fetch');
const genAI = require('../../lib/gemini').default || require('../../lib/gemini');
const router = express.Router();

async function fetchFileBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('File download failed');
  return await response.buffer();
}

router.post('/', async (req, res) => {
  //test:
  console.log("Summarize POST route hit!");
  try {
    const { documentUrl } = req.body;
    if (!documentUrl) return res.status(400).json({ error: 'No documentUrl provided' });

    const fileBuffer = await fetchFileBuffer(documentUrl);
    const data = await pdf(fileBuffer);
    let text = data.text;
    text = text.substring(0, 15000);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Summarize the following document for a student in less than 200 words. Use simple, clear language:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to summarize document.' });
  }
});

module.exports = router;
