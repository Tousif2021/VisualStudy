import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { signIn } from '../../lib/supabase';
import { useAppStore } from '../../lib/store';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        setError(error.message);
        return;
      }

      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.name,
          institution: data.user.institution,
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome back</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              fullWidth
              required
              leftIcon={<Mail size={18} className="text-gray-400" />}
              className="rounded-xl"
            />
          </div>
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              fullWidth
              required
              leftIcon={<Lock size={18} className="text-gray-400" />}
              className="rounded-xl"
            />
            <button
              type="button"
              className="absolute top-7 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword((show) => !show)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={loading}
            className="mt-2 rounded-xl font-semibold"
          >
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
