import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Lock, Unlock, Tag, Smile, Heart, Frown, Meh } from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  tags: string[];
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

interface JournalEditorProps {
  entry?: JournalEntry | null;
  onSave: (entry: Partial<JournalEntry>) => void;
  onDelete?: () => void;
  onClose: () => void;
  onCancel: () => void;
}

const moodOptions = [
  { value: 'happy', label: 'Happy', icon: Smile, color: 'text-green-500' },
  { value: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-500' },
  { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-500' },
  { value: 'excited', label: 'Excited', icon: Heart, color: 'text-pink-500' },
];

export function JournalEditor({ entry, onSave, onDelete, onClose }: JournalEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood || '');
      setTags(entry.tags || []);
      setIsLocked(entry.is_locked);
    }
  }, [entry]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        mood: mood || undefined,
        tags,
        is_locked: isLocked,
      });
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {entry ? 'Edit Entry' : 'New Journal Entry'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`p-2 rounded-lg transition-colors ${
                isLocked 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isLocked ? 'Unlock entry' : 'Lock entry'}
            >
              {isLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete entry"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry title..."
                className="w-full text-2xl font-semibold border-none outline-none focus:ring-0 placeholder-gray-400"
              />
            </div>

            {/* Mood and Tags Row */}
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Mood Selector */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Mood:</span>
                <div className="flex space-x-2">
                  {moodOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setMood(mood === option.value ? '' : option.value)}
                        className={`p-2 rounded-lg transition-colors ${
                          mood === option.value
                            ? 'bg-blue-100 border-2 border-blue-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                        title={option.label}
                      >
                        <Icon className={`h-5 w-5 ${mood === option.value ? 'text-blue-600' : option.color}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tags */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add tags..."
                    className="flex-1 px-3 py-1 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts..."
                className="w-full h-96 p-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-blue-100 bg-gray-50">
          <div className="text-sm text-gray-500">
            {entry && (
              <span>
                Created: {new Date(entry.created_at).toLocaleDateString()}
                {entry.updated_at !== entry.created_at && (
                  <span className="ml-2">
                    • Updated: {new Date(entry.updated_at).toLocaleDateString()}
                  </span>
                )}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || saving}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{saving ? 'Saving...' : 'Save Entry'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}