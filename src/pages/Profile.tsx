import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Calendar, Crown } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../lib/store';
import ProfileCard from './ProfileCard'; // adjust path if needed

export const Profile: React.FC = () => {
  const { user, courses } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('John Doe');
  const [institution, setInstitution] = useState('University of Technology');
  const [avatarUrl, setAvatarUrl] = useState(''); // implement upload later if needed

  // update info from store on mount/change
  useEffect(() => {
    if (user?.name) setFullName(user.name);
    if (user?.institution) setInstitution(user.institution);
    if (user?.avatarUrl) setAvatarUrl(user.avatarUrl);
  }, [user]);

  // Simulated data
  const activeDays = 45;
  const predictedGrade = 'A-';

  // for handle: use email prefix, fallback "user"
  const userHandle = user?.email?.split('@')[0] || "user";

  // Save changes logic (real app: send to backend)
  const handleSave = () => {
    setIsEditing(false);
    // TODO: send fullName/institution/avatarUrl to backend if you want
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Profile Card + Edit */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <Button
                variant="outline"
                onClick={() => {
                  if (isEditing) handleSave();
                  else setIsEditing(true);
                }}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col items-center gap-4 py-6">
              {isEditing && (
                <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Input
                    label="Institution"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                  />
                  {/* Avatar upload button placeholder */}
                  {/* <Button variant="outline" size="sm">Change Photo</Button> */}
                </div>
              )}
              <div className="w-full flex justify-center">
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
            </div>
          </CardBody>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{courses.length}</h3>
                  <p className="text-gray-600">Active Courses</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Star size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{predictedGrade}</h3>
                  <p className="text-gray-600">AI Predicted Grade</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{activeDays} days</h3>
                  <p className="text-gray-600">Active Streak</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Subscription Plan</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free Plan */}
              <div className="p-6 border rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Crown size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Free Plan</h3>
                    <p className="text-sm text-gray-500">Basic features</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-sm text-gray-600">
                    ✓ Up to 3 courses
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    ✓ Basic AI assistance
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    ✓ Limited storage
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    ✓ Email Support
                  </li>
                </ul>
                <Button variant="outline" fullWidth>Current Plan</Button>
              </div>

              {/* Pro Plan */}
              <div className="p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Crown size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Pro Plan</h3>
                    <p className="text-sm text-gray-500">Advanced features</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-sm text-gray-600">
                    ✓ Unlimited courses
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    ✓ Advanced AI features
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    ✓ Unlimited storage
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    ✓ Priority support
                  </li>
                </ul>
                <Button fullWidth>Upgrade to Pro</Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
