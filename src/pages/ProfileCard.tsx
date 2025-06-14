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
  return (
    <motion.div
      className="relative w-80 h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl overflow-hidden"
      whileHover={enableTilt ? { rotateY: 5, rotateX: 5 } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/5 blur-lg" />
      </div>

      {/* Card Content */}
      <div className="relative p-6 h-full flex flex-col justify-between text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg font-bold">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
              ) : (
                name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            {showUserInfo && (
              <div>
                <h3 className="font-semibold text-lg">{name}</h3>
                <p className="text-white/80 text-sm">@{handle}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-white/80">{status}</span>
          </div>
        </div>

        <div>
          <p className="text-white/90 text-sm mb-3">{title}</p>
          <button
            onClick={onContactClick}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
          >
            {contactText}
          </button>
        </div>

        {/* Mini Avatar */}
        {miniAvatarUrl && (
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
            <img src={miniAvatarUrl} alt="Mini avatar" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileCard; ----can you improve the profile card? 