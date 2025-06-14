import React from 'react';
import { motion } from 'framer-motion';

interface ProfileCardProps {
  name: string;
  title: string;
  handle: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  contactText: string;
  avatarUrl?: string;
  showUserInfo?: boolean;
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
  onContactClick,
  miniAvatarUrl
}) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col items-start gap-4 text-white">
      {/* Avatar + Name + Handle */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full bg-transparent/20 flex items-center justify-center font-bold text-xl overflow-hidden ring-4 ring-white/30">
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
          <div>
            <h3 className="font-bold text-xl">{name}</h3>
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

        {/* Mini Avatar */}
        {miniAvatarUrl && (
          <motion.div
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/40 ring-2 ring-white/20"
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

      {/* Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`} />
        <span className="text-sm capitalize text-white/80">{status}</span>
      </div>

      {/* Title + Button */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-white/90">{title}</p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={onContactClick}
          className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
        >
          {contactText}
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileCard;
