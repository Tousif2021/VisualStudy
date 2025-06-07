import React, { useState, useRef, useEffect } from 'react';
import { X, Link as LinkIcon, Tag as TagIcon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from "../ui/Card";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../lib/store';
import { motion, AnimatePresence } from 'framer-motion';

interface NewLinkFormProps {
  onClose: () => void;
  onSave: () => void;
}

export const NewLinkForm: React.FC<NewLinkFormProps> = ({ onClose, onSave }) => {
  const user = useAppStore(state => state.user);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const tagList = tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        throw new Error('Please enter a valid URL starting with http:// or https://');
      }
      if (!user?.id) {
        throw new Error('You must be logged in to save links');
      }
      const { error } = await supabase
        .from('external_links')
        .insert([{
          user_id: user.id,
          title,
          url,
          description,
          tags: tagList,
        }]);
      if (error) throw error;
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ duration: 0.35, ease: "anticipate" }}
        >
          <Card className="w-full max-w-lg rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-white/80 to-slate-100/90 backdrop-blur-xl relative overflow-hidden p-0">
            {/* Glowy Animated Gradient */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute left-[-30%] top-[-20%] h-72 w-72 bg-blue-300 opacity-30 rounded-full filter blur-2xl animate-pulse" />
              <div className="absolute right-[-25%] bottom-[-25%] h-64 w-64 bg-indigo-200 opacity-30 rounded-full filter blur-2xl animate-pulse" />
            </div>
            {/* Header */}
            <CardHeader className="flex flex-row gap-2 justify-between items-start z-10 relative p-6 pb-2 border-b-0">
              <div>
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <LinkIcon size={28} className="text-blue-600 drop-shadow-glow" />
                  Add New Link
                </h2>
                <p className="text-base text-slate-500 mt-1 font-medium">
                  Quick save useful links, resources, or cheat sheets.  
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={26} />
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0 z-10 relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    ref={titleRef}
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your link a catchy title…"
                    required
                    className="focus:ring-2 focus:ring-blue-400 font-semibold bg-white/60"
                  />
                </div>
                <div>
                  <Input
                    label="URL"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    className="focus:ring-2 focus:ring-blue-400 font-semibold bg-white/60"
                  />
                </div>
                <div>
                  <Textarea
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Why is this link useful? (optional)"
                    rows={3}
                    className="focus:ring-2 focus:ring-blue-400 bg-white/60"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TagIcon size={18} className="text-blue-500" />
                    <span className="text-sm font-medium text-slate-500">Tags</span>
                  </div>
                  <Input
                    label="Tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Separate tags with commas (e.g., research, math, reference)"
                    className="focus:ring-2 focus:ring-blue-400 bg-white/60"
                  />
                  {tagList.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tagList.map((tag, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.85, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 5 }}
                          className="px-3 py-1 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-50 text-blue-800 rounded-full text-xs font-semibold shadow shadow-blue-100/40 border border-blue-200 flex items-center gap-1"
                        >
                          <TagIcon size={13} className="inline text-blue-400" />
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-xl shadow"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-end gap-3 pt-5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="rounded-xl px-6 py-2 font-semibold text-slate-500 border border-slate-200 bg-white/70 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white px-8 py-2 font-semibold shadow-lg shadow-blue-100/40 flex items-center gap-2 transition-all"
                  >
                    {isLoading && <Loader2 size={18} className="animate-spin" />}
                    Save Link
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
