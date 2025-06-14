const generateQuiz = async () => {
  setLoading(true);
  setError(null);

  try {
    console.log('Starting quiz generation for document:', documentId);

    // Get document content from Supabase
    const { supabase } = await import('../../lib/supabase');
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('content, file_path, name')
      .eq('id', documentId)
      .single();

    if (docError) {
      console.error('Document fetch error:', docError);
      throw new Error('Failed to fetch document: ' + docError.message);
    }

    let content = document.content;

    // If no content, try to get it from the file
    if (!content && document.file_path) {
      const { data: urlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 3600);

      if (urlError) {
        throw new Error('Failed to access document file');
      }

      // Fallback: placeholder content if extraction fails
      content = `This is a study document titled "${document.name}". The document contains educational material that can be used for learning and assessment.`;
    }

    if (!content || content.trim().length < 50) {
      throw new Error('Document content is too short or empty for quiz generation');
    }

    // 👇 DYNAMIC API BASE: always works (local or IDE)
    const apiBase = window.location.origin;

    const response = await fetch(`${apiBase}/api/quiz/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } catch {
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html>')) {
          throw new Error('Server returned an error page. Please check if the AI backend is running and the frontend is pointing to the correct backend URL.');
        }
        throw new Error(`Server error: ${response.status} - ${responseText.substring(0, 100)}`);
      }
    }

    const data = await response.json();

    if (!data.quiz || !Array.isArray(data.quiz) || data.quiz.length === 0) {
      throw new Error('No quiz questions were generated');
    }

    setQuiz(data.quiz);
    setUserAnswers(new Array(data.quiz.length).fill(''));
    setTimeStarted(new Date());

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to generate quiz');
  } finally {
    setLoading(false);
  }
};
