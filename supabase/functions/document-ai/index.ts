import { createClient } from "npm:@google/generative-ai";
import { corsHeaders } from "../_shared/cors.ts";

const genAI = createClient(Deno.env.get("GEMINI_API_KEY") || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, content } = await req.json();
    let result;

    switch (action) {
      case "summarize":
        result = await model.generateContent(`
          Please provide a concise summary of the following text. Focus on the main points and key takeaways:
          ${content}
        `);
        break;

      case "quiz":
        result = await model.generateContent(`
          Generate 5 multiple choice questions based on this content. Format as JSON with the following structure:
          {
            "questions": [
              {
                "question": "string",
                "options": ["string"],
                "correctAnswer": "string",
                "explanation": "string"
              }
            ]
          }
          Content: ${content}
        `);
        break;

      case "flashcards":
        result = await model.generateContent(`
          Create 10 flashcards based on this content. Format as JSON with the following structure:
          {
            "flashcards": [
              {
                "front": "string",
                "back": "string"
              }
            ]
          }
          Content: ${content}
        `);
        break;

      default:
        throw new Error("Invalid action");
    }

    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ result: text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});