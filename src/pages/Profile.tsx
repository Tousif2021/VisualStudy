import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Building2, BookOpen, Star, Calendar, Crown, Edit3, X, Camera, Sparkles, TrendingUp, Award } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Profile Section - Enhanced */}
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Multiple Background Gradient Blobs */}
          <div className="absolute inset-0 -top-20 -bottom-10">
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-blue-400/15 via-purple-400/15 to-pink-400/15 rounded-full blur-3xl" 
            />
            <motion.div 
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-cyan-400/10 via-emerald-400/10 to-yellow-400/10 rounded-full blur-2xl" 
            />
          </div>

          {/* Enhanced Profile Card */}
          <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8 md:p-12 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-cyan-400/20 rounded-full blur-xl" />
            
            {/* Floating Sparkles */}
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-8"
            >
              <Sparkles size={24} className="text-yellow-400/60" />
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10], rotate: [360, 180, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-8 left-8"
            >
              <Award size={20} className="text-purple-400/60" />
            </motion.div>

            <div className="relative flex flex-col items-center text-center">
              {/* Enhanced Profile Picture */}
              <motion.div
                className="relative group mb-6"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="relative">
                  {/* Outer Glow Ring */}
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-lg"
                  />
                  
                  {/* Main Avatar with Enhanced Gradient */}
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-2xl border-4 border-white/80">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={fullName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      fullName.split(' ').map(n => n[0]).join('')
                    )}
                    
                    {/* Inner Shine Effect */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/20 to-transparent" />
                  </div>
                  
                  {/* Multiple Floating Rings */}
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-2 border-blue-400/40"
                  />
                  <motion.div
                    animate={{ rotate: [360, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -inset-2 rounded-full border-2 border-purple-400/30"
                  />
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.15, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -inset-4 rounded-full border border-pink-400/20"
                  />
                  
                  {/* Enhanced Camera overlay */}
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

              {/* Enhanced Name and Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {fullName}
                </h1>
                <p className="text-lg text-gray-600 mb-3 font-medium">{institution}</p>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-100 via-blue-100 to-purple-100 rounded-full border border-emerald-200/50 shadow-lg"
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

              {/* Enhanced Quick Stats */}
              <motion.div
                className="grid grid-cols-3 gap-8 w-full max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 shadow-lg"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {courses.length}
                  </div>
                  <div className="text-xs text-gray-600 font-medium mt-1">Courses</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 shadow-lg"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {predictedGrade}
                  </div>
                  <div className="text-xs text-gray-600 font-medium mt-1">Grade</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50 shadow-lg"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {activeDays}
                  </div>
                  <div className="text-xs text-gray-600 font-medium mt-1">Days</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Detailed Stats Cards */}
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
          <Card className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-2xl border-0 shadow-2xl rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            <CardHeader className="relative">
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
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
    className="relative bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl border border-white/60 hover:shadow-3xl transition-all duration-500 overflow-hidden group"
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
        <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
      </div>
    </div>
    <div className="relative text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
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
        ? 'border-purple-300 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 shadow-2xl' 
        : current
        ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 shadow-xl'
        : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg'
      }
    `}
  >
    {/* Background Decoration */}
    <div className="absolute top-0 right-0 w-20 h-25 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-xl" />
    
    {highlighted && (
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-1 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg"
      >
        ⭐ RECOMMENDED
      </motion.div>
    )}
    
    <div className="relative text-center mb-6">
      <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {price}
        </span>
        <span className="text-gray-500 font-medium">/{period}</span>
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