import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Tag,
  Lock,
  Unlock,
  Settings,
  BookOpen,
  Heart,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { 
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getJournalSettings,
  createOrUpdateJournalSettings,
  verifyPasscode,
  hasPasscode,
  JournalEntry,
  JournalSettings
} from '../lib/journal';
import { JournalEditor } from '../components/journal/JournalEditor';
import { PasscodeModal } from '../components/journal/PasscodeModal';

const moodEmojis = {
  happy: { icon: Smile, color: 'text-green-500', bg: 'bg-green-50' },
  sad: { icon: Frown, color: 'text-blue-500', bg: 'bg-blue-50' },
  neutral: { icon: Meh, color: 'text-gray-500', bg: 'bg-gray-50' },
  excited: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' }
};

export function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [settings, setSettings] = useState<JournalSettings | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeJournal();
    // eslint-disable-next-line
  }, []);

  const initializeJournal = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setError('User not authenticated');
        return;
      }

      await loadSettings();
      
      // Check if user has a passcode
      const userHasPasscode = await hasPasscode(user.user.id);
      
      if (userHasPasscode) {
        setShowPasscodeModal(true);
      } else {
        setIsUnlocked(true);
        await loadEntries();
      }
    } catch (err) {
      console.error('Error initializing journal:', err);
      setError('Failed to initialize journal. Please ensure the database tables are created.');
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setError('User not authenticated');
        return;
      }

      const { data, error } = await getJournalSettings(user.user.id);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      } else {
        // Create default settings
        const { data: newSettings, error: createError } = await createOrUpdateJournalSettings(
          user.user.id,
          undefined,
          30
        );

        if (createError) throw createError;
        setSettings(newSettings?.[0] || null);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load journal settings. Please ensure the database tables are created.');
    }
  };

  const loadEntries = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await getJournalEntries(user.user.id);

      if (error) {
        throw error;
      }

      setEntries(data || []);
    } catch (err) {
      console.error('Error loading journal entries:', err);
      setError('Failed to load journal entries. Please ensure the database tables are created.');
    }
  };

  const handlePasscodeSuccess = async () => {
    setShowPasscodeModal(false);
    setIsUnlocked(true);
    await loadEntries();
  };

  const handleSetPasscode = async (passcode: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setError('User not authenticated');
        return;
      }

      const { data, error } = await createOrUpdateJournalSettings(
        user.user.id,
        passcode,
        settings?.auto_lock_minutes || 30
      );

      if (error) throw error;

      await loadSettings();
      setShowPasscodeModal(false);
      setIsUnlocked(true);
    } catch (err) {
      console.error('Error setting passcode:', err);
      setError('Failed to set passcode');
    }
  };

  const handleSaveEntry = async (entryData: Partial<JournalEntry>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      if (selectedEntry) {
        const { error } = await updateJournalEntry(
          selectedEntry.id,
          entryData.title || '',
          entryData.content || '',
          entryData.mood,
          entryData.tags || []
        );

        if (error) throw error;
      } else {
        const { error } = await createJournalEntry(
          user.user.id,
          entryData.title || '',
          entryData.content || '',
          entryData.mood,
          entryData.tags || []
        );

        if (error) throw error;
      }

      await loadEntries();
      setShowEditor(false);
      setSelectedEntry(null);
    } catch (err) {
      console.error('Error saving entry:', err);
      setError('Failed to save journal entry');
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await deleteJournalEntry(entryId);

      if (error) throw error;

      await loadEntries();
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError('Failed to delete journal entry');
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = !selectedMood || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600">Loading your journal...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes('database tables')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Database Setup Required</h2>
            <p className="text-gray-600">The journal feature requires database tables to be created.</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">Quick Setup Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Open your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Supabase Dashboard</a></li>
              <li>Navigate to "SQL Editor" in the left sidebar</li>
              <li>Copy the SQL code from the setup instructions</li>
              <li>Paste and run it in the SQL Editor</li>
              <li>Refresh this page</li>
            </ol>
          </div>

          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <PasscodeModal
          isOpen={showPasscodeModal}
          onClose={() => setShowPasscodeModal(false)}
          onSuccess={handlePasscodeSuccess}
          onSetPasscode={handleSetPasscode}
          hasExistingPasscode={!!settings?.passcode_hash}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Journal</h1>
              <p className="text-blue-600">Capture your thoughts and memories</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Lock Button */}
            <button
              onClick={() => setShowPasscodeModal(true)}
              className="flex items-center justify-center bg-white shadow-md border border-blue-200 hover:bg-blue-100 transition-colors rounded-full w-12 h-12"
              title="Lock journal"
              aria-label="Lock journal"
            >
              <Lock className="h-5 w-5 text-blue-600" />
              <span className="sr-only">Lock</span>
            </button>
            {/* New Entry FAB */}
            <button
              onClick={() => {
                setSelectedEntry(null);
                setShowEditor(true);
              }}
              className="flex items-center justify-center bg-blue-600 shadow-lg hover:bg-blue-700 transition-colors rounded-full w-12 h-12"
              title="New Entry"
              aria-label="New Entry"
            >
              <Plus className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {error && !error.includes('database tables') && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                {/* Lock Button as text, as per your request */}
                <button
                  onClick={() => setShowPasscodeModal(true)}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-1 shadow hover:bg-blue-700 transition-colors z-10"
                  style={{ left: '-110px', minWidth: '80px' }}
                >
                  <Lock className="h-4 w-4" />
                  Lock
                </button>
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Mood:</span>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All moods</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="neutral">Neutral</option>
                <option value="excited">Excited</option>
              </select>
            </div>
          </div>
        </div>

        {/* Entries Grid */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No entries yet</h3>
            <p className="text-blue-600 mb-6">Start writing your first journal entry</p>
            <button
              onClick={() => {
                setSelectedEntry(null);
                setShowEditor(true);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Entry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => {
              const MoodIcon = entry.mood ? moodEmojis[entry.mood as keyof typeof moodEmojis]?.icon : null;
              const moodConfig = entry.mood ? moodEmojis[entry.mood as keyof typeof moodEmojis] : null;

              return (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedEntry(entry);
                    setShowEditor(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 truncate flex-1">{entry.title}</h3>
                    <div className="flex items-center space-x-2 ml-2">
                      {MoodIcon && moodConfig && (
                        <div className={`p-1 rounded-full ${moodConfig.bg}`}>
                          <MoodIcon className={`h-4 w-4 ${moodConfig.color}`} />
                        </div>
                      )}
                      {entry.is_locked && (
                        <Lock className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {entry.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-blue-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                    </div>
                    {entry.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>{entry.tags.length} tags</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Editor Modal */}
        {showEditor && (
          <JournalEditor
            entry={selectedEntry}
            onSave={handleSaveEntry}
            onDelete={selectedEntry ? () => handleDeleteEntry(selectedEntry.id) : undefined}
            onClose={() => {
              setShowEditor(false);
              setSelectedEntry(null);
            }}
          />
        )}

        {/* Passcode Modal */}
        <PasscodeModal
          isOpen={showPasscodeModal}
          onClose={() => setShowPasscodeModal(false)}
          onSuccess={handlePasscodeSuccess}
          onSetPasscode={handleSetPasscode}
          hasExistingPasscode={!!settings?.passcode_hash}
        />
      </div>
    </div>
  );
}