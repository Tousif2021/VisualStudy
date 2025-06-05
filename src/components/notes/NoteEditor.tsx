import React, { useRef, useState } from 'react';
import { Save, Eye, Pencil, X, ActivitySquare } from 'lucide-react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { createNote, updateNote } from '../../lib/supabase';
import { useAppStore } from '../../lib/store';
import ReactMarkdown from 'react-markdown';
import { Bar } from 'react-chartjs-2';

interface NoteEditorProps {
  courseId: string;
  initialNote?: {
    id: string;
    title: string;
    content: string;
  };
  onSave: () => void;
  onCancel: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  courseId,
  initialNote,
  onSave,
  onCancel,
}) => {
  const { user } = useAppStore();
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Chart data (editable fields in UI in a real app!)
  const [showChart, setShowChart] = useState(false);
  const chartData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Demo Chart',
        data: [12, 19, 3],
      },
    ],
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      if (initialNote) {
        await updateNote(initialNote.id, title, content);
      } else {
        await createNote(user.id, title, content, courseId);
      }
      onSave();
    } catch (err) {
      setError('Failed to save note. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Basic drawing handler (lines only)
  const [drawingState, setDrawingState] = useState<{ drawing: boolean; x: number; y: number }>({ drawing: false, x: 0, y: 0 });
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    setDrawingState({ drawing: true, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handleCanvasMouseUp = () => setDrawingState((s) => ({ ...s, drawing: false }));
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingState.drawing) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const ctx = canvasRef.current!.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(drawingState.x, drawingState.y);
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setDrawingState({ drawing: true, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="rounded-2xl shadow-lg bg-white p-6 space-y-5 max-w-2xl mx-auto transition-all animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-xl">Edit Note</h2>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant={showPreview ? "solid" : "outline"}
            aria-label="Preview"
            onClick={() => setShowPreview((v) => !v)}
            className="rounded-full"
          >
            {showPreview ? <Pencil size={18} /> : <Eye size={18} />}
          </Button>
          <Button
            size="icon"
            variant={drawing ? "solid" : "outline"}
            aria-label="Draw"
            onClick={() => setDrawing((v) => !v)}
            className="rounded-full"
          >
            <ActivitySquare size={18} />
          </Button>
          <Button
            size="icon"
            variant={showChart ? "solid" : "outline"}
            aria-label="Chart"
            onClick={() => setShowChart((v) => !v)}
            className="rounded-full"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="12" width="4" height="8"/><rect x="9" y="8" width="4" height="12"/><rect x="15" y="4" width="4" height="16"/></svg>
          </Button>
        </div>
      </div>

      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className="text-lg font-medium"
        required
      />

      {showPreview ? (
        <div className="border rounded-xl p-4 bg-gray-50 min-h-[180px]">
          <ReactMarkdown>{content || "*Nothing to preview yet!*"}</ReactMarkdown>
        </div>
      ) : (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here... (markdown supported)"
          rows={10}
          className="resize-y rounded-xl focus:ring-2 transition"
          required
        />
      )}

      {drawing && (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={500}
            height={200}
            className="border rounded-xl mt-2 cursor-crosshair"
            style={{ background: "#fff" }}
            onMouseDown={handleCanvasMouseDown}
            onMouseUp={handleCanvasMouseUp}
            onMouseOut={handleCanvasMouseUp}
            onMouseMove={handleCanvasMouseMove}
          />
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2 right-2"
            onClick={() => { canvasRef.current?.getContext('2d')?.clearRect(0,0,500,200); }}
          >Clear</Button>
        </div>
      )}

      {showChart && (
        <div className="p-4 border rounded-xl bg-gray-50">
          <Bar data={chartData} />
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={onCancel} leftIcon={<X size={16} />}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          isLoading={saving}
          leftIcon={<Save size={16} />}
          className="transition active:scale-95"
        >
          Save Note
        </Button>
      </div>
    </div>
  );
};
