import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
    // Autofocus the title input on open
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
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur"
      >
        <Card className="w-full max-w-lg rounded-2xl shadow-2xl bg-gradient-to-br from-white to-slate-50 border p-0">
          <CardHeader className="flex justify-between items-center p-5 pb-0 border-b">
            <h2 className="text-2xl font-bold tracking-tight">Add New Link</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700"
            >
              <X size={24} />
            </Button>
          </CardHeader>
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  ref={titleRef}
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for this link..."
                  required
                  className="focus:ring-2 focus:ring-blue-400"
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
                  className="focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <Textarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description (optional)"
                  rows={3}
                  className="focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <Input
                  label="Tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags separated by commas..."
                  helperText="Example: research, math, reference"
                  className="focus:ring-2 focus:ring-blue-400"
                />
                {tagList.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tagList.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {tag}
                      </span>
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
                    className="text-red-600 text-sm p-3 bg-red-50 rounded-md"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-xl px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 font-semibold shadow"
                >
                  Save Link
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
