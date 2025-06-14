import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Building2, BookOpen, Star, Calendar, Crown, Edit3, X, Camera, Sparkles, TrendingUp, Award, Settings, Shield, Bell, Globe } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../lib/store';

export const Profile: React.FC = () => {
  const { user, courses } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('John Doe');
  const [institution, setInstitution] = useState('University of Technology');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  useEffect(() => {
    if (user?.name) setFullName(user.name);
    if (user?.institution) setInstitution(user.institution);
  }, [user]);

  // Simulated data
  const activeDays = 45;
  const predictedGrade = 'A-';

  const handleSaveProfile = () => {
    // Here you would save the profile changes
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-400/5 to-cyan-400/5 rounded-full blur-3xl"
        />
      </div>

      {/* Edit Profile Button - Fixed in corner */}
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={`
            rounded-full w-12 h-12 shadow-lg border transition-all duration-300
            ${isEditing 
              ? 'bg-red-500 hover:bg-red-600 border-red-300 text-white' 
              : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:shadow-xl'
            }
          `}
          size="sm"
        >
          {isEditing ? <X size={18} /> : <Edit3 size={18} />}
        </Button>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Clean Profile Header - No Card Background */}
        <motion.div
          className="relative mb-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Enhanced Profile Picture with Glowing Ring */}
          <motion.div
            className="relative group mb-8 inline-block"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              {/* Multiple Glowing Rings */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-lg"
              />
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 opacity-30 blur-md"
              />
              
              {/* Main Avatar */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-2xl border-4 border-white">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  fullName.split(' ').map(n => n[0]).join('')
                )}
                
                {/* Inner Shine Effect */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/20 to-transparent" />
              </div>
              
              {/* Camera overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-black/60 via-black/40 to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-sm">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="flex flex-col items-center gap-2"
                >
                  <Camera size={24} className="text-white" />
                  <span className="text-xs text-white font-medium">Change Photo</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Name and Info - Clean Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {fullName}
            </h1>
            <p className="text-xl text-gray-600 mb-4 font-medium">{institution}</p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-100 via-blue-100 to-purple-100 rounded-full border border-emerald-200/50 shadow-lg backdrop-blur-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg"
              />
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Active Learner
              </span>
              <TrendingUp size={16} className="text-emerald-500" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Modern Stats Grid - No Card Backgrounds */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <StatCard
            icon={<BookOpen size={28} className="text-blue-600" />}
            title="Active Courses"
            value={courses.length}
            subtitle="Currently enrolled"
            gradient="from-blue-500/10 to-cyan-500/10"
            borderColor="border-blue-200/50"
            textColor="text-blue-600"
          />
          <StatCard
            icon={<Star size={28} className="text-amber-600" />}
            title="AI Predicted Grade"
            value={predictedGrade}
            subtitle="Based on performance"
            gradient="from-amber-500/10 to-orange-500/10"
            borderColor="border-amber-200/50"
            textColor="text-amber-600"
          />
          <StatCard
            icon={<Calendar size={28} className="text-purple-600" />}
            title="Study Streak"
            value={`${activeDays} days`}
            subtitle="Keep it up!"
            gradient="from-purple-500/10 to-pink-500/10"
            borderColor="border-purple-200/50"
            textColor="text-purple-600"
          />
        </motion.div>

        {/* Enhanced Subscription Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Subscription Plan
            </h2>
            <p className="text-gray-600">Choose the plan that fits your learning journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PlanCard
              title="Free Plan"
              description="Perfect for getting started"
              features={['Up to 3 courses', 'Basic AI assistance', 'Limited storage', 'Email Support']}
              price="$0"
              period="forever"
              current={true}
            />
            <PlanCard
              title="Pro Plan"
              description="Unlock your full potential"
              features={['Unlimited courses', 'Advanced AI features', 'Unlimited storage', 'Priority support']}
              price="$9.99"
              period="month"
              highlighted={true}
            />
          </div>
        </motion.div>
      </div>

      {/* Profile Settings Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Edit Profile
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User size={18} />}
                  fullWidth
                />
                <Input
                  label="Email"
                  value={user?.email || ''}
                  disabled
                  leftIcon={<Mail size={18} />}
                  fullWidth
                />
                <Input
                  label="Institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  leftIcon={<Building2 size={18} />}
                  fullWidth
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  fullWidth
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Clean Stat Card Component - No Background Cards
const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  gradient: string;
  borderColor: string;
  textColor: string;
}> = ({ icon, title, value, subtitle, gradient, borderColor, textColor }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    className={`
      relative p-8 rounded-2xl border-2 ${borderColor} 
      bg-gradient-to-br ${gradient} backdrop-blur-sm
      hover:shadow-xl transition-all duration-500 group
      text-center
    `}
  >
    {/* Decorative Elements */}
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />
    
    <motion.div 
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="inline-flex items-center justify-center mb-4"
    >
      {icon}
    </motion.div>
    
    <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
    <div className={`text-4xl font-bold ${textColor} mb-2`}>
      {value}
    </div>
    <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
  </motion.div>
);

// Clean Plan Card Component
const PlanCard: React.FC<{
  title: string;
  description: string;
  features: string[];
  price: string;
  period: string;
  current?: boolean;
  highlighted?: boolean;
}> = ({ title, description, features, price, period, current, highlighted }) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -5 }}
    className={`
      relative p-8 rounded-2xl border-2 transition-all duration-300 overflow-hidden
      ${highlighted 
        ? 'border-purple-300 bg-gradient-to-br from-purple-50/80 via-blue-50/80 to-cyan-50/80 shadow-xl backdrop-blur-sm' 
        : current
        ? 'border-emerald-300 bg-gradient-to-br from-emerald-50/80 via-green-50/80 to-teal-50/80 shadow-lg backdrop-blur-sm'
        : 'border-gray-200 bg-white/80 shadow-lg backdrop-blur-sm'
      }
    `}
  >
    {/* Background Decoration */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-xl" />
    
    {highlighted && (
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-2 right-2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg"

      >
        ⭐ RECOMMENDED
      </motion.div>
    )}
    
    <div className="relative text-center mb-6">
      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-gray-600 text-sm mb-6">{description}</p>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {price}
        </span>
        <span className="text-gray-500 font-medium">/{period}</span>
      </div>
    </div>

    <ul className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <motion.li 
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3 text-sm"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <span className="font-medium text-gray-700">{feature}</span>
        </motion.li>
      ))}
    </ul>

    <Button
      fullWidth
      variant={current ? "outline" : "primary"}
      className={
        current 
          ? "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100" 
          : highlighted
          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
          : "shadow-lg"
      }
    >
      {current ? "✓ Current Plan" : "Upgrade Now"}
    </Button>
  </motion.div>
);