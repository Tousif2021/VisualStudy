import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Plus, Edit2, Trash2, Tag, Search, Filter } from 'lucide-react';
import NewLinkForm from '../components/links/NewLinkForm';
// PortalModal.tsx
import ReactDOM from 'react-dom';

const PortalModal = ({ children }: { children: React.ReactNode }) => {
  return ReactDOM.createPortal(
    children,
    document.body // attaches to the very end of <body>
  );
};

// Dummy data
const initialLinks = [
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
];

export const LinkRepository: React.FC = () => {
  const [links, setLinks] = useState(initialLinks);
  const [showForm, setShowForm] = useState(false);
  const [editLink, setEditLink] = useState<any | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Tag logic
  const allTags = Array.from(new Set(links.flatMap(link => link.tags)));

  const filteredLinks = links.filter(link => {
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => link.tags.includes(tag));
    const matchesSearch = searchQuery === '' ||
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTags && matchesSearch;
  });

  // Add or update link
  const handleSave = (newLink?: any) => {
    if (editLink) {
      setLinks(prev => prev.map(l => l.id === editLink.id ? { ...l, ...newLink } : l));
    } else if (newLink) {
      setLinks(prev => [{ ...newLink }, ...prev]);
    }
    setShowForm(false);
    setEditLink(null);
  };

  // Delete link
  const handleDelete = (id: string) => {
    if (window.confirm('Delete this link?')) setLinks(links.filter(link => link.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/40">
      <div className="max-w-5xl mx-auto p-6 space-y-10">
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
            <p className="text-gray-600 text-lg">Bookmark and organize your favorite links 🎯</p>
          </div>
          <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setShowForm(true); setEditLink(null); }}
              className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-xl flex items-center gap-2 transition-all duration-300 border-2 border-blue-700"
            >
              <Plus size={18} />
              Add Link
            </motion.button>


        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.07 }}
          className="flex flex-col md:flex-row gap-4 bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/30 shadow-lg"
        >
          <div className="flex-1">
            <div className="relative group">
              <Search size={17} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />
              <input
                placeholder="Search links..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-3 text-base rounded-full border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white/80"
              />
            </div>
          </div>
          {allTags.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <Filter size={17} className="text-gray-500" />
              {allTags.slice(0, 6).map(tag => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                  className={`px-3 py-1 rounded-lg font-medium border ${
                    selectedTags.includes(tag)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow'
                      : 'bg-white/80 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  } text-xs`}
                >
                  <Tag size={10} className="mr-1" />
                  {tag}
                </motion.button>
              ))}
              {selectedTags.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1 rounded-lg font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition text-xs"
                >
                  Clear
                </motion.button>
              )}
            </div>
          )}
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          <AnimatePresence>
            {filteredLinks.map((link, idx) => (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.96 }}
                transition={{ duration: 0.3, delay: idx * 0.07 }}
                whileHover={{ y: -5, scale: 1.025 }}
                className="group"
              >
                <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-400 overflow-hidden flex flex-col h-full">
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{link.title}</h3>
                      <p className="text-xs text-blue-600 mb-1 truncate font-semibold">{link.url}</p>
                      {link.description && (
                        <p className="text-gray-600 text-xs line-clamp-3 mb-2">{link.description}</p>
                      )}
                    </div>
                    {/* Tags */}
                    {link.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {link.tags.map((tag, i) => (
                          <motion.span
                            key={tag}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-[11px] font-semibold border border-blue-200/60"
                          >
                            <Tag size={9} />
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-2 px-5 pb-4 pt-2 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => window.open(link.url, '_blank')}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg flex items-center justify-center gap-1 shadow-lg hover:shadow-xl text-xs"
                    >
                      <ExternalLink size={13} />
                      Open
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditLink(link)}
                      className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 flex items-center justify-center transition text-xs"
                    >
                      <Edit2 size={13} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(link.id)}
                      className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 flex items-center justify-center transition text-xs"
                    >
                      <Trash2 size={13} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {(showForm || editLink) && (
            <NewLinkForm
              onClose={() => { setShowForm(false); setEditLink(null); }}
              onSave={handleSave}
              linkToEdit={editLink}
            />
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredLinks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100 rounded-full flex items-center justify-center shadow-xl">
              <ExternalLink size={32} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Links Found</h3>
            <p className="text-gray-600 mb-6 text-xs">Start building your collection by adding a new link.</p>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto text-xs"
            >
              <Plus size={14} />
              Add Your First Link
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LinkRepository;