import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '../../components/ui/CInput';
import { Button } from '../../components/ui/cButton';
import { signUp } from '../../lib/supabase';
import { useAppStore } from '../../lib/store';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await signUp(email, password, fullName);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: fullName
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-8 rounded-lg shadow-md w-full"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create your account</h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          fullWidth
          required
          leftIcon={<User size={18} className="text-gray-400" />}
        />

        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          fullWidth
          required
          leftIcon={<Mail size={18} className="text-gray-400" />}
        />
        
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          fullWidth
          required
          leftIcon={<Lock size={18} className="text-gray-400" />}
          helperText="Password must be at least 6 characters"
        />
        
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          fullWidth
          required
          leftIcon={<Lock size={18} className="text-gray-400" />}
        />
        
        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={loading}
          className="mt-2"
        >
          Sign up
        </Button>
      </form>
      
      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
};