import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../lib/store';

// Get initials like "OS" for "Operating System"
const getInitials = (name: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 3);
};

export const CourseList: React.FC = () => {
  const { courses, fetchCourses } = useAppStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="relative space-y-8">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#3b82f6] via-[#38bdf8] to-[#117EB1] rounded-2xl shadow-xl p-8 overflow-hidden mb-4">
        <h1 className="text-3xl font-extrabold text-white drop-shadow">My Courses</h1>
        <p className="text-white/80 mt-1 text-base">Manage your academic journey like a boss</p>
        <div className="absolute right-8 top-4 opacity-20 text-white text-7xl pointer-events-none select-none">
          <BookOpen size={72} />
        </div>
        <Link to="/courses/new" className="absolute bottom-8 right-8">
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.09 }}>
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
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{
                scale: 1.07,
                rotate: 0.5,
                boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
              }}
            >
              <Link to={`/courses/${course.id}`}>
  <Card
    className={`
      relative flex flex-col justify-center items-center
    min-h-[220px] aspect-square
    rounded-[1.5rem]
    bg-transparent
    border border-blue-200
    shadow-[0_0_20px_6px_rgba(59,130,246,0.15)]
    hover:shadow-[0_0_28px_10px_rgba(59,130,246,0.25)]
    transition-all duration-300 ease-in-out
    cursor-pointer
    group
    `}
  >
    {/* Centered Big Initials */}
    <div className="flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold bg-gradient-to-tr from-indigo-600 to-blue-500 text-white mb-4">
  {getInitials(course.name)}
</div>

      <h3 className="text-xl font-extrabold text-slate-800 leading-tight group-hover:scale-105 transition-transform text-center px-4 truncate">
        {course.name}
      </h3>
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
            <Card className="bg-white/80 rounded-[1.8rem] shadow-lg">
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
