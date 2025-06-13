import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSetPasscode: (passcode: string) => void;
  hasExistingPasscode: boolean;
}

export function PasscodeModal({ isOpen, onClose, onSuccess, onSetPasscode, hasExistingPasscode }: PasscodeModalProps) {
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isSettingPasscode, setIsSettingPasscode] = useState(!hasExistingPasscode);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSettingPasscode) {
        // Setting new passcode
        if (passcode.length < 4) {
          setError('Passcode must be at least 4 characters');
          return;
        }
        if (passcode !== confirmPasscode) {
          setError('Passcodes do not match');
          return;
        }
        await onSetPasscode(passcode);
      } else {
        // Verifying existing passcode
        const { data: settings } = await supabase
          .from('journal_settings')
          .select('passcode_hash')
          .single();

        if (!settings?.passcode_hash) {
          setError('No passcode found');
          return;
        }

        // Simple verification (in production, use proper hashing)
        const hashedInput = btoa(passcode);
        if (hashedInput === settings.passcode_hash) {
          onSuccess();
        } else {
          setError('Incorrect passcode');
        }
      }
    } catch (err) {
      console.error('Passcode error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPasscode('');
    setConfirmPasscode('');
    setError('');
    setShowPasscode(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isSettingPasscode ? 'Set Journal Passcode' : 'Enter Passcode'}
            </h2>
            <p className="text-blue-600">
              {isSettingPasscode 
                ? 'Protect your journal with a secure passcode'
                : 'Enter your passcode to access your journal'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isSettingPasscode ? 'Create Passcode' : 'Passcode'}
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder={isSettingPasscode ? 'Enter new passcode' : 'Enter passcode'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
                >
                  {showPasscode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {isSettingPasscode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Confirm passcode"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex space-x-3">
              {hasExistingPasscode && !isSettingPasscode && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingPasscode(true);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Change Passcode
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                ) : (
                  isSettingPasscode ? 'Set Passcode' : 'Unlock'
                )}
              </button>
            </div>

            {!hasExistingPasscode && (
              <button
                type="button"
                onClick={onSuccess}
                className="w-full text-blue-600 hover:text-blue-700 text-sm"
              >
                Skip for now
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}