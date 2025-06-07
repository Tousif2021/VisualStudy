import React, { useState, useEffect, useCallback } from "react";
import {
  Save, Undo, Redo, Eye, Trash2, X, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered,
  Table, Type, Palette, History, Clock, Check, AlertTriangle
} from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { createNote, updateNote } from "../../lib/supabase";
import { useAppStore } from "../../lib/store";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import TableExtension from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { motion, AnimatePresence } from "framer-motion";

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
  onDelete?: (noteId: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  courseId,
  initialNote,
  onSave,
  onCancel,
  onDelete,
}) => {
  const { user } = useAppStore();
  const [title, setTitle] = useState(initialNote?.title || "");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versions, setVersions] = useState<Array<{id: string, timestamp: Date, title: string}>>([]);

  // Rich text editor with comprehensive extensions
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      UnderlineExtension,
      Link.configure({
        openOnClick: false,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TableExtension.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialNote?.content || "<p>Start writing your note...</p>",
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.split(/\s+/).filter(Boolean).length);
      
      // Auto-save after 2 seconds of inactivity
      clearTimeout(autoSaveTimeout.current);
      autoSaveTimeout.current = setTimeout(() => {
        handleAutoSave();
      }, 2000);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none min-h-[500px] focus:outline-none p-6 bg-white',
      },
    },
  });

  const autoSaveTimeout = React.useRef<NodeJS.Timeout>();

  // Auto-save functionality
  const handleAutoSave = useCallback(async () => {
    if (!user || !editor || !title.trim()) return;
    
    setAutoSaveStatus('saving');
    try {
      const content = editor.getHTML();
      if (initialNote) {
        await updateNote(initialNote.id, title, content);
      } else {
        await createNote(user.id, title, content, courseId);
      }
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      
      // Add to version history
      setVersions(prev => [{
        id: Date.now().toString(),
        timestamp: new Date(),
        title: title
      }, ...prev.slice(0, 9)]); // Keep last 10 versions
      
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      console.error('Auto-save failed:', error);
    }
  }, [user, editor, title, initialNote, courseId]);

  // Manual save
  const handleSave = async () => {
    if (!user || !editor) return;
    setSaving(true);
    
    try {
      const content = editor.getHTML();
      if (initialNote) {
        await updateNote(initialNote.id, title, content);
      } else {
        await createNote(user.id, title, content, courseId);
      }
      setLastSaved(new Date());
      onSave();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  // Delete functionality
  const handleDelete = async () => {
    if (!initialNote || !onDelete) return;
    
    try {
      await onDelete(initialNote.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // Formatting functions
  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
  const toggleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => 
    editor?.chain().focus().toggleHeading({ level }).run();
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const setTextAlign = (alignment: 'left' | 'center' | 'right' | 'justify') =>
    editor?.chain().focus().setTextAlign(alignment).run();
  const toggleHighlight = (color?: string) => 
    editor?.chain().focus().toggleHighlight({ color }).run();

  // Insert table
  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Document"
                className="text-3xl font-bold bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-400"
                maxLength={100}
              />
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{wordCount} words</span>
                {initialNote?.updated_at && (
                  <span>Last edited: {new Date(initialNote.updated_at).toLocaleDateString()}</span>
                )}
                <div className="flex items-center gap-2">
                  {autoSaveStatus === 'saving' && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check size={14} />
                      <span>Saved</span>
                    </div>
                  )}
                  {autoSaveStatus === 'error' && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertTriangle size={14} />
                      <span>Save failed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVersionHistory(true)}
                leftIcon={<History size={16} />}
              >
                History
              </Button>
              {initialNote && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  leftIcon={<Trash2 size={16} />}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Delete
                </Button>
              )}
              <Button
                onClick={handleSave}
                isLoading={saving}
                leftIcon={<Save size={16} />}
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                leftIcon={<X size={16} />}
              >
                Close
              </Button>
            </div>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBold}
                className={editor?.isActive('bold') ? 'bg-blue-100 text-blue-700' : ''}
                title="Bold (Ctrl+B)"
              >
                <Bold size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleItalic}
                className={editor?.isActive('italic') ? 'bg-blue-100 text-blue-700' : ''}
                title="Italic (Ctrl+I)"
              >
                <Italic size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleUnderline}
                className={editor?.isActive('underline') ? 'bg-blue-100 text-blue-700' : ''}
                title="Underline (Ctrl+U)"
              >
                <Underline size={16} />
              </Button>
            </div>

            {/* Headings */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
              <select
                onChange={(e) => {
                  const level = parseInt(e.target.value);
                  if (level === 0) {
                    editor?.chain().focus().setParagraph().run();
                  } else {
                    toggleHeading(level as 1 | 2 | 3 | 4 | 5 | 6);
                  }
                }}
                className="text-sm border border-gray-300 rounded px-2 py-1"
                value={
                  editor?.isActive('heading', { level: 1 }) ? 1 :
                  editor?.isActive('heading', { level: 2 }) ? 2 :
                  editor?.isActive('heading', { level: 3 }) ? 3 :
                  editor?.isActive('heading', { level: 4 }) ? 4 :
                  editor?.isActive('heading', { level: 5 }) ? 5 :
                  editor?.isActive('heading', { level: 6 }) ? 6 : 0
                }
              >
                <option value={0}>Normal</option>
                <option value={1}>Heading 1</option>
                <option value={2}>Heading 2</option>
                <option value={3}>Heading 3</option>
                <option value={4}>Heading 4</option>
                <option value={5}>Heading 5</option>
                <option value={6}>Heading 6</option>
              </select>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBulletList}
                className={editor?.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : ''}
                title="Bullet List"
              >
                <List size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleOrderedList}
                className={editor?.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : ''}
                title="Numbered List"
              >
                <ListOrdered size={16} />
              </Button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTextAlign('left')}
                className={editor?.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : ''}
                title="Align Left"
              >
                <AlignLeft size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTextAlign('center')}
                className={editor?.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : ''}
                title="Align Center"
              >
                <AlignCenter size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTextAlign('right')}
                className={editor?.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : ''}
                title="Align Right"
              >
                <AlignRight size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTextAlign('justify')}
                className={editor?.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-700' : ''}
                title="Justify"
              >
                <AlignJustify size={16} />
              </Button>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleHighlight('#ffeb3b')}
                  title="Highlight Yellow"
                  className="relative"
                >
                  <Palette size={16} />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-yellow-400 rounded" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleHighlight('#4caf50')}
                  title="Highlight Green"
                  className="relative"
                >
                  <Palette size={16} />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-green-400 rounded" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleHighlight('#f44336')}
                  title="Highlight Red"
                  className="relative"
                >
                  <Palette size={16} />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-red-400 rounded" />
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={insertTable}
                title="Insert Table"
              >
                <Table size={16} />
              </Button>
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
                title="Undo (Ctrl+Z)"
              >
                <Undo size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
                title="Redo (Ctrl+Y)"
              >
                <Redo size={16} />
              </Button>
            </div>

            {/* Preview */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className={showPreview ? 'bg-blue-100 text-blue-700' : ''}
              title="Preview"
            >
              <Eye size={16} />
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="min-h-[600px] bg-white">
          {showPreview ? (
            <div className="max-w-4xl mx-auto p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <EditorContent editor={editor} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>{wordCount} words</span>
              {lastSaved && (
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>Auto-save enabled</span>
              <div className={`w-2 h-2 rounded-full ${
                autoSaveStatus === 'saved' ? 'bg-green-500' :
                autoSaveStatus === 'saving' ? 'bg-blue-500' :
                autoSaveStatus === 'error' ? 'bg-red-500' : 'bg-gray-300'
              }`} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Note</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "{title || 'Untitled Document'}"? 
                This will permanently remove the note and all its content.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  leftIcon={<Trash2 size={16} />}
                >
                  Delete Note
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version History Modal */}
      <AnimatePresence>
        {showVersionHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowVersionHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-lg mx-4 shadow-2xl max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVersionHistory(false)}
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="space-y-3">
                {versions.length > 0 ? (
                  versions.map((version) => (
                    <div key={version.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{version.title}</p>
                        <p className="text-xs text-gray-500">
                          {version.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No version history available</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoteEditor;