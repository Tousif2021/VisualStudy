import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface ProfileCardProps {
  name: string;
  title: string;
  handle: string;
  status: string;
  contactText: string;
  avatarUrl: string;
  showUserInfo?: boolean;
  enableTilt?: boolean;
  onContactClick: () => void;
  miniAvatarUrl: string;
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
  miniAvatarUrl
}) => {
  return (
    <motion.div
      className="max-w-sm mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={enableTilt ? { rotateY: 5, rotateX: 5 } : {}}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Header with gradient background */}
      <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">{status}</span>
          </div>
        </div>
      </div>

      {/* Profile content */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="flex justify-center -mt-16 mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
              {avatarUrl && avatarUrl !== "/default-avatar.png" ? (
                <img 
                  src={avatarUrl} 
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {/* Mini avatar indicator */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100">
              {miniAvatarUrl && miniAvatarUrl !== "/default-avatar.png" ? (
                <img 
                  src={miniAvatarUrl} 
                  alt="Mini avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500"></div>
              )}
            </div>
          </div>
        </div>

        {/* User info */}
        {showUserInfo && (
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{name}</h2>
            <p className="text-gray-600 text-sm mb-2">{title}</p>
            <p className="text-gray-500 text-xs">@{handle}</p>
          </div>
        )}

        {/* Contact button */}
        <div className="flex justify-center">
          <Button
            onClick={onContactClick}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
          >
            <Mail size={16} />
            {contactText}
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-4 w-2 h-2 bg-white/30 rounded-full"></div>
      <div className="absolute top-24 left-8 w-1 h-1 bg-white/40 rounded-full"></div>
      <div className="absolute top-28 right-8 w-1.5 h-1.5 bg-white/20 rounded-full"></div>
    </motion.div>
  );
};

export default ProfileCard;