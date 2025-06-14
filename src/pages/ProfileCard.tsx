import React from 'react';
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
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <motion.div
      className="relative w-80 h-52 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl shadow-2xl overflow-hidden"
      whileHover={enableTilt ? { rotateY: 6, rotateX: 6 } : {}}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {/* Background Glow Circles */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/5 blur-lg" />
      </div>

      {/* Content */}
      <div className="relative p-6 h-full flex flex-col justify-between text-white">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-xl ring-2 ring-white/30">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            {showUserInfo && (
              <div className="text-shadow-sm">
                <h3 className="font-semibold text-lg leading-tight">{name}</h3>
                <p className="text-white/80 text-sm">@{handle}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/80">{status}</span>
          </div>
        </div>

        {/* Footer */}
        <div>
          <p className="text-white/90 text-sm mb-3 text-shadow-sm">{title}</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={onContactClick}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium hover:bg-white/30 transition"
          >
            {contactText}
          </motion.button>
        </div>

        {/* Mini Avatar */}
        {miniAvatarUrl && (
          <motion.div
            className="absolute top-4 right-4 w-9 h-9 rounded-full overflow-hidden border-2 border-white/40 shadow-sm"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img
              src={miniAvatarUrl}
              alt="Mini avatar"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileCard;
