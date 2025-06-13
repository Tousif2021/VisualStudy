import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Lock, 
  Unlock, 
  Search, 
  Calendar, 
  Heart, 
  Smile, 
  Meh, 
  Frown,
  Edit2,
  Trash2,
  Settings,
  BookOpen,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { JournalEditor } from '../components/journal/JournalEditor';
import { PasscodeModal } from '../components/journal/PasscodeModal';
import { useAppStore } from '../lib/store';
import { 
  getJournalEntries, 
  deleteJournalEntry, 
  hasPasscode, 
  verifyPasscode,
  createOrUpdateJournalSettings 
} from '../lib/journal';
import type { JournalEntry } from '../lib/journal';

const moodIcons = {
  happy: { icon: <Smile size={16} />, color: 'text-green-500' },
  neutral: { icon: <Meh size={16} />, color: 'text-yellow-500' },
  sad: { icon: <Frown size={16} />, color: 'text-blue-500' },
  excited: { icon: <Heart size={16} />, color: 'text-pink-500' },
};

export const Journal: React.FC = () => {
  const { user } = useAppStore();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  const [hasPasscodeSet, setHasPasscodeSet] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeMode, setPasscodeMode] = useState<'setup' | 'verify'>('verify');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkPasscodeStatus();
    }
  }, [user]);

  const checkPasscodeStatus = async () => {
    if (!user) return;
    
    try {
      const hasCode = await hasPasscode(user.id);
      setHasPasscodeSet(hasCode);
      
      if (!hasCode) {
        setIsLocked(false);
        await loadEntries();
      }
    } catch (error) {
      console.error('Error checking passcode status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await getJournalEntries(user.id);
      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const handleUnlock = () => {
    if (hasPasscodeSet) {
      setPasscodeMode('verify');
      setShowPasscodeModal(true);
    } else {
      setPasscodeMode('setup');
      setShowPasscodeModal(true);
    }
  };

  const handlePasscodeSuccess = async (passcode?: string) => {
    if (passcodeMode === 'setup' && passcode && user) {
      try {
        await createOrUpdateJournalSettings(user.id, passcode);
        setHasPasscodeSet(true);
      } catch (error) {
        console.error('Error setting up passcode:', error);
        return;
      }
    }
    
    setIsLocked(false);
    setShowPasscodeModal(false);
    await loadEntries();
  };

  const handleVerifyPasscode = async (passcode: string): Promise<boolean> => {
    if (!user) return false;
    return await verifyPasscode(user.id, passcode);
  };

  const handleNewEntry = () => {
    setSelectedEntry(null);
    setShowEditor(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setShowEditor(true);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!window.confirm('Are you sure you want to delete this journal entry?')) return;
    
    try {
      const { error } = await deleteJournalEntry(entryId);
      if (error) throw error;
      await loadEntries();
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  const handleEditorSave = async () => {
    setShowEditor(false);
    setSelectedEntry(null);
    await loadEntries();
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BookOpen size={32} className="text-white" />
          </div>
          <p className="text-gray-600">Loading your journal...</p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Lock size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-amber-800 mb-4">Your Journal is Locked</h1>
          <p className="text-amber-600 mb-8">
            {hasPasscodeSet 
              ? 'Enter your passcode to access your private thoughts and memories.'
              : 'Set up a passcode to protect your journal and keep your thoughts private.'
            }
          </p>
          <Button
            onClick={handleUnlock}
            size="lg"
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            leftIcon={hasPasscodeSet ? <Unlock size={20} /> : <Lock size={20} />}
          >
            {hasPasscodeSet ? 'Unlock Journal' : 'Set Up Passcode'}
          </Button>
        </motion.div>

        <PasscodeModal
          isOpen={showPasscodeModal}
          mode={passcodeMode}
          onClose={() => setShowPasscodeModal(false)}
          onSuccess={handlePasscodeSuccess}
          onVerify={passcodeMode === 'verify' ? handleVerifyPasscode : undefined}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-amber-800 mb-2">My Journal</h1>
            <p className="text-amber-600">Your private space for thoughts and reflections</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsLocked(true)}
              variant="outline"
              size="sm"
              leftIcon={<Lock size={16} />}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Lock
            </Button>
            <Button
              onClick={handleNewEntry}
              leftIcon={<Plus size={16} />}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              New Entry
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your journal..."
              className="pl-10 border-amber-200 focus:border-amber-400"
            />
          </div>
        </div>

        {/* Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="h-full bg-gradient-to-br from-white to-amber-50 border-amber-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-amber-800 line-clamp-2 mb-1">
                          {entry.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-amber-600">
                          <Calendar size={12} />
                          {format(new Date(entry.created_at), 'MMM d, yyyy')}
                          {entry.mood && (
                            <>
                              <span>•</span>
                              <span className={`flex items-center gap-1 ${moodIcons[entry.mood as keyof typeof moodIcons]?.color}`}>
                                {moodIcons[entry.mood as keyof typeof moodIcons]?.icon}
                                {entry.mood}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditEntry(entry)}
                          className="text-amber-600 hover:bg-amber-100"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <p className="text-amber-700 text-sm line-clamp-4 mb-3">
                      {entry.content.substring(0, 150)}...
                    </p>
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-xs"
                          >
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                        {entry.tags.length > 3 && (
                          <span className="text-xs text-amber-600">
                            +{entry.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredEntries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-200 to-orange-200 flex items-center justify-center mx-auto mb-6">
              <BookOpen size={48} className="text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-amber-800 mb-2">
              {searchQuery ? 'No entries found' : 'Start your journal journey'}
            </h3>
            <p className="text-amber-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Capture your thoughts, feelings, and daily experiences'
              }
            </p>
            {!searchQuery && (
              <Button
                onClick={handleNewEntry}
                leftIcon={<Plus size={16} />}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                Write Your First Entry
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <JournalEditor
            entry={selectedEntry}
            onSave={handleEditorSave}
            onCancel={() => {
              setShowEditor(false);
              setSelectedEntry(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Passcode Modal */}
      <PasscodeModal
        isOpen={showPasscodeModal}
        mode={passcodeMode}
        onClose={() => setShowPasscodeModal(false)}
        onSuccess={handlePasscodeSuccess}
        onVerify={passcodeMode === 'verify' ? handleVerifyPasscode : undefined}
      />
    </div>
  );
};