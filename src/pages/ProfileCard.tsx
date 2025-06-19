import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ProfileCardProps {
  name: string;
  title: string;
  handle: string;
  status: string;
  contactText: string;
  avatarUrl?: string;
  showUserInfo?: boolean;
  enableTilt?: boolean;
  onContactClick?: () => void;
  miniAvatarUrl?: string;
  gradientTheme?: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
  verified?: boolean;
  followerCount?: number;
  location?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  handle,
  status,
  contactText,
  avatarUrl,
  showUserInfo = true,
  enableTilt = false,
  onContactClick,
  miniAvatarUrl,
  gradientTheme = 'blue',
  verified = false,
  followerCount,
  location
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const gradientThemes = {
    blue: 'from-blue-500 via-purple-500 to-pink-500',
    purple: 'from-purple-600 via-pink-500 to-red-500',
    green: 'from-emerald-500 via-teal-500 to-cyan-500',
    orange: 'from-orange-500 via-red-500 to-pink-500',
    pink: 'from-pink-500 via-rose-500 to-red-500'
  };

  const statusColors = {
    Online: 'bg-green-400',
    Away: 'bg-yellow-400',
    Busy: 'bg-red-400',
    Offline: 'bg-gray-400'
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <motion.div
      className={`relative w-80 h-52 bg-gradient-to-br ${gradientThemes[gradientTheme]} rounded-3xl shadow-2xl overflow-hidden cursor-pointer`}
      whileHover={enableTilt ? { 
        rotateY: 8, 
        rotateX: 8, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      } : { scale: 1.02 }}
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
              className="relative w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg font-bold border border-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white/90">{name.split(' ').map(n => n[0]).join('')}</span>
              )}
              {/* Online Status Indicator */}
              <motion.div 
                className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColors[status] || statusColors.Offline} rounded-full border-2 border-white shadow-lg`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
              />
            </motion.div>
            
            {showUserInfo && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-white/95">{name}</h3>
                  {verified && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                      className="w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </div>
                <p className="text-white/70 text-sm">@{handle}</p>
                {followerCount && (
                  <p className="text-white/60 text-xs mt-1">{formatFollowerCount(followerCount)} followers</p>
                )}
              </motion.div>
            )}
          </div>
          
          {/* Status Badge */}
          <motion.div 
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className={`w-2 h-2 rounded-full ${statusColors[status] || statusColors.Offline}`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-white/80 font-medium">{status}</span>
          </motion.div>
        </div>
        
        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white/90 text-sm mb-2 line-clamp-2">{title}</p>
          {location && (
            <div className="flex items-center gap-1 mb-3">
              <svg className="w-3 h-3 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-white/60 text-xs">{location}</span>
            </div>
          )}
          
          {/* Enhanced Contact Button */}
          <motion.button
            onClick={onContactClick}
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
            <span className="relative z-10 text-white/95">{contactText}</span>
          </motion.button>
        </motion.div>
        
        {/* Mini Avatar with Animation */}
        {miniAvatarUrl && (
          <motion.div 
            className="absolute top-6 right-6 w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <img src={miniAvatarUrl} alt="Mini avatar" className="w-full h-full object-cover" />
          </motion.div>
        )}
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
  );
};

// Demo Component
const ProfileCardDemo = () => {
  const [selectedTheme, setSelectedTheme] = useState<'blue' | 'purple' | 'green' | 'orange' | 'pink'>('blue');
  
  const themes = [
    { name: 'blue', color: 'bg-blue-500' },
    { name: 'purple', color: 'bg-purple-500' },
    { name: 'green', color: 'bg-green-500' },
    { name: 'orange', color: 'bg-orange-500' },
    { name: 'pink', color: 'bg-pink-500' }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Enhanced Profile Card</h1>
        <p className="text-gray-400">Choose a theme and hover to see the magic ✨</p>
      </motion.div>
      
      {/* Theme Selector */}
      <motion.div 
        className="flex gap-3 mb-8 p-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
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
      
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      >
        <ProfileCard
          name="Sarah Chen"
          title="Senior Product Designer crafting delightful user experiences with passion for minimalism and accessibility"
          handle="sarahchen"
          status="Online"
          contactText="Let's Connect"
          gradientTheme={selectedTheme}
          verified={true}
          followerCount={12400}
          location="San Francisco, CA"
          enableTilt={true}
          onContactClick={() => alert('Contact clicked!')}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center text-gray-500 text-sm"
      >
        Hover over the card to see the tilt effect and animations
      </motion.div>
    </div>
  );
};

export default ProfileCard;