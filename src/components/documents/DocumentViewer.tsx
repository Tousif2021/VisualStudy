import React from 'react';
import { FileText, Download, Loader } from 'lucide-react';
import { Button } from '../ui/cButton';
import { supabase } from '../../lib/supabase';
import { callDocumentAI } from '../../lib/ai';

interface DocumentViewerProps {
  document: {
    id: string;
    name: string;
    file_path: string;
    file_type: string;
    content?: string | null;
  };
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const [url, setUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [aiResult, setAiResult] = React.useState<string | null>(null);
  const [processingAI, setProcessingAI] = React.useState(false);
  const [documentContent, setDocumentContent] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchDocument = async () => {
      try {
        // Get signed URL for document display
        const { data: urlData, error: urlError } = await supabase.storage
          .from('documents')
          .createSignedUrl(document.file_path, 3600);

        if (urlError) throw urlError;
        setUrl(urlData.signedUrl);

        // Fetch document content
        const { data: docData, error: docError } = await supabase
          .from('documents')
          .select('content')
          .eq('id', document.id)
          .single();

        if (docError) throw docError;
        setDocumentContent(docData?.content || null);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [document.id, document.file_path]);

  const handleAIAction = async (action: 'summarize' | 'quiz' | 'flashcards') => {
    if (!documentContent) {
      setError('Document content is not available for AI processing yet. Please wait for processing to complete.');
      return;
    }

    setProcessingAI(true);
    setError(null);
    setAiResult(null);

    try {
      const result = await callDocumentAI(action, documentContent);
      setAiResult(result);
    } catch (err) {
      console.error('AI processing error:', err);
      setError('Failed to process document with AI. Please try again.');
    } finally {
      setProcessingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2 text-gray-600">Loading document...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <FileText className="text-blue-600 mr-2" />
          <h3 className="font-medium">{document.name}</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAIAction('summarize')}
            disabled={processingAI || !documentContent}
          >
            {processingAI ? <Loader className="animate-spin" size={16} /> : 'Summarize'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAIAction('quiz')}
            disabled={processingAI || !documentContent}
          >
            {processingAI ? <Loader className="animate-spin" size={16} /> : 'Generate Quiz'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAIAction('flashcards')}
            disabled={processingAI || !documentContent}
          >
            {processingAI ? <Loader className="animate-spin" size={16} /> : 'Create Flashcards'}
          </Button>
          {url && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download size={16} />}
              onClick={() => window.open(url, '_blank')}
            >
              Download
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {document.file_type === 'pdf' && url && (
          <iframe
            src={url}
            className="w-full h-[600px] border-0"
            title={document.name}
          />
        )}
        
        {!documentContent && (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Document content is being processed. AI features will be available once processing is complete.
            </p>
          </div>
        )}
        
        {aiResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">AI Analysis Result</h4>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap">{aiResult}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};