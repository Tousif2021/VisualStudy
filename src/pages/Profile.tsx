import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Building2, BookOpen, Star, Calendar, Crown, Edit3, X, Camera, Sparkles, TrendingUp, Award, MapPin, Shield, Zap, CheckCircle } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'blue' | 'purple' | 'green' | 'orange' | 'pink'>('blue');
  
  useEffect(() => {
    if (user?.name) setFullName(user.name);
    if (user?.institution) setInstitution(user.institution);
  }, [user]);

  // Simulated data
  const activeDays = 45;
  const predictedGrade = 'A-';
  const followerCount = 1250;
  const location = 'San Francisco, CA';

  const gradientThemes = {
    blue: 'from-blue-500 via-purple-500 to-pink-500',
    purple: 'from-purple-600 via-pink-500 to-red-500',
    green: 'from-emerald-500 via-teal-500 to-cyan-500',
    orange: 'from-orange-500 via-red-500 to-pink-500',
    pink: 'from-pink-500 via-rose-500 to-red-500'
  };

  const themes = [
    { name: 'blue', color: 'bg-blue-500' },
    { name: 'purple', color: 'bg-purple-500' },
    { name: 'green', color: 'bg-green-500' },
    { name: 'orange', color: 'bg-orange-500' },
    { name: 'pink', color: 'bg-pink-500' }
  ] as const;

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-400/10 to-cyan-400/10 rounded-full blur-xl"
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
            rounded-full w-14 h-14 shadow-2xl border-2 transition-all duration-300
            ${isEditing 
              ? 'bg-red-500 hover:bg-red-600 border-red-300 text-white' 
              : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
            }
          `}
          size="sm"
        >
          {isEditing ? <X size={20} /> : <Edit3 size={20} />}
        </Button>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Enhanced Profile</h1>
          <p className="text-gray-400">Choose a theme and see your profile come to life ✨</p>
        </motion.div>

        {/* Theme Selector */}
        <motion.div 
          className="flex justify-center gap-3 mb-8 p-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 w-fit mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => setSelectedTheme(theme.name)}
              className={`w-8 h-8 rounded-full ${theme.color} transition-all duration-300 ${
                selectedTheme === theme.name ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' : 'hover:scale-105'
              }`}
            />
          ))}
        </motion.div>

        {/* Enhanced Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-12"
        >
          <motion.div
            className={`relative w-96 h-64 bg-gradient-to-br ${gradientThemes[selectedTheme]} rounded-3xl shadow-2xl overflow-hidden cursor-pointer`}
            whileHover={{ 
              rotateY: 8, 
              rotateX: 8, 
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Animated Background Elements */}
            <motion.div 
              className="absolute inset-0"
              animate={{
                background: isHovered 
                  ? 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)'
                  : 'radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            {/* Floating Orbs */}
            <motion.div 
              className="absolute top-6 right-6 w-20 h-20 rounded-full bg-white/10 blur-xl"
              animate={{ 
                x: isHovered ? [0, 10, 0] : [0, -5, 0],
                y: isHovered ? [0, -5, 0] : [0, 5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-8 left-6 w-16 h-16 rounded-full bg-white/5 blur-lg"
              animate={{ 
                x: isHovered ? [0, -8, 0] : [0, 8, 0],
                y: isHovered ? [0, 8, 0] : [0, -8, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            
            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-[1px]" />
            
            {/* Card Content */}
            <div className="relative p-6 h-full flex flex-col justify-between text-white">
              {/* Header Section */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Enhanced Avatar */}
                  <motion.div 
                    className="relative w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold border border-white/20"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={fullName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white/90">{fullName.split(' ').map(n => n[0]).join('')}</span>
                    )}
                    {/* Online Status Indicator */}
                    <motion.div 
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-xl text-white/95">{fullName}</h3>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                        className="w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle size={12} className="text-white" />
                      </motion.div>
                    </div>
                    <p className="text-white/70 text-sm">@{fullName.toLowerCase().replace(' ', '')}</p>
                    <p className="text-white/60 text-xs mt-1">{formatFollowerCount(followerCount)} followers</p>
                  </motion.div>
                </div>
                
                {/* Status Badge */}
                <motion.div 
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-green-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs text-white/80 font-medium">Active</span>
                </motion.div>
              </div>
              
              {/* Content Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-white/90 text-sm mb-2 line-clamp-2">{institution}</p>
                <div className="flex items-center gap-1 mb-3">
                  <MapPin size={12} className="text-white/60" />
                  <span className="text-white/60 text-xs">{location}</span>
                </div>
                
                {/* Enhanced Contact Button */}
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="group relative px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl text-sm font-medium transition-all duration-300 border border-white/20 hover:border-white/30 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                    initial={{ x: '-100%' }}
                    animate={{ x: isHovered ? '100%' : '-100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 text-white/95">Edit Profile</span>
                </motion.button>
              </motion.div>
            </div>
            
            {/* Hover Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              initial={{ boxShadow: '0 0 0 0 rgba(255,255,255,0)' }}
              animate={{ 
                boxShadow: isHovered 
                  ? '0 0 30px 5px rgba(255,255,255,0.1)' 
                  : '0 0 0 0 rgba(255,255,255,0)'
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <StatCard
            icon={<BookOpen size={32} className="text-white" />}
            title="Active Courses"
            value={courses.length}
            subtitle="Currently enrolled"
            color="from-blue-500 via-blue-600 to-cyan-500"
            bgPattern="from-blue-500/10 to-cyan-500/10"
          />
          <StatCard
            icon={<Star size={32} className="text-white" />}
            title="AI Predicted Grade"
            value={predictedGrade}
            subtitle="Based on performance"
            color="from-yellow-500 via-orange-500 to-red-500"
            bgPattern="from-yellow-500/10 to-red-500/10"
          />
          <StatCard
            icon={<Calendar size={32} className="text-white" />}
            title="Study Streak"
            value={`${activeDays} days`}
            subtitle="Keep it up!"
            color="from-purple-500 via-pink-500 to-rose-500"
            bgPattern="from-purple-500/10 to-rose-500/10"
          />
        </motion.div>

        {/* Enhanced Subscription Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            <CardHeader className="relative">
              <h2 className="text-2xl font-bold text-center text-white">
                Subscription Plan
              </h2>
            </CardHeader>
            <CardBody className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </CardBody>
          </Card>
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
              className="bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl shadow-2xl w-full max-w-md p-6 border border-white/50"
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

// Enhanced Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  bgPattern: string;
}> = ({ icon, title, value, subtitle, color, bgPattern }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.03 }}
    className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 overflow-hidden group"
  >
    {/* Background Pattern */}
    <div className={`absolute inset-0 bg-gradient-to-br ${bgPattern} opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
    
    {/* Decorative Elements */}
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full blur-xl"
    />
    
    <div className="relative flex items-center gap-4 mb-4">
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center shadow-xl`}
      >
        {icon}
      </motion.div>
      <div>
        <h3 className="font-bold text-white text-lg">{title}</h3>
        <p className="text-sm text-white/70 font-medium">{subtitle}</p>
      </div>
    </div>
    <div className="relative text-4xl font-bold text-white">
      {value}
    </div>
  </motion.div>
);

// Enhanced Plan Card Component
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
      relative p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden
      ${highlighted 
        ? 'border-purple-300/50 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 shadow-2xl' 
        : current
        ? 'border-emerald-300/50 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 shadow-xl'
        : 'border-white/20 bg-gradient-to-br from-white/5 to-white/10 shadow-lg'
      }
    `}
  >
    {/* Background Decoration */}
    <div className="absolute top-0 right-0 w-20 h-25 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-xl" />
    
    {highlighted && (
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-1.5 right-5 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg"
      >
        ⭐ RECOMMENDED
      </motion.div>
    )}
    
    <div className="relative text-center mb-6">
      <h3 className="text-xl font-bold mb-2 text-white">
        {title}
      </h3>
      <p className="text-white/70 text-sm mb-4">{description}</p>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-4xl font-bold text-white">
          {price}
        </span>
        <span className="text-white/60 font-medium">/{period}</span>
      </div>
    </div>

    <ul className="space-y-3 mb-6">
      {features.map((feature, index) => (
        <motion.li 
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3 text-sm"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <span className="font-medium text-white/90">{feature}</span>
        </motion.li>
      ))}
    </ul>

    <Button
      fullWidth
      variant={current ? "outline" : "primary"}
      className={
        current 
          ? "border-emerald-300/50 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20" 
          : highlighted
          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
          : "shadow-lg"
      }
    >
      {current ? "✓ Current Plan" : "Upgrade Now"}
    </Button>
  </motion.div>
);