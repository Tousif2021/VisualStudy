import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, ChevronRight, Edit3, Trash2, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { useAppStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';

// Get initials like "OS" for "Operating System"
const getInitials = (name: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 3);
};

interface EditModalProps {
  course: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseId: string, name: string, description: string) => void;
}

const EditCourseModal: React.FC<EditModalProps> = ({ course, isOpen, onClose, onSave }) => {
  const [name, setName] = useState(course?.name || '');
  const [description, setDescription] = useState(course?.description || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (course) {
      setName(course.name);
      setDescription(course.description || '');
    }
  }, [course]);

  const handleSave = async () => {
    if (!name.trim()) return;
    
    setSaving(true);
    try {
      await onSave(course.id, name.trim(), description.trim());
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Course</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-4">
          <Input
            label="Course Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter course name"
            fullWidth
          />
          
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter course description (optional)"
            rows={3}
            fullWidth
          />
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            isLoading={saving}
            disabled={!name.trim()}
            fullWidth
            leftIcon={<Save size={16} />}
          >
            Save Changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const CourseList: React.FC = () => {
  const { courses, fetchCourses } = useAppStore();
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEditCourse = async (courseId: string, name: string, description: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ name, description })
        .eq('id', courseId);

      if (error) throw error;
      
      await fetchCourses();
      setEditingCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course. Please try again.');
    }
  };

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${courseName}"? This will also delete all associated documents, notes, and tasks.`)) {
      return;
    }

    setDeletingCourseId(courseId);
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      
      await fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    } finally {
      setDeletingCourseId(null);
    }
  };

  return (
    <div className="relative space-y-8">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#3b82f6] via-[#38bdf8] to-[#117EB1] rounded-2xl shadow-xl p-6 sm:p-8 overflow-hidden mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow">My Courses</h1>
        <p className="text-white/80 mt-1 text-sm sm:text-base">Manage your academic journey like a boss</p>
        <div className="absolute right-4 sm:right-8 top-4 opacity-20 text-white text-4xl sm:text-7xl pointer-events-none select-none">
          <BookOpen size={window.innerWidth < 640 ? 48 : 72} />
        </div>
        <Link to="/courses/new" className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8">
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.09 }}>
            <Button
              className="rounded-full bg-white/30 backdrop-blur px-4 sm:px-6 py-2 sm:py-3 text-white font-bold shadow-xl border border-white/40 transition hover:bg-white/40 hover:text-blue-800 hover:shadow-2xl text-sm sm:text-base"
              rightIcon={<ChevronRight size={window.innerWidth < 640 ? 18 : 22} />}
            >
              Add Course
            </Button>
          </motion.div>
        </Link>
      </div>

      {/* Courses Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 bg-[#f9fafb]"
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
                scale: 1.05,
                rotate: 0.5,
              }}
              className="group relative"
            >
              {/* Course Card */}
              <Link
                to={`/courses/${course.id}`}
                className="block focus:outline-none focus:ring-0 focus-visible:ring-0"
              >
                <div
                  className={`
                    relative flex flex-col justify-center items-center
                    min-h-[180px] sm:min-h-[220px] aspect-square
                    rounded-2xl
                    bg-white
                    border border-transparent
                    shadow-[0_0_30px_rgba(59,130,246,0.25)]
                    hover:shadow-[0_0_40px_rgba(59,130,246,0.35)]
                    transition-all duration-300 ease-in-out
                    cursor-pointer
                    overflow-hidden
                  `}
                >
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="
                      w-16 h-16 sm:w-20 sm:h-20 rounded-full 
                      flex items-center justify-center 
                      text-2xl sm:text-4xl font-extrabold 
                      bg-gradient-to-tr from-indigo-600 to-blue-500 
                      text-white mb-3 sm:mb-4 shadow-lg
                    ">
                      {getInitials(course.name)}
                    </div>
                    <h3 className="text-base sm:text-xl font-extrabold text-slate-800 leading-tight group-hover:scale-105 transition-transform text-center px-2 sm:px-4 line-clamp-2">
                      {course.name}
                    </h3>
                  </div>
                </div>
              </Link>

              {/* Action Buttons - Positioned absolutely */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditingCourse(course);
                  }}
                  className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-md border border-gray-200 text-blue-600 hover:text-blue-700"
                >
                  <Edit3 size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteCourse(course.id, course.name);
                  }}
                  disabled={deletingCourseId === course.id}
                  className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-md border border-gray-200 text-red-600 hover:text-red-700"
                >
                  {deletingCourseId === course.id ? (
                    <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </Button>
              </div>
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
            <Card className="bg-#f9fafb square shadow-lg">
              <CardBody className="p-6 sm:p-8 text-center">
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
          className="fixed bottom-6 right-6 z-40 md:hidden"
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.08 }}
        >
          <Button
            className="
              rounded-full
              bg-gradient-to-tr from-[#1e3a8a] to-[#117EB1]
              text-white
              shadow-[0_8px_20px_rgba(17,126,177,0.4)]
              hover:shadow-[0_12px_28px_rgba(17,126,177,0.6)]
              w-14 h-14 text-2xl flex items-center justify-center
              border-4 border-white/40
              hover:scale-110 transition
            "
          >
            <Plus size={28} />
          </Button>
        </motion.div>
      </Link>

      {/* Edit Course Modal */}
      <AnimatePresence>
        {editingCourse && (
          <EditCourseModal
            course={editingCourse}
            isOpen={!!editingCourse}
            onClose={() => setEditingCourse(null)}
            onSave={handleEditCourse}
          />
        )}
      </AnimatePresence>
    </div>
  );
};