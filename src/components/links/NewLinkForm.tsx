import React, { useState, useRef, useEffect } from 'react';
import { X, Tag as TagIcon, Loader2, Trash2, Bookmark, Globe, Edit2, Star, ArrowRight, Zap, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewLinkFormProps {
  onClose: () => void;
  onSave: (newLink?: any) => void;
  linkToEdit?: any | null;
}

export const NewLinkForm: React.FC<NewLinkFormProps> = ({ onClose, onSave, linkToEdit }) => {
  // Form state
  const [title, setTitle] = useState(linkToEdit?.title ?? '');
  const [url, setUrl] = useState(linkToEdit?.url ?? '');
  const [description, setDescription] = useState(linkToEdit?.description ?? '');
  const [tags, setTags] = useState<string[]>(linkToEdit?.tags ?? []);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Focus
  const titleRef = useRef<HTMLInputElement>(null);
  useEffect(() => { titleRef.current?.focus(); }, []);

  // Tag helpers
  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };
  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  // Simulated submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(res => setTimeout(res, 1200));
    setShowSuccess(true);
    setTimeout(() => {
      onSave({
        title,
        url,
        description,
        tags,
        id: linkToEdit?.id ?? Math.random().toString(36).slice(2),
        created_at: new Date().toISOString(),
      });
    }, 900);
  };

  // UI
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.13 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3"
        style={{
          background: 'linear-gradient(120deg, rgba(99,102,241,0.20) 0%, rgba(168,85,247,0.17) 100%)',
          backdropFilter: 'blur(12px)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.25, ease: "circOut" }}
          className="relative mx-auto w-full max-w-xs sm:max-w-md"
          onClick={e => e.stopPropagation()}
        >
          {/* Background flare */}
          <div className="absolute -inset-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.25, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-tr from-blue-400 via-indigo-300 to-purple-400 blur-3xl rounded-2xl animate-pulse"
            />
          </div>

          {/* Modal card */}
          <div className="relative rounded-2xl shadow-2xl bg-white/95 border border-white/40 p-6 px-5 sm:px-8 overflow-hidden">
            {/* Close btn */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-gray-100/70 hover:bg-gray-200 rounded-full text-gray-500 hover:text-blue-600 transition"
            >
              <X size={22} />
            </button>
            {/* Title */}
            <div className="mb-5 flex items-center gap-2.5">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"
              >
                <Sparkles className="text-blue-500" size={18} />
              </motion.div>
              <h2 className="font-bold text-xl text-blue-700 tracking-tight">{linkToEdit ? "Edit Link" : "Add Link"}</h2>
            </div>
            <p className="mb-4 text-xs font-medium text-gray-500 leading-tight">{linkToEdit ? "Update your saved resource." : "Save your fav links. Keep 'em all in one place."}</p>

            {/* Success */}
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.16, type: "spring", duration: 0.7 }}
                  className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl mb-3"
                >
                  <Check size={40} className="text-white" />
                </motion.div>
                <span className="text-lg font-bold text-gray-900 mb-2">Link Saved!</span>
                <span className="text-gray-500 text-sm">All done 🚀</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* URL */}
                <div>
                  <label className="font-medium flex items-center gap-1.5 text-blue-600 text-sm"><Globe size={16}/>URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="block w-full rounded-lg px-3 py-2 mt-1 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 text-sm"
                    required
                  />
                </div>
                {/* Title */}
                <div>
                  <label className="font-medium flex items-center gap-1.5 text-purple-600 text-sm"><Bookmark size={16}/>Title</label>
                  <input
                    ref={titleRef}
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Give your link a name..."
                    className="block w-full rounded-lg px-3 py-2 mt-1 border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-gray-50 text-sm"
                    required
                  />
                </div>
                {/* Desc */}
                <div>
                  <label className="font-medium flex items-center gap-1.5 text-cyan-600 text-sm"><Edit2 size={16}/>Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Why save this? (optional)"
                    rows={2}
                    className="block w-full rounded-lg px-3 py-2 mt-1 border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-gray-50 text-sm resize-none"
                  />
                </div>
                {/* Tags */}
                <div>
                  <label className="font-medium flex items-center gap-1.5 text-green-600 text-sm"><TagIcon size={15}/>Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1 mb-1">
                    {tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-blue-200 to-purple-200 text-xs text-blue-700 rounded-full border border-blue-200/60">
                        <Star size={10} /> {tag}
                        <button type="button" className="ml-1 text-gray-400 hover:text-red-500" onClick={() => removeTag(tag)}>
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={currentTag}
                    onChange={e => setCurrentTag(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Add tag, press Enter"
                    className="block w-full rounded-lg px-3 py-2 border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-gray-50 text-xs"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2 flex flex-col gap-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !url || !title}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-white text-base bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 shadow-lg transition-all duration-200"
                  >
                    {isSubmitting
                      ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}><Zap size={17}/></motion.div>
                      : <ArrowRight size={17}/>}
                    {linkToEdit ? "Update Link" : "Save Link"}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NewLinkForm;
