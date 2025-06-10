const express = require('express');
const summarizeRoute = require('./src/routes/summarize');

const app = express();
app.use(express.json());
app.use('/api/summarize', summarizeRoute);

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  console.log('Received question:', question);

  if (!question) {
    return res.status(400).json({ error: 'No question provided' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: question }
          ]
        }
      ]
    };

    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Better parsing for Gemini response:
    const answer = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer found';

    res.json({ answer });

  } catch (error) {
    console.error('Error calling Gemini AI:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AI backend server running on port ${PORT}`);
});
