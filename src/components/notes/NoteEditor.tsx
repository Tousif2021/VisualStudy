import React, { useState, useEffect, useRef } from "react";
import {
  Save, Eye, X, Undo, Redo, Wand2, Loader2, BarChart2, ActivitySquare, Share2, PaintBucket,
} from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { createNote, updateNote } from "../../lib/supabase";
import { useAppStore } from "../../lib/store";
import EmojiPickerDialog from "./EmojiPickerDialog";
import { Bar } from "react-chartjs-2";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Avatar from "boring-avatars";
import { motion } from "framer-motion";

const COLORS = [
  "#f59e42", "#705df2", "#ff5971", "#70f2c7", "#63a4ff", "#ffd966", "#d4f8e8",
];

export default function NoteEditorPro({
  courseId,
  initialNote,
  onSave,
  onCancel,
}) {
  const { user } = useAppStore();
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const [history, setHistory] = useState([content]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [bgColor, setBgColor] = useState(initialNote?.color || COLORS[0]);
  const [emoji, setEmoji] = useState(initialNote?.emoji || "📝");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Chart state
  const [chartData, setChartData] = useState({
    labels: ["Red", "Blue", "Yellow"],
    datasets: [{ label: "Demo Chart", data: [12, 19, 3] }],
  });

  // Tiptap editor
  const editor = useEditor({
    extensions: [StarterKit, Underline, Link, Highlight],
    content: initialNote?.content || "<p>Start writing your note...</p>",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      setWordCount(editor.getText().split(/\s+/).filter(Boolean).length);
    },
  });

  // History logic
  useEffect(() => {
    setWordCount(
      editor?.getText().split(/\s+/).filter(Boolean).length || 0
    );
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
      const timer = setTimeout(() => setLastSaved(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [saving, lastSaved]);

  // Save handler
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    if (!title || !content) return;
    try {
      if (initialNote) {
        await updateNote(initialNote.id, title, content, bgColor, emoji);
      } else {
        await createNote(user.id, title, content, courseId, bgColor, emoji);
      }
      setLastSaved(new Date());
      onSave();
    } finally {
      setSaving(false);
    }
  };

  // Undo/Redo logic
  const undo = () => {
    if (historyIdx > 0) {
      editor?.commands.setContent(history[historyIdx - 1]);
      setHistoryIdx(historyIdx - 1);
    }
  };
  const redo = () => {
    if (historyIdx < history.length - 1) {
      editor?.commands.setContent(history[historyIdx + 1]);
      setHistoryIdx(historyIdx + 1);
    }
  };

  // AI Suggestion Demo
  const handleSuggest = () => {
    setIsSuggesting(true);
    setTimeout(() => {
      editor?.commands.insertContent(
        `<p>✨ <em>AI Suggestion: Try adding a summary, or break content into sections!</em></p>`
      );
      setIsSuggesting(false);
    }, 1000);
  };

  // Drawing
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#222");
  const [drawingState, setDrawingState] = useState({ drawing: false, x: 0, y: 0 });
  const handleCanvasMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setDrawingState({
      drawing: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  const handleCanvasMouseUp = () => setDrawingState((s) => ({ ...s, drawing: false }));
  const handleCanvasMouseMove = (e) => {
    if (!drawingState.drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext("2d");
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
  const handleChartLabelChange = (idx, value) => {
    setChartData((prev) => ({
      ...prev,
      labels: prev.labels.map((l, i) => (i === idx ? value : l)),
    }));
  };
  const handleChartDataChange = (idx, value) => {
    setChartData((prev) => ({
      ...prev,
      datasets: [
        {
          ...prev.datasets[0],
          data: prev.datasets[0].data.map((d, i) => (i === idx ? value : d)),
        },
      ],
    }));
  };

  // Share modal logic
  const shareUrl = typeof window !== "undefined"
    ? window.location.origin + `/notes/${initialNote?.id || "new"}`
    : "";

  // --- UI ---
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`relative rounded-3xl shadow-2xl border bg-gradient-to-br from-white to-gray-50/90 p-4 md:p-6 pb-3 max-w-3xl w-full mx-auto transition-all`}
      style={{ background: bgColor, transition: "background 0.4s" }}
    >
      {/* Floating header bar */}
      <div className="absolute right-4 -top-7 flex gap-2 items-center z-20">
        <Button
          variant="ghost"
          size="icon"
          title="Share Note"
          className="rounded-full"
          onClick={() => setShowShare(true)}
        >
          <Share2 size={18} />
        </Button>
        <Button variant="ghost" size="icon" title="Pick color" className="rounded-full px-2">
          <PaintBucket size={18} />
          <input
            type="color"
            value={bgColor}
            onChange={e => setBgColor(e.target.value)}
            className="w-7 h-7 absolute opacity-0 left-0 top-0 cursor-pointer"
            style={{ zIndex: 2 }}
          />
        </Button>
        <button
          className="rounded-full bg-white/70 px-2 py-1 border ml-1 text-xl"
          title="Add Emoji"
          onClick={() => setShowEmojiPicker(true)}
        >{emoji}</button>
      </div>
      <EmojiPickerDialog
        open={showEmojiPicker}
        onEmojiClick={setEmoji}
        onClose={() => setShowEmojiPicker(false)}
      />

      {/* Share modal */}
      {showShare && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[360px]">
            <div className="font-bold text-lg mb-3">Share this note</div>
            <div className="text-xs text-gray-500 mb-2">Shareable Link</div>
            <div className="flex gap-2 items-center mb-3">
              <input
                readOnly
                value={shareUrl}
                className="w-full rounded-lg px-2 py-1 bg-gray-100 border"
              />
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  alert("Link copied!");
                }}
              >Copy</Button>
            </div>
            <Button onClick={() => setShowShare(false)} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar
          size={36}
          name={user?.email || "Anon"}
          variant="beam"
          colors={COLORS}
        />
        <div className="flex flex-col">
          <span className="font-bold text-xl text-gray-800 tracking-tight">
            {emoji} {initialNote ? "Edit Note" : "New Note"}
          </span>
          {initialNote?.updated_at && (
            <span className="text-xs text-gray-400">
              Last edited: {new Date(initialNote.updated_at).toLocaleString()}
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {lastSaved && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-xs text-green-600 gap-1"
            >
              <Save size={14} /> Autosaved!
            </motion.div>
          )}
        </div>
      </div>

      {/* Title */}
      <Input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Give your note a title (e.g. Algorithms Summary)"
        className="text-2xl font-bold rounded-xl ring-2 ring-gray-200 mb-3 bg-white/80 px-4 py-2"
        required
        aria-label="Note Title"
        maxLength={80}
      />

      {/* Toolbar */}
      <div className="flex gap-2 bg-white/80 p-2 rounded-lg border mb-2 sticky top-2 z-10">
        <Button onClick={() => editor?.chain().focus().toggleBold().run()} variant="ghost" size="icon" title="Bold"><b>B</b></Button>
        <Button onClick={() => editor?.chain().focus().toggleItalic().run()} variant="ghost" size="icon" title="Italic"><i>I</i></Button>
        <Button onClick={() => editor?.chain().focus().toggleUnderline().run()} variant="ghost" size="icon" title="Underline"><u>U</u></Button>
        <Button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} variant="ghost" size="icon" title="H1">H1</Button>
        <Button onClick={() => editor?.chain().focus().toggleBulletList().run()} variant="ghost" size="icon" title="Bulleted List">•</Button>
        <Button onClick={() => editor?.chain().focus().toggleOrderedList().run()} variant="ghost" size="icon" title="Numbered List">1.</Button>
        <Button onClick={() => setShowPreview((v) => !v)} variant="ghost" size="icon" title="Preview"><Eye size={18} /></Button>
        <Button onClick={() => setDrawing((v) => !v)} variant="ghost" size="icon" title="Drawing"><ActivitySquare size={18} /></Button>
        <Button onClick={() => setShowChart((v) => !v)} variant="ghost" size="icon" title="Chart"><BarChart2 size={18} /></Button>
        <Button onClick={undo} disabled={historyIdx === 0} variant="ghost" size="icon" title="Undo"><Undo size={16} /></Button>
        <Button onClick={redo} disabled={historyIdx === history.length - 1} variant="ghost" size="icon" title="Redo"><Redo size={16} /></Button>
        <Button
          variant="outline"
          size="sm"
          className="ml-2"
          onClick={handleSuggest}
          disabled={isSuggesting}
        >
          {isSuggesting ? (<><Loader2 className="animate-spin mr-2" size={14} />AI...</>) : (<><Wand2 size={16} className="mr-1" />AI Suggest</>)}
        </Button>
      </div>

      {/* Editor / Preview */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 min-w-0">
          {!showPreview ? (
            <EditorContent
              editor={editor}
              className="prose max-w-none min-h-[180px] px-4 py-2 bg-white/80 rounded-2xl border ring-1 ring-gray-200"
            />
          ) : (
            <div className="prose max-w-none min-h-[180px] px-4 py-2 bg-white/60 rounded-2xl border ring-1 ring-gray-200">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          )}
          <div className="flex items-center justify-between pt-1 text-xs text-gray-500">
            <span>{wordCount} words</span>
            <span className="italic">Ctrl+S to save</span>
          </div>
        </div>
      </div>

      {/* Drawing Canvas */}
      {drawing && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-3 rounded-xl border shadow bg-white/90 p-3"
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
            >Clear</Button>
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
          className="mt-3 p-4 border rounded-xl bg-gray-50"
        >
          <div className="flex flex-col gap-2 mb-3">
            {chartData.labels.map((label, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={label}
                  onChange={(e) => handleChartLabelChange(idx, e.target.value)}
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-5 mt-2 border-t">
        <Button variant="ghost" onClick={onCancel} leftIcon={<X size={16} />}>
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
    </motion.div>
  );
}
