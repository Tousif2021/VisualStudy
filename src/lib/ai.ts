import { supabase } from './supabase';

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/document-ai`;
const AI_BACKEND_URL = import.meta.env.VITE_API_BASE || 'https://visualstudy.onrender.com';

export async function callDocumentAI(action: 'summarize' | 'quiz' | 'flashcards', content: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, content }),
    });

    if (!response.ok) {
      throw new Error('Failed to process document');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('AI processing error:', error);
    throw error;
  }
}

export async function askAI(question: string) {
  try {
    const response = await fetch(`${AI_BACKEND_URL}/api/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error('AI chat error:', error);
    throw error;
  }
}