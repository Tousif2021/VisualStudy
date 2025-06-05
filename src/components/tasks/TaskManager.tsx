import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Tag,
  Plus,
  X,
  Edit2,
  Trash2,
  AlertCircle,
  BookOpen,
  Users,
  FileText,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { createTask, updateTaskStatus } from '../../lib/supabase';
import { useAppStore } from '../../lib/store';

const taskTypes = [
  { value: 'assignment', label: 'Assignment' },
  { value: 'exam', label: 'Exam' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'reading', label: 'Reading' },
  { value: 'project', label: 'Project' },
  { value: 'other', label: 'Other' },
];

const taskPriorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  status: string;
  type?: string;
  course_id?: string;
}

interface TaskManagerProps {
  courseId?: string;
  initialTasks?: Task[];
  onUpdate?: () => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  courseId,
  initialTasks = [],
  onUpdate,
}) => {
  const { user, courses } = useAppStore();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showNewTask, setShowNewTask] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('due_date');

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    type: 'assignment',
    course_id: courseId || '',
  });

  const handleCreateTask = async () => {
    if (!user) return;

    try {
      const { data, error } = await createTask(
        user.id,
        newTask.title,
        newTask.description,
        newTask.due_date,
        newTask.priority,
        newTask.course_id
      );

      if (error) throw error;

      setTasks((prev) => [...prev, data[0] as Task]);
      setShowNewTask(false);
      setNewTask({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        type: 'assignment',
        course_id: courseId || '',
      });

      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await updateTaskStatus(taskId, newStatus);
      if (error) throw error;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'all') return true;
      if (filter === 'completed') return task.status === 'completed';
      if (filter === 'pending') return task.status === 'pending';
      if (filter === 'overdue')
        return (
          task.status !== 'completed' &&
          new Date(task.due_date) < new Date()
        );
      return true;
    })
    .sort((a, b) => {
      if (sort === 'due_date')
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      if (sort === 'priority') {
        const priority = { high: 3, medium: 2, low: 1 };
        return (
          priority[b.priority as keyof typeof priority] -
          priority[a.priority as keyof typeof priority]
        );
      }
      return 0;
    });

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <FileText size={16} />;
      case 'exam':
        return <AlertCircle size={16} />;
      case 'meeting':
        return <Users size={16} />;
      case 'reading':
        return <BookOpen size={16} />;
      default:
        return <Tag size={16} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Task Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          <Select
            value={filter}
            onChange={(value) => setFilter(value)}
            options={[
              { value: 'all', label: 'All Tasks' },
              { value: 'pending', label: 'Pending' },
              { value: 'completed', label: 'Completed' },
              { value: 'overdue', label: 'Overdue' },
            ]}
            className="w-32"
          />
          <Select
            value={sort}
            onChange={(value) => setSort(value)}
            options={[
              { value: 'due_date', label: 'Due Date' },
              { value: 'priority', label: 'Priority' },
            ]}
            className="w-32"
          />
        </div>
        <Button
          onClick={() => setShowNewTask(true)}
          leftIcon={<Plus size={16} />}
        >
          Add Task
        </Button>
      </div>

      {/* New Task Form */}
      <AnimatePresence>
        {showNewTask && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">New Task</h3>
                <Button
                  variant="icon"
                  onClick={() => setShowNewTask(false)}
                >
                  <X size={16} />
                </Button>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Task title..."
                />
                <Input
                  label="Description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Task description..."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="datetime-local"
                    label="Due Date"
                    value={newTask.due_date}
                    onChange={(e) =>
                      setNewTask({ ...newTask, due_date: e.target.value })
                    }
                  />
                  <Select
                    label="Priority"
                    value={newTask.priority}
                    onChange={(value) =>
                      setNewTask({ ...newTask, priority: value })
                    }
                    options={taskPriorities}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Type"
                    value={newTask.type}
                    onChange={(value) =>
                      setNewTask({ ...newTask, type: value })
                    }
                    options={taskTypes}
                  />
                  {!courseId && (
                    <Select
                      label="Course"
                      value={newTask.course_id}
                      onChange={(value) =>
                        setNewTask({ ...newTask, course_id: value })
                      }
                      options={[
                        { value: '', label: 'No Course' },
                        ...courses.map((course) => ({
                          value: course.id,
                          label: course.name,
                        })),
                      ]}
                    />
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewTask(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask}>Create Task</Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card
              hover
              className={`
                ${task.status === 'completed' ? 'bg-gray-50' : ''}
                ${
                  task.status !== 'completed' &&
                  new Date(task.due_date) < new Date()
                    ? 'border-red-200'
                    : ''
                }
              `}
            >
              <CardBody>
                <div className="flex items-start gap-4">
                  <button
                    onClick={() =>
                      handleStatusChange(
                        task.id,
                        task.status === 'completed' ? 'pending' : 'completed'
                      )
                    }
                    className={`
                      mt-1 rounded-full p-1 transition-colors
                      ${
                        task.status === 'completed'
                          ? 'text-green-500 bg-green-50'
                          : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                      }
                    `}
                  >
                    <CheckCircle size={20} />
                  </button>

                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3
                          className={`font-medium ${
                            task.status === 'completed'
                              ? 'text-gray-500 line-through'
                              : ''
                          }`}
                        >
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {task.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="icon"
                          size="sm"
                          className="text-gray-400 hover:text-blue-500"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="icon"
                          size="sm"
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span
                        className={`
                          inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full
                          ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }
                        `}
                      >
                        <AlertTriangle size={12} />
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </span>

                      {task.type && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {getTaskTypeIcon(task.type)}
                          {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                        </span>
                      )}

                      <span
                        className={`
                          inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full
                          ${
                            new Date(task.due_date) < new Date() &&
                            task.status !== 'completed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        `}
                      >
                        <Clock size={12} />
                        {format(new Date(task.due_date), 'MMM d, yyyy h:mm a')}
                      </span>

                      {task.course_id && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                          <BookOpen size={12} />
                          {
                            courses.find((c) => c.id === task.course_id)?.name ||
                              'Unknown Course'
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No tasks found</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setShowNewTask(true)}
            >
              Create your first task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};