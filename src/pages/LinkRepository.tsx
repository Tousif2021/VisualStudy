import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Plus, Edit2, Trash2, Tag, Search, Filter, X, Globe, Bookmark, Sparkles, ArrowRight, Check, Link as LinkIcon, Star, Zap } from 'lucide-react';

interface ExternalLinkType {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  created_at: string;
}

interface NewLinkFormProps {
  onClose: () => void;
  onSave: () => void;
  linkToEdit?: ExternalLinkType | null;
}

const NewLinkForm: React.FC<NewLinkFormProps> = ({ onClose, onSave, linkToEdit }) => {
  const [formData, setFormData] = useState({
    title: linkToEdit?.title || '',
    url: linkToEdit?.url || '',
    description: linkToEdit?.description || '',
    tags: linkToEdit?.tags || []
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowSuccess(true);
    setTimeout(() => {
      onSave();
    }, 1000);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }));
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const suggestedTags = ['Tutorial', 'Documentation', 'Tool', 'Reference', 'Article', 'Video', 'Course', 'GitHub'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="relative w-full max-w-2xl"
      >
        {/* Animated Background Elements */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-xl animate-pulse"></div>
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-2xl blur-lg"></div>
        
        {/* Main Form Container */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300"
            >
              <X size={20} />
            </motion.button>
            
            <div className="relative flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Sparkles size={28} />
              </motion.div>
              <div>
                <motion.h2
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold mb-2"
                >
                  {linkToEdit ? 'Edit Link' : 'Add New Link'}
                </motion.h2>
                <motion.p
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/80"
                >
                  Save your favorite resources and organize them with style
                </motion.p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex gap-2 mt-6">
              {[1, 2, 3].map((num) => (
                <motion.div
                  key={num}
                  className={`h-1 rounded-full flex-1 ${
                    num <= step ? 'bg-white' : 'bg-white/30'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: num <= step ? 1 : 0.3 }}
                  transition={{ duration: 0.5, delay: num * 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {!showSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* URL Input */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3"
                  >
                    <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Globe className="text-blue-600" size={20} />
                      Website URL
                    </label>
                    <div className="relative group">
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, url: e.target.value }));
                          if (e.target.value) setStep(Math.max(step, 1));
                        }}
                        placeholder="https://example.com"
                        className="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-gray-50/50 hover:bg-white group-hover:shadow-lg"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-cyan-500/0 group-focus-within:from-blue-500/10 group-focus-within:via-purple-500/10 group-focus-within:to-cyan-500/10 transition-all duration-300 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  {/* Title Input */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Bookmark className="text-purple-600" size={20} />
                      Link Title
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, title: e.target.value }));
                          if (e.target.value) setStep(Math.max(step, 2));
                        }}
                        placeholder="Give your link a memorable title..."
                        className="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 bg-gray-50/50 hover:bg-white group-hover:shadow-lg"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Description Input */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Edit2 className="text-cyan-600" size={20} />
                      Description (Optional)
                    </label>
                    <div className="relative group">
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what makes this link useful..."
                        rows={3}
                        className="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 bg-gray-50/50 hover:bg-white group-hover:shadow-lg resize-none"
                      />
                    </div>
                  </motion.div>

                  {/* Tags Section */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Tag className="text-green-600" size={20} />
                      Tags
                    </label>
                    
                    {/* Current Tags */}
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <motion.span
                            key={tag}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Star size={12} />
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    )}

                    {/* Tag Input */}
                    <div className="relative group">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => {
                          setCurrentTag(e.target.value);
                          if (formData.tags.length > 0) setStep(Math.max(step, 3));
                        }}
                        onKeyDown={addTag}
                        placeholder="Type a tag and press Enter..."
                        className="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 bg-gray-50/50 hover:bg-white group-hover:shadow-lg"
                      />
                    </div>

                    {/* Suggested Tags */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-medium">Suggested tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags.filter(tag => !formData.tags.includes(tag)).map((tag) => (
                          <motion.button
                            key={tag}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))}
                            className="px-3 py-1.5 text-sm bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 text-gray-700 hover:text-blue-700 rounded-full border border-gray-300 hover:border-blue-300 transition-all duration-300"
                          >
                            + {tag}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="pt-6"
                  >
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !formData.url || !formData.title}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full relative px-8 py-4 text-lg font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Zap size={20} />
                            </motion.div>
                            Saving Link...
                          </>
                        ) : (
                          <>
                            <LinkIcon size={20} />
                            {linkToEdit ? 'Update Link' : 'Save Link'}
                            <ArrowRight size={20} />
                          </>
                        )}
                      </div>
                    </motion.button>
                  </motion.div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl"
                  >
                    <Check size={40} className="text-white" />
                  </motion.div>
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-gray-900 mb-2"
                  >
                    Link Saved Successfully!
                  </motion.h3>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600"
                  >
                    Your link has been added to your repository
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const LinkRepository: React.FC = () => {
  const [links, setLinks] = useState<ExternalLinkType[]>([
    {
      id: '1',
      title: 'React Documentation',
      url: 'https://react.dev',
      description: 'Official React documentation with guides and API reference',
      tags: ['React', 'Documentation', 'JavaScript'],
      created_at: '2024-01-15'
    },
    {
      id: '2',
      title: 'Tailwind CSS',
      url: 'https://tailwindcss.com',
      description: 'A utility-first CSS framework for rapid UI development',
      tags: ['CSS', 'Framework', 'Design'],
      created_at: '2024-01-14'
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editLink, setEditLink] = useState<ExternalLinkType | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    setLinks(links.filter(link => link.id !== id));
  };

  const allTags = Array.from(new Set(links.flatMap(link => link.tags)));

  const filteredLinks = links.filter(link => {
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => link.tags.includes(tag));
    const matchesSearch = searchQuery === '' || 
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTags && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Link Repository
            </h1>
            <p className="text-gray-600 text-lg">Save and organize your useful links and resources</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowForm(true); setEditLink(null); }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300"
          >
            <Plus size={20} />
            Add Link
          </motion.button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-6 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <div className="flex-1">
            <div className="relative group">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                placeholder="Search links by title, description, or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/80"
              />
            </div>
          </div>
          
          {allTags.length > 0 && (
            <div className="flex items-center gap-4">
              <Filter size={20} className="text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 5).map(tag => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTags(prev =>
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    )}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 border-2 ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg'
                        : 'bg-white/80 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {tag}
                  </motion.button>
                ))}
                {selectedTags.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTags([])}
                    className="px-4 py-2 rounded-xl font-medium text-red-600 hover:bg-red-50 border-2 border-red-200 hover:border-red-300 transition-all duration-300"
                  >
                    Clear
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredLinks.map((link, index) => (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className="h-full bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {link.title}
                        </h3>
                        <p className="text-sm text-blue-600 mb-3 truncate font-medium">{link.url}</p>
                        {link.description && (
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4">{link.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {link.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {link.tags.map((tag, tagIndex) => (
                          <motion.span
                            key={tag}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 + tagIndex * 0.05 }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-semibold border border-blue-200/50"
                          >
                            <Tag size={10} />
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(link.url, '_blank')}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <ExternalLink size={16} />
                        Open
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditLink(link)}
                        className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 flex items-center justify-center transition-all duration-300"
                      >
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(link.id)}
                        className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 flex items-center justify-center transition-all duration-300"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {(showForm || editLink) && (
            <NewLinkForm
              onClose={() => { setShowForm(false); setEditLink(null); }}
              onSave={() => { setShowForm(false); setEditLink(null); }}
              linkToEdit={editLink}
            />
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && filteredLinks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100 rounded-full flex items-center justify-center shadow-xl">
              <ExternalLink size={48} className="text-blue-600" />