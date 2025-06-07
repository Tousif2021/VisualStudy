import React, { useState, useRef, useEffect } from 'react';
import { X, Link as LinkIcon, Tag as TagIcon, Loader2, Trash2 } from 'lucide-react';
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
  linkToEdit?: any; // pass the link object if editing, else undefined
}

export const NewLinkForm: React.FC<NewLinkFormProps> = ({ onClose, onSave, linkToEdit }) => {
  const user = useAppStore(state => state.user);

  // Pre-fill if editing
  const [title, setTitle] = useState(linkToEdit?.title ?? '');
  const [url, setUrl] = useState(linkToEdit?.url ?? '');
  const [description, setDescription] = useState(linkToEdit?.description ?? '');
  const [tags, setTags] = useState(linkToEdit?.tags?.join(', ') ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { titleRef.current?.focus(); }, []);

  const tagList = tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  // Auto-add https:// if no protocol is provided
  const normalizeUrl = (inputUrl: string) => {
    if (!inputUrl) return '';
    if (inputUrl.startsWith('http://') || inputUrl.startsWith('https://')) {
      return inputUrl;
    }
    return `https://${inputUrl}`;
  };

  // Save (add or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (!user?.id) throw new Error('You must be logged in to save links');
      
      const normalizedUrl = normalizeUrl(url);
      
      if (linkToEdit) {
        // update
        const { error } = await supabase.from('external_links').update({
          title, 
          url: normalizedUrl, 
          description, 
          tags: tagList,
          updated_at: new Date().toISOString()
        }).eq('id', linkToEdit.id);
        if (error) throw error;
      } else {
        // create
        const { error } = await supabase.from('external_links').insert([{
          user_id: user.id, 
          title, 
          url: normalizedUrl, 
          description, 
          tags: tagList,
        }]);
        if (error) throw error;
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save link');
    } finally { 
      setIsLoading(false); 
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!linkToEdit?.id) return;
    setDeleteLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.from('external_links').delete().eq('id', linkToEdit.id);
      if (error) throw error;
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete link');
    } finally { 
      setDeleteLoading(false); 
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full max-w-lg rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-xl relative overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute left-[-30%] top-[-20%] h-72 w-72 bg-blue-300 opacity-20 rounded-full filter blur-3xl animate-pulse" />
              <div className="absolute right-[-25%] bottom-[-25%] h-64 w-64 bg-indigo-200 opacity-20 rounded-full filter blur-3xl animate-pulse" />
            </div>
            
            {/* Header */}
            <CardHeader className="flex flex-row gap-2 justify-between items-start z-10 relative p-6 pb-2 border-b-0">
              <div>
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <LinkIcon size={28} className="text-blue-600" />
                  {linkToEdit ? "Edit Link" : "Add New Link"}
                </h2>
                <p className="text-base text-slate-600 mt-1 font-medium">
                  {linkToEdit ? "Update your saved resource." : "Save useful links, resources, or references."}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100/50 rounded-full"
              >
                <X size={24} />
              </Button>
            </CardHeader>
            
            <CardContent className="p-6 pt-0 z-10 relative">
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  ref={titleRef}
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your link a descriptive title..."
                  required
                  className="bg-white/80 border-gray-200/60"
                />
                
                <Input
                  label="URL"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="example.com or https://example.com"
                  required
                  className="bg-white/80 border-gray-200/60"
                  helperText="No need to add https:// - we'll add it automatically"
                />
                
                <Textarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this link useful? (optional)"
                  rows={3}
                  className="bg-white/80 border-gray-200/60"
                />
                
                <div>
                  <Input
                    label="Tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="research, math, reference..."
                    className="bg-white/80 border-gray-200/60"
                    helperText="Separate tags with commas"
                  />
                  {tagList.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tagList.map((tag, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-200/50 flex items-center gap-1.5"
                        >
                          <TagIcon size={12} />
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
                      className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-xl"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex justify-between gap-3 pt-4">
                  {/* Delete Button for Edit Mode */}
                  {linkToEdit ? (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={deleteLoading}
                      onClick={handleDelete}
                      className="rounded-xl px-4 py-2 font-semibold text-red-600 border-red-200 hover:bg-red-50"
                    >
                      {deleteLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </>
                      )}
                    </Button>
                  ) : <div />}
                  
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="rounded-xl px-6 py-2 font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2 font-semibold shadow-lg"
                    >
                      {isLoading && <Loader2 size={16} className="animate-spin mr-2" />}
                      {linkToEdit ? "Update Link" : "Save Link"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};