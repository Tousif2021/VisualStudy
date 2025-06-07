import React, { useState, useEffect } from "react";
import {
  Save, Undo, Redo, Eye,
} from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { createNote, updateNote } from "../../lib/supabase";
import { useAppStore } from "../../lib/store";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { motion } from "framer-motion";

interface NoteEditorProProps {
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

const NoteEditorPro: React.FC<NoteEditorProProps> = ({
  courseId,
  initialNote,
  onSave,
  onCancel,
}) => {
  const { user } = useAppStore();
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIdx, setHistoryIdx] = useState(0);

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
    if (!title || !content) {
      setSaving(false);
      return;
    }
    try {
      if (initialNote) {
        await updateNote(initialNote.id, title, content);
      } else {
        await createNote(user.id, title, content, courseId);
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="relative bg-white border border-gray-200 rounded-md shadow-sm max-w-4xl w-full mx-auto mt-10"
    >
      {/* Save/Cancel Buttons - Top Right */}
      <div className="flex justify-end items-center gap-3 px-8 pt-6 pb-2">
        <Button
          onClick={handleSave}
          isLoading={saving}
          leftIcon={<Save size={16} />}
          aria-label="Save Note"
        >
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {/* Title Segment */}
      <div className="flex flex-col items-center pb-4">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Untitled document"
          className="w-full text-4xl font-bold text-center border-none outline-none bg-transparent px-0 py-2"
          maxLength={80}
        />
        {initialNote?.updated_at && (
          <span className="text-xs text-gray-400 mt-1">
            Last edited: {new Date(initialNote.updated_at).toLocaleString()}
          </span>
        )}
      </div>

      {/* Toolbar - Spread out */}
      <div className="flex flex-row flex-wrap items-center justify-center gap-4 border-b border-gray-100 bg-gray-50 px-8 py-2">
        <Button onClick={() => editor?.chain().focus().toggleBold().run()} variant="ghost" size="icon" title="Bold">
          <span className="font-bold text-lg">B</span>
        </Button>
        <Button onClick={() => editor?.chain().focus().toggleItalic().run()} variant="ghost" size="icon" title="Italic">
          <span className="italic text-lg">I</span>
        </Button>
        <Button onClick={() => editor?.chain().focus().toggleUnderline().run()} variant="ghost" size="icon" title="Underline">
          <span className="underline text-lg">U</span>
        </Button>
        <Button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} variant="ghost" size="icon" title="Heading 1">
          <span className="font-semibold">H1</span>
        </Button>
        <Button onClick={() => editor?.chain().focus().toggleBulletList().run()} variant="ghost" size="icon" title="Bulleted List">
          <span className="text-lg">•</span>
        </Button>
        <Button onClick={() => editor?.chain().focus().toggleOrderedList().run()} variant="ghost" size="icon" title="Numbered List">
          <span className="text-lg">1.</span>
        </Button>
        <Button onClick={() => setShowPreview((v) => !v)} variant="ghost" size="icon" title="Preview">
          <Eye size={20} />
        </Button>
        <Button onClick={undo} disabled={historyIdx === 0} variant="ghost" size="icon" title="Undo">
          <Undo size={18} />
        </Button>
        <Button onClick={redo} disabled={historyIdx === history.length - 1} variant="ghost" size="icon" title="Redo">
          <Redo size={18} />
        </Button>
      </div>

      {/* Editor / Preview - Infinite "page" feel */}
      <div className="w-full flex justify-center min-h-[600px] bg-white">
        <div className="w-full max-w-3xl p-8">
          {!showPreview ? (
            <EditorContent
              editor={editor}
              className="prose max-w-none min-h-[500px] bg-white outline-none focus:outline-none cursor-text"
            />
          ) : (
            <div className="prose max-w-none min-h-[500px] bg-gray-50 border rounded-md p-6">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between px-8 py-2 text-xs text-gray-500 border-t">
        <span>{wordCount} words</span>
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
    </motion.div>
  );
};

export default NoteEditorPro;
