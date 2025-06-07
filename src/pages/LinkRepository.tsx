import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Plus, Edit2, Trash2, Tag, Search, Filter } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { NewLinkForm } from '../components/links/NewLinkForm';
import { supabase } from '../lib/supabase';

interface ExternalLinkType {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  created_at: string;
}

export const LinkRepository: React.FC = () => {
  const [links, setLinks] = useState<ExternalLinkType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editLink, setEditLink] = useState<ExternalLinkType | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchLinks(); }, []);

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('external_links')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally { setIsLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    try {
      const { error } = await supabase
        .from('external_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLinks(links.filter(link => link.id !== id));
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  // Get unique tags from all links
  const allTags = Array.from(new Set(links.flatMap(link => link.tags)));

  // Filter links by selected tags and search query
  const filteredLinks = links.filter(link => {
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => link.tags.includes(tag));
    const matchesSearch = searchQuery === '' || 
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTags && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Link Repository</h1>
          <p className="text-gray-600 mt-1">Save and organize your useful links and resources</p>
        </div>
        <Button
          onClick={() => { setShowForm(true); setEditLink(null); }}
          leftIcon={<Plus size={18} />}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
        >
          Add Link
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search links by title, description, or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={18} />}
            className="bg-white/80"
          />
        </div>
        
        {allTags.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 5).map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTags(prev =>
                    prev.includes(tag)
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  )}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium
                    transition-all duration-200 border
                    ${selectedTags.includes(tag)
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }
                  `}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1.5 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {(showForm || editLink) && (
          <NewLinkForm
            onClose={() => { setShowForm(false); setEditLink(null); }}
            onSave={() => { setShowForm(false); setEditLink(null); fetchLinks(); }}
            linkToEdit={editLink}
          />
        )}
      </AnimatePresence>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredLinks.map(link => (
            <motion.div
              key={link.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Card hover className="h-full group bg-gradient-to-br from-white to-slate-50/50 border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{link.title}</h3>
                      <p className="text-sm text-blue-600 mb-2 truncate">{link.url}</p>
                      {link.description && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{link.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {link.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {link.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100"
                        >
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(link.url, '_blank')}
                      className="flex-1 mr-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                      leftIcon={<ExternalLink size={14} />}
                    >
                      Open
                    </Button>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditLink(link)}
                        className="text-gray-600 hover:bg-gray-100 p-2"
                        title="Edit Link"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(link.id)}
                        className="text-red-600 hover:bg-red-50 p-2"
                        title="Delete Link"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {!isLoading && filteredLinks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <ExternalLink size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery || selectedTags.length > 0 ? 'No links found' : 'No links yet'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchQuery || selectedTags.length > 0 
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Start building your link collection by adding your first useful resource.'
            }
          </p>
          {(!searchQuery && selectedTags.length === 0) && (
            <Button
              onClick={() => { setShowForm(true); setEditLink(null); }}
              leftIcon={<Plus size={16} />}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              Add Your First Link
            </Button>
          )}
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <Card className="h-48">
                <CardBody className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};