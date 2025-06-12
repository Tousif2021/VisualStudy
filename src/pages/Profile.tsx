import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Building2, BookOpen, Star, Calendar, Crown } from 'lucide-react';
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

  return (
    <div className="max-w-3xl mx-auto px-2 py-8 flex flex-col items-center gap-10">
      {/* Hero/Profile */}
      <motion.div
        className="w-full flex flex-col items-center relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Blurred Glass Background */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-tr from-purple-500 to-blue-400 opacity-30 blur-2xl rounded-3xl pointer-events-none z-0" />

        {/* Avatar */}
        <motion.div
          className="relative z-10"
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <div className="w-36 h-36 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-6xl font-extrabold text-white shadow-2xl border-4 border-white/30">
            {fullName.split(' ').map(n => n[0]).join('')}
          </div>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 absolute left-1/2 -translate-x-1/2 top-full"
            >
              Change Photo
            </Button>
          )}
        </motion.div>

        {/* Name + Fun Tagline */}
        <div className="flex flex-col items-center mt-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white drop-shadow">
            {fullName} <span className="ml-2 inline-block">🔥</span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 mt-1">
            {institution}
          </p>
          <span className="text-sm text-indigo-500 bg-indigo-100/80 px-3 py-1 rounded-full mt-2 shadow-inner">
            👑 Leveling up every day!
          </span>
        </div>
        <div className="mt-3 text-gray-700 text-center text-sm max-w-md">
          {/* Optional Bio/About */}
          <span>
            Building the future, one line of code at a time. <span className="ml-1">💻🚀</span>
          </span>
        </div>
      </motion.div>

      {/* Profile Edit */}
      <Card className="w-full bg-white/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Profile Settings</h2>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="transition-all"
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
                leftIcon={<User size={18} />}
              />
              <Input
                label="Email"
                value={user?.email}
                disabled
                leftIcon={<Mail size={18} />}
              />
              <Input
                label="Institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                disabled={!isEditing}
                leftIcon={<Building2 size={18} />}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats Row */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
        }}
      >
        <ProfileStat
          icon={<BookOpen size={28} className="text-blue-500" />}
          label="Active Courses"
          value={courses.length}
        />
        <ProfileStat
          icon={<Star size={28} className="text-green-500" />}
          label="AI Predicted Grade"
          value={predictedGrade}
        />
        <ProfileStat
          icon={<Calendar size={28} className="text-purple-500" />}
          label="Active Streak"
          value={`${activeDays} days`}
        />
      </motion.div>

      {/* Subscription Plans */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <h2 className="text-xl font-bold">Subscription Plan</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free Plan */}
              <SubPlan
                icon={<Crown size={22} className="text-gray-500" />}
                title="Free Plan"
                description="Basic features"
                features={['Up to 3 courses', 'Basic AI assistance', 'Limited storage', 'Email Support']}
                active
              />
              {/* Pro Plan */}
              <SubPlan
                icon={<Crown size={22} className="text-blue-600" />}
                title="Pro Plan"
                description="Advanced features"
                features={['Unlimited courses', 'Advanced AI features', 'Unlimited storage', 'Priority support']}
                cta="Upgrade to Pro"
              />
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

// Fancy Stats Card
const ProfileStat = ({ icon, label, value }) => (
  <motion.div
    className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-7 shadow-xl flex flex-col items-center justify-center group hover:scale-105 transition-transform cursor-pointer border-0"
    whileHover={{ scale: 1.04, y: -5 }}
  >
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-2 group-hover:from-indigo-200 group-hover:to-blue-100 transition-all">
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    <div className="text-gray-500 text-sm mt-1">{label}</div>
  </motion.div>
);

// Subscription Plan Card
const SubPlan = ({ icon, title, description, features, active, cta }) => (
  <div className={`p-6 border-0 rounded-2xl shadow-lg bg-white/70 backdrop-blur-xl flex flex-col ${active ? 'ring-2 ring-indigo-400' : ''}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <ul className="space-y-2 mb-4">
      {features.map(f => (
        <li key={f} className="flex items-center text-sm text-gray-700">
          <span className="mr-2">✓</span> {f}
        </li>
      ))}
    </ul>
    {active ? (
      <Button variant="outline" fullWidth>Current Plan</Button>
    ) : (
      <Button fullWidth>{cta}</Button>
    )}
  </div>
);

