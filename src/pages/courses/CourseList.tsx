import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../lib/store';

export const CourseList: React.FC = () => {
  const { courses, fetchCourses } = useAppStore();
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <Link to="/courses/new">
          <Button
              className="
                bg-gradient-to-r from-[#1e3a8a] to-[#38bdf7]
                text-white
                font-bold
                rounded-full
                border-2 border-[#3b82f6]
                shadow-[0_4px_20px_0_rgba(30,58,138,0.12)]
                hover:from-[#2563eb]
                hover:to-[#38bdf8]
                hover:border-[#60a5fa]
                transition-all
                duration-200
                ease-in-out
                px-7
                py-2.5
                text-base
                tracking-wide
                drop-shadow-[0_1px_2px_rgba(0,0,0,0.10)]
              "
            >
              + Add Course
            </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to={`/courses/${course.id}`}>
              <Card hover className="h-full">
                <CardBody className="p-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <BookOpen size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 ml-2" />
                  </div>
                </CardBody>
              </Card>
            </Link>
          </motion.div>
        ))}
        
        {courses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="col-span-full"
          >
            <Card>
              <CardBody className="p-6 text-center">
                <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-500 mb-4">Start by adding your first course</p>
                <Link to="/courses/new">
                  <Button leftIcon={<Plus size={16} />}>
                    Add Course
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};