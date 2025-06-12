import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAppStore } from "../lib/store";

// --- PROFILE CARD COMPONENT ---
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
  miniAvatarUrl,
}) => {
  return (
    <motion.div
      className="relative w-full max-w-md bg-white/10 rounded-3xl shadow-2xl overflow-visible border border-white/10"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={enableTilt ? { rotateY: 7, rotateX: 7 } : {}}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Gradient "glass" header */}
      <div className="h-40 bg-gradient-to-br from-blue-500 via-purple-600 to-fuchsia-500 relative rounded-t-3xl">
        {/* Glassy overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px] rounded-t-3xl"></div>
        {/* Status indicator */}
        <div className="absolute top-4 right-6 z-10">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-md rounded-full px-3 py-1 shadow-md">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-semibold drop-shadow">● {status}</span>
          </div>
        </div>
      </div>

      {/* Profile content */}
      <div className="relative px-8 pb-10 pt-2">
        {/* Avatar */}
        <div className="flex justify-center -mt-20 mb-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
              {avatarUrl && avatarUrl !== "/default-avatar.png" ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-3xl font-extrabold tracking-wide">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {/* Mini avatar indicator */}
            <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100">
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
          <div className="text-center mb-7">
            <h2 className="text-2xl font-bold text-white drop-shadow mb-1">{name}</h2>
            <p className="text-purple-100/90 text-base font-semibold mb-1">{title}</p>
            <p className="text-white/70 text-xs tracking-wide">@{handle}</p>
          </div>
        )}

        {/* Contact button */}
        <div className="flex justify-center">
          <Button
            onClick={onContactClick}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-2 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Mail size={17} />
            {contactText}
          </Button>
        </div>
      </div>

      {/* Decorative glass dots */}
      <div className="absolute top-24 left-7 w-2 h-2 bg-white/30 rounded-full blur-[1.5px]"></div>
      <div className="absolute top-32 left-14 w-1.5 h-1.5 bg-white/40 rounded-full blur-[1px]"></div>
      <div className="absolute top-36 right-14 w-2 h-2 bg-white/20 rounded-full blur-[2px]"></div>
      <div className="absolute top-44 right-10 w-1 h-1 bg-white/25 rounded-full"></div>
    </motion.div>
  );
};

// --- PROFILE PAGE ---
export const Profile: React.FC = () => {
  const { user } = useAppStore();
  const [fullName, setFullName] = useState("John Doe");
  const [institution, setInstitution] = useState("University of Technology");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (user?.name) setFullName(user.name);
    if (user?.institution) setInstitution(user.institution);
    if (user?.avatarUrl) setAvatarUrl(user.avatarUrl);
  }, [user]);

  const userHandle = user?.email?.split("@")[0] || "user";

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-[#16192d] via-[#1c1833] to-[#24173b] px-4 py-12"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        overflow: "hidden",
      }}
    >
      <ProfileCard
        name={fullName}
        title={institution}
        handle={userHandle}
        status="Online"
        contactText="Contact Me"
        avatarUrl={avatarUrl || "/default-avatar.png"}
        showUserInfo={true}
        enableTilt={true}
        onContactClick={() => alert("Contact clicked!")}
        miniAvatarUrl={avatarUrl || "/default-avatar.png"}
      />
    </div>
  );
};

export default Profile;
