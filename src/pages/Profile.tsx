import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

  // Simulated data
  const activeDays = 45;
  const predictedGrade = 'A-';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex items-start gap-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                  {fullName.split(' ').map(n => n[0]).join('')}
                </div>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Change Photo
                  </Button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <Input
                  label="Full Name"
                  value={setFullName}
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