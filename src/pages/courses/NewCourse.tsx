import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../lib/store';
import { createCourse } from '../../lib/supabase';

export const NewCourse: React.FC = () => {
  const navigate = useNavigate();
  const { user, fetchCourses } = useAppStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await createCourse(user.id, name, description);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      await fetchCourses();
      navigate('/courses');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Courses
        </button>
        
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-800">Add New Course</h1>
          </CardHeader>
          
          <CardBody>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Course Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Advanced Mathematics"
                required
                fullWidth
              />
              
              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this course is about..."
                rows={4}
                fullWidth
              />
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/courses')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                >
                  Create Course
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};