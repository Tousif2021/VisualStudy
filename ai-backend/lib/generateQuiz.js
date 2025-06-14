const genAI = require('./gemini');

async function generateQuiz(content) {
  console.log('Starting quiz generation with content length:', content.length);
  
  // Build the prompt
  const prompt = `
You are an expert quiz creator. Based on the following text, create exactly 8-12 multiple choice questions that test understanding of the key concepts.

IMPORTANT: Respond with ONLY a valid JSON array. No additional text, explanations, or formatting.

Format each question exactly like this:
{
  "type": "mcq",
  "question": "What is the main concept discussed?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Option A"
}

Requirements:
- Create 8-12 questions total
- All questions must be multiple choice (type: "mcq")
- Each question must have exactly 4 options
- Questions should cover different aspects of the content
- Make questions challenging but fair
- Ensure the correct answer is clearly identifiable from the text

TEXT TO ANALYZE:
"""${content.substring(0, 8000)}"""

Respond with only the JSON array:
`;
  let text = '';
  try {
    // Use Gemini's API to generate content
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Calling Gemini API...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text.substring(0, 200) + '...');

    // Try to extract and parse the JSON array
    let quizJSON = text.trim();
    
    // Remove any markdown formatting
    quizJSON = quizJSON.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Find the JSON array bounds
    const start = quizJSON.indexOf('[');
    const end = quizJSON.lastIndexOf(']');
    
    if (start === -1 || end === -1) {
      throw new Error('No JSON array found in response');
    }
    
    quizJSON = quizJSON.slice(start, end + 1);
    console.log('Extracted JSON:', quizJSON.substring(0, 200) + '...');
    
    const parsedQuiz = JSON.parse(quizJSON);
    
    // Validate the quiz structure
    if (!Array.isArray(parsedQuiz)) {
      throw new Error('Response is not an array');
    }
    
    if (parsedQuiz.length === 0) {
      throw new Error('No questions generated');
    }
    
    // Validate each question
    const validatedQuiz = parsedQuiz.filter(q => {
      return q && 
             typeof q.question === 'string' && 
             Array.isArray(q.options) && 
             q.options.length === 4 &&
             typeof q.answer === 'string' &&
             q.options.includes(q.answer);
    });
    
    if (validatedQuiz.length === 0) {
      throw new Error('No valid questions found in generated quiz');
    }
    
    console.log('Quiz validation successful. Valid questions:', validatedQuiz.length);
    return validatedQuiz;
    
  } catch (parseError) {
    console.error('Quiz parsing error:', parseError);
    console.error('Raw response that failed to parse:', text?.substring(0, 500));
    
    // Return a fallback quiz if parsing fails
    return [
      {
        type: "mcq",
        question: "Based on the document content, what is the main topic discussed?",
        options: [
          "The document discusses various concepts and ideas",
          "The content is not clearly defined",
          "Multiple topics are covered",
          "The main focus is on practical applications"
        ],
        answer: "The document discusses various concepts and ideas"
      },
      {
        type: "mcq",
        question: "What type of information does this document primarily contain?",
        options: [
          "Educational content",
          "Entertainment material",
          "Personal diary entries",
          "Technical specifications"
        ],
        answer: "Educational content"
      }
    ];
  }
}

module.exports = { generateQuiz };