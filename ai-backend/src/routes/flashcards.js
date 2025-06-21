console.log('### flashcards.js loaded from', __filename);

const express = require('express');
const router = express.Router();

// Health check for this route
router.get('/ping', (req, res) => {
  res.json({ status: 'flashcards route is alive' });
});

// POST /api/flashcards/generate
router.post('/generate', async (req, res) => {
  try {
    console.log('Received flashcard generation request:', req.body);
    const { content, topic } = req.body;

    // Validate input
    if (!content && !topic) {
      return res.status(400).json({
        error: 'Either content or topic is required for flashcard generation.',
      });
    }

    if (content && content.trim().length < 30 && !topic) {
      return res.status(400).json({
        error: 'Content is too short for flashcard generation. Need at least 30 characters.',
      });
    }

    // Import Gemini AI
    const genAI = require('../../lib/gemini');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt;
    if (content) {
      // Generate flashcards from provided content
      prompt = `
Create 8-10 educational flashcards based on the following content. Each flashcard should have a clear question/concept on the front and a comprehensive answer on the back.

IMPORTANT: Respond with ONLY a valid JSON array. No additional text, explanations, or formatting.

Format for each flashcard:
{
  "front": "Clear, concise question or concept",
  "back": "Comprehensive explanation or answer"
}

Requirements:
- Create 8-10 flashcards total
- Mix of factual, conceptual, and application-based questions
- Front should be concise (1-2 sentences max)
- Back should be comprehensive but clear (2-4 sentences)
- Cover the most important concepts from the content
- Ensure accuracy and educational value

CONTENT TO ANALYZE:
"""${content.substring(0, 8000)}"""

Respond with only the JSON array:
`;
    } else {
      // Generate flashcards from topic
      prompt = `
Create 8-10 educational flashcards about the topic: "${topic}"

IMPORTANT: Respond with ONLY a valid JSON array. No additional text, explanations, or formatting.

Format for each flashcard:
{
  "front": "Clear, concise question or concept",
  "back": "Comprehensive explanation or answer"
}

Requirements:
- Create 8-10 flashcards total
- Cover fundamental concepts, definitions, and applications
- Mix of factual, conceptual, and application-based questions
- Front should be concise (1-2 sentences max)
- Back should be comprehensive but clear (2-4 sentences)
- Ensure accuracy and educational value
- Cover different aspects of the topic

Respond with only the JSON array:
`;
    }

    console.log('Generating flashcards with Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    console.log('Raw AI response:', text.substring(0, 200) + '...');

    // Clean up the response
    text = text.trim()
      .replace(/```json\s*/g, '')
      .replace(/```/g, '');

    // Find JSON array bounds
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');

    if (start === -1 || end === -1) {
      console.error('No JSON array found in AI response');
      throw new Error('No JSON array found in AI response');
    }

    const flashcardsJSON = text.slice(start, end + 1);
    console.log('Extracted JSON:', flashcardsJSON.substring(0, 200) + '...');

    // Parse and validate JSON
    let parsedFlashcards;
    try {
      parsedFlashcards = JSON.parse(flashcardsJSON);
    } catch (error) {
      console.error('JSON parse error:', error);
      throw new Error('Failed to parse AI response as JSON');
    }

    if (!Array.isArray(parsedFlashcards) || parsedFlashcards.length < 3) {
      console.error('Not enough valid flashcards returned');
      throw new Error('Not enough valid flashcards returned');
    }

    // Validate flashcard structure
    const validatedFlashcards = parsedFlashcards.filter(card =>
      card &&
      typeof card.front === 'string' &&
      typeof card.back === 'string' &&
      card.front.trim().length > 0 &&
      card.back.trim().length > 0
    );

    if (validatedFlashcards.length === 0) {
      console.error('No valid flashcards found in generated content');
      throw new Error('No valid flashcards found in generated content');
    }

    console.log(`Successfully generated ${validatedFlashcards.length} flashcards`);
    
    // Set proper content type and send JSON response
    res.setHeader('Content-Type', 'application/json');
    res.json({ flashcards: validatedFlashcards });

  } catch (err) {
    console.error('Flashcard generation error:', err.message);
    
    // Fallback: return sample flashcards
    const fallbackFlashcards = [
      {
        front: "What is the main topic of this content?",
        back: "This content covers educational material that can be studied through active recall and spaced repetition techniques."
      },
      {
        front: "Why are flashcards effective for learning?",
        back: "Flashcards promote active recall, which strengthens memory pathways and improves long-term retention of information."
      },
      {
        front: "What is spaced repetition?",
        back: "Spaced repetition is a learning technique where information is reviewed at increasing intervals, optimizing memory retention and reducing forgetting."
      }
    ];

    // Set proper content type and send JSON response
    res.setHeader('Content-Type', 'application/json');
    res.json({ 
      flashcards: fallbackFlashcards,
      note: "AI generation failed, showing sample flashcards. Please try again with different content."
    });
  }
});

module.exports = router;