import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import { uploadDocument } from '../../lib/supabase';
import { useAppStore } from '../../lib/store';

interface DocumentUploadProps {
  courseId: string;
  onUploadComplete: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ courseId, onUploadComplete }) => {
  const { user } = useAppStore();
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) return;
    setUploading(true);
    setError(null);

    try {
      for (const file of acceptedFiles) {
        const { error } = await uploadDocument(courseId, user.id, file);
        if (error) throw error;
      }
      onUploadComplete();
    } catch (err) {
      setError('Failed to upload document. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  }, [courseId, user, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10485760, // 10MB
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: PDF, TXT, DOCX (Max 10MB)
        </p>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {uploading && (
        <div className="mt-2 text-sm text-gray-600">
          Uploading...
        </div>
      )}
    </div>
  );
};