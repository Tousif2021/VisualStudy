import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, List } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TaskManager } from '../components/tasks/TaskManager';
import { useAppStore } from '../lib/store';

export const Tasks: React.FC = () => {
  const { tasks, fetchTasks } = useAppStore();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Group tasks by date for calendar view
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = format(new Date(task.due_date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  // Calendar view days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add padding days from previous month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const paddingDate = new Date(year, month, -i);
      days.push({
        date: paddingDate,
        isCurrentMonth: false,
        hasTasks: false,
      });
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      const dateString = format(currentDate, 'yyyy-MM-dd');
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        hasTasks: !!tasksByDate[dateString],
        tasks: tasksByDate[dateString] || [],
      });
    }

    // Add padding days from next month
    const endPadding = 42 - days.length; // 6 rows × 7 days = 42
    for (let i = 1; i <= endPadding; i++) {
      const paddingDate = new Date(year, month + 1, i);
      days.push({
        date: paddingDate,
        isCurrentMonth: false,
        hasTasks: false,
      });
    }

    return days;
  };

  const calendarDays = getDaysInMonth(selectedDate);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        <div className="flex gap-2">
          <Button
            variant={view === 'list' ? 'primary' : 'outline'}
            onClick={() => setView('list')}
            leftIcon={<List size={16} />}
          >
            List
          </Button>
          <Button
            variant={view === 'calendar' ? 'primary' : 'outline'}
            onClick={() => setView('calendar')}
            leftIcon={<CalendarIcon size={16} />}
          >
            Calendar
          </Button>
        </div>
      </div>

      {view === 'list' ? (
        <Card>
          <CardBody>
            <TaskManager onUpdate={fetchTasks} initialTasks={tasks} />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))
                }
              >
                Previous
              </Button>
              <h2 className="text-xl font-semibold">
                {format(selectedDate, 'MMMM yyyy')}
              </h2>
              <Button
                variant="outline"
                onClick={() =>
                  setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))
                }
              >
                Next
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="bg-gray-50 p-2 text-center text-sm font-semibold"
                >
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`
                    min-h-[120px] p-2 bg-white
                    ${!day.isCurrentMonth ? 'text-gray-400' : ''}
                    ${
                      format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                        ? 'bg-blue-50'
                        : ''
                    }
                  `}
                >
                  <div className="font-medium mb-1">{format(day.date, 'd')}</div>
                  {day.tasks?.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className={`
                        text-xs p-1 mb-1 rounded truncate
                        ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }
                      `}
                    >
                      {task.title}
                    </div>
                  ))}
                  {day.tasks?.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{day.tasks.length - 3} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};