import { useMemo, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { dateUtils } from '../utils/date';
import { Task } from '../types';

export default function WeekView() {
  const [selectedWeekStart, setSelectedWeekStart] = useState(dateUtils.startOfWeek());
  const { allTasks } = useTasks();

  const weekDays = useMemo(() => {
    return dateUtils.getWeekDays(selectedWeekStart);
  }, [selectedWeekStart]);

  const getTasksForDay = (date: string): Task[] => {
    return allTasks.filter((t) => t.dueDate === date);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Week View</h2>

      <div className="grid gap-4">
        {weekDays.map((date) => {
          const tasks = getTasksForDay(date);
          const isToday = dateUtils.isToday(date);

          return (
            <div
              key={date}
              className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${
                isToday ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {dateUtils.getDayName(date)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {dateUtils.format(date, 'MMM D')}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {tasks.length} tasks
                </span>
              </div>

              <div className="space-y-2">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <p className={`text-gray-900 dark:text-white ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </p>
                  </div>
                ))}
                {tasks.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +{tasks.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
