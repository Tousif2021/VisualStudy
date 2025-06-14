import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ProfileCardProps {
  name: string;
  title: string;
  handle: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  contactText: string;
  avatarUrl?: string;
  showUserInfo?: boolean;
  enableTilt?: boolean;
  onContactClick?: () => void;
  miniAvatarUrl?: string;
}

const statusColors: Record<string, string> = {
  online: 'bg-green-400',
  busy: 'bg-red-400',
  away: 'bg-yellow-400',
  offline: 'bg-gray-400'
};

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
      className="relative w-80 h-56 bg-gradient-to-br from-blue-700 via-purple-600 to-pink-500 rounded-3xl shadow-xl overflow-hidden cursor-pointer"
      whileHover={enableTilt ? { rotateY: 8, rotateX: 8 } : {}}
      transition={{ type: 'spring', stiffness: 120, damping: 12 }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-black/10 z-0">
        <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/5 blur-lg" />
      </div>

      {/* Content */}
      <div className="relative p-6 h-full flex flex-col justify-between z-10 text-white">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-xl ring-4 ring-white/30 overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            {showUserInfo && (
              <div className="leading-tight">
                <h3 className="font-bold text-lg">{name}</h3>
                <a
                  href={`https://x.com/${handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 text-sm hover:underline"
                >
                  @{handle}
                </a>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`} />
            <span className="text-xs text-white/80 capitalize">{status}</span>
          </div>
        </div>

        {/* Title + Button */}
        <div>
          <p className="text-white/90 text-sm mb-3">{title}</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={onContactClick}
            className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors duration-300"
          >
            {contactText}
          </motion.button>
        </div>

        {/* Mini Avatar */}
        {miniAvatarUrl && (
          <motion.div
            className="absolute top-3 right-3 w-9 h-9 rounded-full overflow-hidden border-2 border-white/40 ring-2 ring-white/20"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
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
