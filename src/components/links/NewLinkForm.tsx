import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../lib/store';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Basic URL validation
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
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
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
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Add New Link</h2>
        <Button
          variant="icon"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </Button>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for this link..."
            required
          />

          <Input
            label="URL"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            rows={3}
          />

          <Input
            label="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags separated by commas..."
            helperText="Example: research, math, reference"
          />

          {error && (
            <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
            >
              Save Link
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};