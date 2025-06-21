import React, { useEffect, useState } from 'react';
import { FileText, Download, Loader } from 'lucide-react';
import { Button } from '../ui/cButton';
import { supabase } from '../../lib/supabase';
import { callDocumentAI } from '../../lib/ai';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'; // Renders raw HTML - be careful with untrusted input
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Document {
  id: string;
  name: string;
  file_path: string;
  file_type: string;
  content?: string | null;
}

interface DocumentViewerProps {
  document: Document;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [processingAI, setProcessingAI] = useState<boolean>(false);
  const [documentContent, setDocumentContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get signed URL for document display
        const { data: urlData, error: urlError } = await supabase.storage
          .from('documents')
          .createSignedUrl(document.file_path, 3600);

        if (urlError || !urlData?.signedUrl) {
          throw urlError || new Error('Failed to get signed URL');
        }
        setUrl(urlData.signedUrl);

        // Fetch document content from Supabase DB
        const { data: docData, error: docError } = await supabase
          .from('documents')
          .select('content')
          .eq('id', document.id)
          .single();

        if (docError) throw docError;
        setDocumentContent(docData?.content ?? null);
      } catch (err: any) {
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
    } catch (err: any) {
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
      <div className="p-4 border-b flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FileText className="text-blue-600" />
          <h3 className="font-medium">{document.name}</h3>
        </div>
        <div className="flex gap-2 flex-wrap">
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
          <div className="mt-4 p-4 bg-gray-50 rounded-lg prose max-w-none">
            <h4 className="font-medium mb-2">AI Analysis Result</h4>
            <ReactMarkdown
              key={aiResult} // helps React re-render when aiResult changes
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]} // ⚠️ Only use if input is sanitized/trusted
              components={{
                p({ children }) {
                  return <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{children}</p>;
                },
                strong({ children }) {
                  return (
                    <strong
                      style={{
                        backgroundColor: '#d1fae5',
                        padding: '0 4px',
                        borderRadius: '3px',
                        fontWeight: '700',
                      }}
                    >
                      {children}
                    </strong>
                  );
                },
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className={className}
                      {...props}
                      style={{ backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '4px' }}
                    >
                      {children}
                    </code>
                  );
                }
              }}
            >
              {aiResult}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
