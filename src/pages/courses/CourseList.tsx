import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../lib/store';

// Helper to get initials (like "OS" for "Operating System")
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 3); // Up to 3 letters max
};

// Colors for the tag
const tagColors = [
  'bg-blue-600 text-white',
  'bg-purple-600 text-white',
  'bg-pink-500 text-white',
  'bg-green-600 text-white',
  'bg-yellow-500 text-white',
  'bg-orange-500 text-white',
];
const getTagColor = (i) => tagColors[i % tagColors.length];

export const CourseList: React.FC = () => {
  const { courses, fetchCourses } = useAppStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="relative space-y-8">
      {/* Hero header with gradient and glass effect */}
      <div className="relative bg-gradient-to-r from-[#3b82f6] via-[#38bdf8] to-[#117EB1] rounded-2xl shadow-xl p-8 overflow-hidden mb-4">
        <h1 className="text-3xl font-extrabold text-white drop-shadow">My Courses</h1>
        <p className="text-white/80 mt-1 text-base">Manage your academic journey like a boss</p>
        <div className="absolute right-8 top-4 opacity-20 text-white text-7xl pointer-events-none select-none">
          <BookOpen size={72} />
        </div>
        <Link to="/courses/new" className="absolute bottom-8 right-8">
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.09 }}
          >
            <Button
              className="rounded-full bg-white/30 backdrop-blur px-6 py-3 text-white font-bold shadow-xl border border-white/40 transition hover:bg-white/40 hover:text-blue-800 hover:shadow-2xl"
              rightIcon={<ChevronRight size={22} />}
            >
              Add Course
            </Button>
          </motion.div>
        </Link>
      </div>

      {/* Courses Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {courses.length > 0 &&
          courses.map((course, i) => (
            <motion.div
              key={course.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.44, delay: i * 0.04 }}
              whileHover={{ scale: 1.06, boxShadow: "0 12px 28px rgba(30,58,138,0.17)" }}
            >
              <Link to={`/courses/${course.id}`}>
                <Card
                  className="
                    flex flex-col items-center justify-between
                    min-h-[180px] aspect-square
                    rounded-2xl
                    shadow-lg
                    bg-white
                    border
                    border-transparent
                    transition-all
                    duration-200
                    ease-in-out
                    hover:shadow-[0_8px_32px_0_rgba(30,58,138,0.16)]
                    hover:scale-[1.035]
                    hover:border-blue-500
                    cursor-pointer
                  "
                >
                  {/* Tag with initials at top */}
                  <div className={`rounded-b-2xl ${getTagColor(i)} w-full flex items-center justify-center h-16 text-3xl font-extrabold tracking-widest drop-shadow`}>
                    {getInitials(course.name)}
                  </div>
                  
                  {/* (Optional: icon in the middle)
                  <div className="flex-1 flex items-center justify-center">
                    <BookOpen size={32} className="text-blue-200" />
                  </div>
                  */}

                  {/* Name at the bottom */}
                  <div className="w-full text-center py-4 px-2 flex-1 flex items-end justify-center">
                    <span className="block text-base font-semibold text-gray-800 truncate">{course.name}</span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}

        {/* Empty state */}
        {courses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="col-span-full"
          >
            <Card className="bg-white/80 rounded-2xl shadow-lg">
              <CardBody className="p-8 text-center">
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                >
                  <BookOpen size={54} className="text-blue-300 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-500 mb-5">Start by adding your first course</p>
                <Link to="/courses/new">
                  <Button leftIcon={<Plus size={16} />}>Add Course</Button>
                </Link>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Floating Add button for mobile screens */}
      <Link to="/courses/new">
        <motion.div
          className="fixed bottom-7 right-7 z-40 md:hidden"
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.08 }}
        >
          <Button
            className="
              rounded-full
              bg-gradient-to-tr from-[#1e3a8a] to-[#117EB1]
              text-white
              shadow-2xl
              w-16 h-16 text-3xl flex items-center justify-center
              border-4 border-white/40
              hover:scale-110 transition
            "
          >
            <Plus size={32} />
          </Button>
        </motion.div>
      </Link>
    </div>
  );
};
