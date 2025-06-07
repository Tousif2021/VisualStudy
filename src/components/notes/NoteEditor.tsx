import React, { useRef, useState, useEffect } from "react";
import {
  Save,
  Eye,
  Pencil,
  X,
  ActivitySquare,
  Undo,
  Redo,
  Wand2,
  Loader2,
  BarChart2,
  User,
} from "lucide-react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { createNote, updateNote } from "../../lib/supabase";
import { useAppStore } from "../../lib/store";
import ReactMarkdown from "react-markdown";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import Avatar from "boring-avatars"; // Or your avatar component

interface NoteEditorProps {
  courseId: string;
  initialNote?: {
    id: string;
    title: string;
    content: string;
    updated_at?: string;
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
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIdx, setHistoryIdx] = useState(0);

  // Chart state
  const [chartData, setChartData] = useState({
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "Demo Chart",
        data: [12, 19, 3],
      },
    ],
  });

  // Drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#222");
  const [drawingState, setDrawingState] = useState<{
    drawing: boolean;
    x: number;
    y: number;
  }>({ drawing: false, x: 0, y: 0 });

  // Handle content autosave/history
  useEffect(() => {
    setWordCount(content.split(/\s+/).filter(Boolean).length);
    if (history[historyIdx] !== content) {
      const updated = [...history.slice(0, historyIdx + 1), content];
      setHistory(updated);
      setHistoryIdx(updated.length - 1);
    }
    // eslint-disable-next-line
  }, [content]);

  // Autosave feedback
  useEffect(() => {
    if (!saving && lastSaved) {
      const timer = setTimeout(() => setLastSaved(null), 1200);
      return () => clearTimeout(timer);
    }
  }, [saving, lastSaved]);

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
      setLastSaved(new Date());
      onSave();
    } catch (err) {
      setError("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Undo/Redo logic
  const undo = () => {
    if (historyIdx > 0) {
      setContent(history[historyIdx - 1]);
      setHistoryIdx(historyIdx - 1);
    }
  };
  const redo = () => {
    if (historyIdx < history.length - 1) {
      setContent(history[historyIdx + 1]);
      setHistoryIdx(historyIdx + 1);
    }
  };

  // AI Suggestion Demo (replace with your real API call)
  const handleSuggest = async () => {
    setIsSuggesting(true);
    setTimeout(() => {
      setContent(
        content +
          "\n\n✨ _AI Suggestion: Summarize key points, add more visuals for clarity._"
      );
      setIsSuggesting(false);
    }, 1200);
  };

  // Drawing logic
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    setDrawingState({
      drawing: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  const handleCanvasMouseUp = () =>
    setDrawingState((s) => ({ ...s, drawing: false }));
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingState.drawing) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const ctx = canvasRef.current!.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(drawingState.x, drawingState.y);
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setDrawingState({
      drawing: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Editable chart demo
  const handleChartLabelChange = (idx: number, value: string) => {
    setChartData((prev) => ({
      ...prev,
      labels: prev.labels.map((l, i) => (i === idx ? value : l)),
    }));
  };
  const handleChartDataChange = (idx: number, value: number) => {
    setChartData((prev) => ({
      ...prev,
      datasets: [
        {
          ...prev.datasets[0],
          data: prev.datasets[0].data.map((d, i) =>
            i === idx ? value : d
          ),
        },
      ],
    }));
  };

  // Layout
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="rounded-3xl shadow-xl bg-gradient-to-br from-white to-gray-50 p-6 pb-4 max-w-2xl w-full mx-auto border border-gray-200/80 backdrop-blur-lg transition-all"
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <Avatar
            size={32}
            name={user?.email || "Anon"}
            variant="beam"
            colors={["#f59e42", "#705df2", "#ff5971", "#70f2c7", "#63a4ff"]}
          />
          <div>
            <span className="font-bold text-lg text-gray-800">
              {initialNote ? "Edit Note" : "New Note"}
            </span>
            {initialNote?.updated_at && (
              <div className="text-xs text-gray-400">
                Last edited: {new Date(initialNote.updated_at).toLocaleString()}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant={showPreview ? "solid" : "ghost"}
            aria-label="Side-by-side Preview"
            onClick={() => setShowPreview((v) => !v)}
            className="rounded-full"
            title="Toggle markdown preview"
          >
            <Eye size={18} />
          </Button>
          <Button
            size="icon"
            variant={drawing ? "solid" : "ghost"}
            aria-label="Draw"
            onClick={() => setDrawing((v) => !v)}
            className="rounded-full"
            title="Open drawing canvas"
          >
            <ActivitySquare size={18} />
          </Button>
          <Button
            size="icon"
            variant={showChart ? "solid" : "ghost"}
            aria-label="Chart"
            onClick={() => setShowChart((v) => !v)}
            className="rounded-full"
            title="Add chart"
          >
            <BarChart2 size={18} />
          </Button>
        </div>
      </div>

      {/* Title field */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className="text-xl font-medium rounded-2xl bg-white/70 ring-1 ring-gray-200/70 mb-1 focus:ring-2"
        required
        aria-label="Note Title"
      />

      {/* Editor + Markdown side-by-side */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1">
          <div className="relative">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here... (markdown supported)"
              rows={showPreview ? 10 : 15}
              className="resize-y rounded-2xl focus:ring-2 bg-white/80 ring-1 ring-gray-200/80 font-mono text-base"
              aria-label="Note Content"
              required
            />
            <div className="absolute bottom-1 right-3 text-xs text-gray-400">
              {wordCount} words
            </div>
          </div>
          {/* Undo/Redo/AI Buttons */}
          <div className="flex gap-1 pt-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={undo}
              disabled={historyIdx === 0}
              aria-label="Undo"
              title="Undo"
            >
              <Undo size={16} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={redo}
              disabled={historyIdx === history.length - 1}
              aria-label="Redo"
              title="Redo"
            >
              <Redo size={16} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="ml-2"
              onClick={handleSuggest}
              disabled={isSuggesting}
              leftIcon={<Wand2 size={16} />}
            >
              {isSuggesting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={14} />
                  Thinking...
                </>
              ) : (
                "AI: Suggest"
              )}
            </Button>
          </div>
        </div>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 border rounded-2xl p-3 bg-gray-50 shadow-inner min-h-[160px] font-sans"
          >
            <ReactMarkdown>
              {content || "*Nothing to preview yet!*"}
            </ReactMarkdown>
          </motion.div>
        )}
      </div>

      {/* Drawing Canvas */}
      {drawing && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-2 rounded-xl border shadow bg-white/90 p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-600">Drawing color:</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-7 h-7 rounded-full border-2"
            />
            <Button
              size="xs"
              variant="outline"
              className="ml-auto"
              onClick={() =>
                canvasRef.current
                  ?.getContext("2d")
                  ?.clearRect(0, 0, 600, 200)
              }
            >
              Clear
            </Button>
          </div>
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="border rounded-xl cursor-crosshair w-full"
            style={{ background: "#fff" }}
            onMouseDown={handleCanvasMouseDown}
            onMouseUp={handleCanvasMouseUp}
            onMouseOut={handleCanvasMouseUp}
            onMouseMove={handleCanvasMouseMove}
          />
        </motion.div>
      )}

      {/* Editable Chart */}
      {showChart && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-4 border rounded-xl bg-gray-50"
        >
          <div className="flex flex-col gap-2 mb-3">
            {chartData.labels.map((label, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={label}
                  onChange={(e) =>
                    handleChartLabelChange(idx, e.target.value)
                  }
                  className="w-24"
                  aria-label={`Chart label ${idx + 1}`}
                />
                <Input
                  type="number"
                  value={chartData.datasets[0].data[idx]}
                  onChange={(e) =>
                    handleChartDataChange(idx, Number(e.target.value))
                  }
                  className="w-20"
                  aria-label={`Chart data ${idx + 1}`}
                />
              </div>
            ))}
          </div>
          <Bar data={chartData} />
        </motion.div>
      )}

      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}

      {/* Save/Cancel */}
      <div className="flex items-center justify-between pt-4">
        <div>
          {lastSaved && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-xs text-green-600 gap-1"
            >
              <Save size={14} />
              Autosaved!
            </motion.div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            leftIcon={<X size={16} />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            isLoading={saving}
            leftIcon={<Save size={16} />}
            className="active:scale-95"
            aria-label="Save Note"
          >
            Save Note
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
