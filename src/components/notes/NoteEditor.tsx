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

  // --- UI ---
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="relative bg-white border border-gray-200 rounded-md shadow-sm max-w-3xl w-full mx-auto mt-8"
    >
      {/* Header: Title and Toolbar */}
      <div className="flex flex-col gap-0">
        {/* Title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Untitled document"
          className="w-full text-3xl font-semibold border-none outline-none bg-transparent px-6 pt-6 pb-2"
          maxLength={80}
        />
        {/* Toolbar */}
        <div className="flex items-center gap-1 border-b border-gray-100 bg-gray-50 px-4 py-1 sticky top-0 z-10">
          <Button onClick={() => editor?.chain().focus().toggleBold().run()} variant="ghost" size="icon" title="Bold"><b>B</b></Button>
          <Button onClick={() => editor?.chain().focus().toggleItalic().run()} variant="ghost" size="icon" title="Italic"><i>I</i></Button>
          <Button onClick={() => editor?.chain().focus().toggleUnderline().run()} variant="ghost" size="icon" title="Underline"><u>U</u></Button>
          <Button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} variant="ghost" size="icon" title="Heading 1">H1</Button>
          <Button onClick={() => editor?.chain().focus().toggleBulletList().run()} variant="ghost" size="icon" title="Bulleted List">•</Button>
          <Button onClick={() => editor?.chain().focus().toggleOrderedList().run()} variant="ghost" size="icon" title="Numbered List">1.</Button>
          <Button onClick={() => setShowPreview((v) => !v)} variant="ghost" size="icon" title="Preview"><Eye size={18} /></Button>
          <Button onClick={undo} disabled={historyIdx === 0} variant="ghost" size="icon" title="Undo"><Undo size={16} /></Button>
          <Button onClick={redo} disabled={historyIdx === history.length - 1} variant="ghost" size="icon" title="Redo"><Redo size={16} /></Button>
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
            <Button
              onClick={handleSave}
              isLoading={saving}
              leftIcon={<Save size={16} />}
              className="ml-2"
              aria-label="Save Note"
            >
              Save
            </Button>
            <Button variant="outline" onClick={onCancel} className="ml-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
      {/* Editor / Preview */}
      <div className="px-6 pt-2 pb-6">
        {!showPreview ? (
          <EditorContent
            editor={editor}
            className="prose max-w-none min-h-[350px] bg-white"
          />
        ) : (
          <div className="prose max-w-none min-h-[350px] bg-gray-50 border rounded-md p-4">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
        <div className="flex items-center justify-between pt-3 text-xs text-gray-500">
          <span>{wordCount} words</span>
          {initialNote?.updated_at && (
            <span className="italic">
              Last edited: {new Date(initialNote.updated_at).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NoteEditorPro;
