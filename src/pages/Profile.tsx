import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Building2, BookOpen, Star, Calendar, Crown, Edit3, X, Camera } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative">
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
                          {/* Profile Card (ELITE Upgrade) */}
                  <motion.div
                    className="relative mb-12"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    {/* Animated Glass Blob & Sparkles */}
                    <div className="absolute inset-0 -top-20 -bottom-10 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[440px] bg-gradient-to-br from-blue-400/30 via-fuchsia-400/20 to-purple-500/30 rounded-full blur-3xl opacity-70 animate-pulse" />
                      <div className="absolute inset-0">
                        {/* Sparkles - static for now, animate if you want */}
                        <div className="absolute left-16 top-24 w-2 h-2 bg-white rounded-full opacity-80 blur-[1.5px]" />
                        <div className="absolute right-32 bottom-24 w-1.5 h-1.5 bg-pink-200 rounded-full opacity-70 blur-[2px]" />
                        <div className="absolute left-1/2 top-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-90 blur-sm" />
                      </div>
                    </div>
                  
                    {/* Elite Profile Card */}
                    <motion.div
                      whileHover={{ scale: 1.02, boxShadow: "0 8px 48px 6px rgba(99,102,241,0.18)" }}
                      className="relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_12px_64px_rgba(139,92,246,0.16)] border-2 border-transparent p-0 md:p-0 overflow-hidden transition-all duration-500 group"
                      style={{
                        borderImage: 'linear-gradient(115deg, #6366f1 20%, #a21caf 80%) 1',
                      }}
                    >
                      {/* Animated Border Gradient */}
                      <div className="absolute inset-0 z-0 pointer-events-none rounded-[2.5rem] border-[3px] border-transparent group-hover:border-blue-400"
                        style={{
                          borderImage: 'linear-gradient(115deg, #6366f1 20%, #a21caf 80%) 1',
                          filter: 'blur(1.5px) opacity(0.9)',
                        }} />
                  
                      <div className="relative z-10 flex flex-col items-center text-center px-8 py-10">
                        {/* Profile Picture - clickable + pulse */}
                        <motion.div
                          className="relative group mb-4"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 220 }}
                        >
                          <div className="relative">
                            <div
                              className={`
                                w-36 h-36 md:w-44 md:h-44 rounded-full
                                bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500
                                flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-[6px] border-white/70
                                ring-4 ring-purple-400/30 group-hover:ring-blue-400/40 transition-all duration-300 cursor-pointer animate-pulse
                              `}
                              title="Change Avatar"
                              tabIndex={0}
                              role="button"
                            >
                              {avatarUrl ? (
                                <img src={avatarUrl} alt={fullName} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                fullName.split(' ').map(n => n[0]).join('')
                              )}
                              {/* Camera overlay */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              >
                                <Camera size={28} className="text-white/90" />
                              </motion.div>
                            </div>
                            {/* Glow ring */}
                            <div className="absolute -inset-2 rounded-full border-4 border-blue-400/30 pointer-events-none animate-pulse" />
                          </div>
                        </motion.div>
                  
                        {/* Animated Level Badge */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.36, type: "spring" }}
                          className="absolute top-4 right-6 md:right-14 flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg animate-pulse border-2 border-white/40 font-semibold text-xs tracking-wide uppercase">
                            <Crown size={16} className="text-yellow-300 drop-shadow-glow animate-bounce" />
                            Level 7
                          </div>
                        </motion.div>
                  
                        {/* Name and Info */}
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.45 }}
                          className="mb-4 mt-2"
                        >
                          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1 tracking-tight drop-shadow-lg">
                            {fullName}
                          </h1>
                          <p className="text-lg text-gray-700 mb-3 font-medium">{institution}</p>
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full shadow">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium text-gray-700">Active Learner</span>
                          </div>
                        </motion.div>
                  
                        {/* Socials Row (dummy icons, add real links if you want) */}
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="flex justify-center gap-4 mb-5"
                        >
                          <a href="#" className="text-blue-500 hover:text-blue-700">
                            <svg width={22} height={22} viewBox="0 0 24 24" fill="none"><path d="M21 21v-6.5a2.5 2.5 0 0 0-5 0V21M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM7 21v-6.5a2.5 2.5 0 0 1 5 0V21" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                          <a href="#" className="text-gray-800 hover:text-gray-900">
                            <svg width={22} height={22} viewBox="0 0 24 24" fill="none"><path d="M15.5 14a4.5 4.5 0 1 0-7 0m7 0V21M8.5 14v7M12 17v4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                          <a href="#" className="text-gray-600 hover:text-gray-900">
                            <svg width={22} height={22} viewBox="0 0 24 24" fill="none"><path d="M17 11V7a5 5 0 0 0-10 0v4M5 15v2a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                        </motion.div>
                  
                        {/* Quick Stats */}
                        <motion.div
                          className="grid grid-cols-3 gap-6 w-full max-w-md"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 drop-shadow-md">{courses.length}</div>
                            <div className="text-xs text-gray-500">Courses</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 drop-shadow-md">{predictedGrade}</div>
                            <div className="text-xs text-gray-500">Grade</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 drop-shadow-md">{activeDays}</div>
                            <div className="text-xs text-gray-500">Days</div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>


              {/* Quick Stats */}
              <motion.div
                className="grid grid-cols-3 gap-6 w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
                  <div className="text-xs text-gray-500">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{predictedGrade}</div>
                  <div className="text-xs text-gray-500">Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{activeDays}</div>
                  <div className="text-xs text-gray-500">Days</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <StatCard
            icon={<BookOpen size={32} className="text-blue-500" />}
            title="Active Courses"
            value={courses.length}
            subtitle="Currently enrolled"
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<Star size={32} className="text-yellow-500" />}
            title="AI Predicted Grade"
            value={predictedGrade}
            subtitle="Based on performance"
            color="from-yellow-500 to-orange-500"
          />
          <StatCard
            icon={<Calendar size={32} className="text-purple-500" />}
            title="Study Streak"
            value={`${activeDays} days`}
            subtitle="Keep it up!"
            color="from-purple-500 to-pink-500"
          />
        </motion.div>

        {/* Subscription Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <h2 className="text-2xl font-bold text-center">Subscription Plan</h2>
            </CardHeader>
            <CardBody>
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Edit Profile</h3>
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

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}> = ({ icon, title, value, subtitle, color }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
    <div className="text-3xl font-bold text-gray-800">{value}</div>
  </motion.div>
);

// Plan Card Component
const PlanCard: React.FC<{
  title: string;
  description: string;
  features: string[];
  price: string;
  period: string;
  current?: boolean;
  highlighted?: boolean;
}> = ({ title, description, features, price, period, current, highlighted }) => (
  <div className={`
    relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105
    ${highlighted 
      ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 shadow-xl' 
      : current
      ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
      : 'border-gray-200 bg-white shadow-md'
    }
  `}>
    {highlighted && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-full">
        RECOMMENDED
      </div>
    )}
    
    <div className="text-center mb-6">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-gray-500">/{period}</span>
      </div>
    </div>

    <ul className="space-y-3 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3 text-sm">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          {feature}
        </li>
      ))}
    </ul>

    <Button
      fullWidth
      variant={current ? "outline" : "primary"}
      className={
        current 
          ? "border-green-300 text-green-700 bg-green-50" 
          : highlighted
          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          : ""
      }
    >
      {current ? "Current Plan" : "Upgrade Now"}
    </Button>
  </div>
);