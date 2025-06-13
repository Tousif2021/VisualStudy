import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, Heart, Smile, Meh, Frown, Tag, Calendar, Lock, Unlock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { createJournalEntry, updateJournalEntry } from '../../lib/journal';
import { useAppStore } from '../../lib/store';
import type { JournalEntry } from '../../lib/journal';

interface JournalEditorProps {
  entry?: JournalEntry | null;
  onSave: () => void;
  onCancel: () => void;
}

const moods = [
  { value: 'happy', label: 'Happy', icon: <Smile size={20} />, color: 'text-green-500' },
  { value: 'neutral', label: 'Neutral', icon: <Meh size={20} />, color: 'text-yellow-500' },
  { value: 'sad', label: 'Sad', icon: <Frown size={20} />, color: 'text-blue-500' },
  { value: 'excited', label: 'Excited', icon: <Heart size={20} />, color: 'text-pink-500' },
];

export const JournalEditor: React.FC<JournalEditorProps> = ({ entry, onSave, onCancel }) => {
  const { user } = useAppStore();
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState(entry?.mood || '');
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [currentTag, setCurrentTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setWordCount(content.split(/\s+/).filter(Boolean).length);
  }, [content]);

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!user || !title.trim() || !content.trim()) return;
    
    setSaving(true);
    try {
      if (entry) {
        await updateJournalEntry(entry.id, title, content, mood, tags);
      } else {
        await createJournalEntry(user.id, title, content, mood, tags);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save journal entry:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-amber-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 border-b border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <Heart size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-amber-800">
                  {entry ? 'Edit Journal Entry' : 'New Journal Entry'}
                </h2>
                <p className="text-sm text-amber-600">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSave}
                disabled={!title.trim() || !content.trim() || saving}
                isLoading={saving}
                leftIcon={<Save size={16} />}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                onClick={onCancel}
                className="text-amber-700 hover:bg-amber-100"
              >
                <X size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Title */}
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind today?"
              className="text-lg font-medium"
              fullWidth
            />

            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-3">How are you feeling?</label>
              <div className="flex gap-3">
                {moods.map((moodOption) => (
                  <motion.button
                    key={moodOption.value}
                    type="button"
                    onClick={() => setMood(mood === moodOption.value ? '' : moodOption.value)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all
                      ${mood === moodOption.value
                        ? 'border-amber-500 bg-amber-100 text-amber-800'
                        : 'border-amber-200 bg-white text-amber-600 hover:border-amber-300'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={moodOption.color}>{moodOption.icon}</span>
                    <span className="text-sm font-medium">{moodOption.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content */}
            <Textarea
              label="Your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Dear journal, today I..."
              rows={12}
              className="resize-none"
              fullWidth
            />

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-3">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-sm"
                  >
                    <Tag size={12} />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-amber-600 hover:text-amber-800"
                    >
                      <X size={12} />
                    </button>
                  </motion.span>
                ))}
              </div>
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={addTag}
                placeholder="Add a tag and press Enter"
                className="text-sm"
                fullWidth
              />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-amber-600 bg-amber-50 rounded-lg p-3">
              <span>{wordCount} words</span>
              <span>Entry #{entry ? 'existing' : 'new'}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};