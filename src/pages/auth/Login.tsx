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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-indigo-200 via-blue-100 to-purple-200">
      {/* Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md rounded-2xl shadow-xl backdrop-blur-xl bg-white/70 border border-gray-200 p-8"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png" // your logo path
            alt="VisualStudy"
            className="h-12 w-12 rounded-full shadow"
          />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-1 text-center">Welcome back 👋</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Sign in to your VisualStudy account</p>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            fullWidth
            required
            leftIcon={<Mail size={18} className="text-gray-400" />}
          />

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

          <div className="flex justify-between text-xs text-blue-600 mb-2">
            <Link to="/auth/forgot" className="hover:underline">
              Forgot password?
            </Link>
            {/* Optional: add support/help */}
            {/* <a href="mailto:support@visualstudy.com" className="hover:underline">
              Need help?
            </a> */}
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={loading}
            className="mt-2 font-bold"
          >
            Sign in
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </Link>
        </div>
        <div className="mt-4 flex items-center gap-2 justify-center">
          <span className="h-px w-10 bg-gray-300" />
          <span className="text-gray-400 text-xs">or</span>
          <span className="h-px w-10 bg-gray-300" />
        </div>
        {/* Future: Social buttons */}
        {/* <div className="flex gap-3 mt-4 justify-center">
          <Button variant="outline" className="w-full" leftIcon={<GoogleIcon />}>Sign in with Google</Button>
        </div> */}
      </motion.div>
    </div>
  );
};
