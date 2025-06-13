import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: string;
  tags: string[];
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface JournalSettings {
  id: string;
  user_id: string;
  passcode_hash?: string;
  auto_lock_minutes: number;
  created_at: string;
  updated_at: string;
}

// Journal Entries
export const getJournalEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const createJournalEntry = async (
  userId: string,
  title: string,
  content: string,
  mood?: string,
  tags: string[] = []
) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([{
      user_id: userId,
      title,
      content,
      mood,
      tags,
      is_locked: false
    }])
    .select();
  
  return { data, error };
};

export const updateJournalEntry = async (
  entryId: string,
  title: string,
  content: string,
  mood?: string,
  tags: string[] = []
) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .update({
      title,
      content,
      mood,
      tags,
      updated_at: new Date().toISOString()
    })
    .eq('id', entryId)
    .select();
  
  return { data, error };
};

export const deleteJournalEntry = async (entryId: string) => {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId);
  
  return { error };
};

// Journal Settings
export const getJournalSettings = async (userId: string) => {
  const { data, error } = await supabase
    .from('journal_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
};

export const createOrUpdateJournalSettings = async (
  userId: string,
  passcode?: string,
  autoLockMinutes: number = 30
) => {
  let passcodeHash = undefined;
  if (passcode) {
    passcodeHash = await bcrypt.hash(passcode, 10);
  }

  const { data, error } = await supabase
    .from('journal_settings')
    .upsert({
      user_id: userId,
      passcode_hash: passcodeHash,
      auto_lock_minutes: autoLockMinutes
    }, {
      onConflict: 'user_id'
    })
    .select();
  
  return { data, error };
};

export const verifyPasscode = async (userId: string, passcode: string): Promise<boolean> => {
  const { data, error } = await getJournalSettings(userId);
  
  if (error || !data?.passcode_hash) {
    return false;
  }
  
  return await bcrypt.compare(passcode, data.passcode_hash);
};

export const hasPasscode = async (userId: string): Promise<boolean> => {
  const { data, error } = await getJournalSettings(userId);
  return !error && !!data?.passcode_hash;
};