import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { verifyPasscode } from '../../lib/journal';

interface PasscodeModalProps {
  isOpen: boolean;
  mode: 'setup' | 'verify';
  onClose: () => void;
  onSuccess: (passcode?: string) => void;
  onVerify?: (passcode: string) => Promise<boolean>;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSuccess,
  onVerify
}) => {
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'setup') {
        if (passcode.length < 4) {
          setError('Passcode must be at least 4 characters');
          return;
        }
        if (passcode !== confirmPasscode) {
          setError('Passcodes do not match');
          return;
        }
        onSuccess(passcode);
      } else if (mode === 'verify' && onVerify) {
        const isValid = await onVerify(passcode);
        if (isValid) {
          onSuccess();
        } else {
          setError('Invalid passcode');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
            {mode === 'setup' ? <Shield size={32} className="text-white" /> : <Lock size={32} className="text-white" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {mode === 'setup' ? 'Set Up Passcode' : 'Enter Passcode'}
          </h2>
          <p className="text-gray-600">
            {mode === 'setup' 
              ? 'Protect your journal with a secure passcode'
              : 'Enter your passcode to access your journal'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPasscode ? 'text' : 'password'}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder={mode === 'setup' ? 'Create passcode' : 'Enter passcode'}
              className="pr-12"
              fullWidth
              leftIcon={<Lock size={18} />}
            />
            <button
              type="button"
              onClick={() => setShowPasscode(!showPasscode)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {mode === 'setup' && (
            <Input
              type={showPasscode ? 'text' : 'password'}
              value={confirmPasscode}
              onChange={(e) => setConfirmPasscode(e.target.value)}
              placeholder="Confirm passcode"
              fullWidth
              leftIcon={<Unlock size={18} />}
            />
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              disabled={!passcode || (mode === 'setup' && !confirmPasscode)}
              fullWidth
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {mode === 'setup' ? 'Set Passcode' : 'Unlock'}
            </Button>
          </div>
        </form>

        {mode === 'setup' && (
          <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <strong>Note:</strong> Make sure to remember your passcode. There's no way to recover it if forgotten.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};