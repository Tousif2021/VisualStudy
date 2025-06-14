const genAI = require('./gemini');

async function generateQuiz(content) {
  // Build the prompt
  const prompt = `
Read the following text and create 10-15 quiz questions for student practice.
Questions should cover all important topics and mix MCQs and open-ended types.
For MCQs, provide 4 options and the correct answer.
Output as strict valid JSON array like this:
[
  {"type":"mcq","question":"...","options":["A","B","C","D"],"answer":"A"},
  {"type":"open","question":"...","answer":"..."},
  ...
]
TEXT:
"""${content}"""
  `;

  // Use Gemini's API to generate content (works for both summarizing and quiz)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const result = await model.generateContent(prompt);

  const response = await result.response;
  const text = response.text();

  // Try to extract the JSON array from the model’s response
  try {
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    const quizJSON = text.slice(start, end + 1);
    return JSON.parse(quizJSON);
  } catch (err) {
    throw new Error('Failed to parse AI quiz response. Raw response: ' + text);
  }
}

module.exports = { generateQuiz };
