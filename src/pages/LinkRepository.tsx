import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
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

  // Get unique tags from all links
  const allTags = Array.from(new Set(links.flatMap(link => link.tags)));

  // Filter links by selected tags
  const filteredLinks = links.filter(link =>
    selectedTags.length === 0 || selectedTags.some(tag => link.tags.includes(tag))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Link Repository</h1>
        <Button
          onClick={() => { setShowForm(true); setEditLink(null); }}
          leftIcon={<Plus size={16} />}
        >
          Add Link
        </Button>
      </div>
      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTags(prev =>
                prev.includes(tag)
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              )}
              className={`
                px-3 py-1 rounded-full text-sm font-medium
                transition-colors duration-200
                ${selectedTags.includes(tag)
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="px-3 py-1 rounded-full text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {(showForm || editLink) && (
        <NewLinkForm
          onClose={() => { setShowForm(false); setEditLink(null); }}
          onSave={() => { setShowForm(false); setEditLink(null); fetchLinks(); }}
          linkToEdit={editLink}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLinks.map(link => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card hover className="h-full border-none shadow-xl rounded-2xl bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-xl">
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{link.title}</h3>
                    {link.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{link.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="icon"
                      size="sm"
                      onClick={() => window.open(link.url, '_blank')}
                      className="text-blue-600 hover:bg-blue-50"
                      title="Open Link"
                    >
                      <ExternalLink size={16} />
                    </Button>
                    <Button
                      variant="icon"
                      size="sm"
                      onClick={() => setEditLink(link)}
                      className="text-gray-600 hover:bg-gray-200"
                      title="Edit Link"
                    >
                      <Edit2 size={16} />
                    </Button>
                  </div>
                </div>
                {link.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {link.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-100"
                      >
                        <Tag size={12} />{tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
      {!isLoading && filteredLinks.length === 0 && (
        <div className="text-center py-12">
          <ExternalLink size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
          <p className="text-gray-500 mb-4">Start by adding your first link</p>
          <Button
            onClick={() => { setShowForm(true); setEditLink(null); }}
            leftIcon={<Plus size={16} />}
          >
            Add Link
          </Button>
        </div>
      )}
    </div>
  );
};
