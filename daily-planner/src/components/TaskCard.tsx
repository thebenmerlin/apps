import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Task } from '../types';
import { dateUtils } from '../utils/date';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-150, 0, 150],
    ['#EF4444', '#ffffff', '#10B981']
  );

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onToggle(task.id);
    } else if (info.offset.x < -100) {
      onDelete(task.id);
    }
  };

  return (
    <motion.div
      className="relative mb-3 overflow-hidden rounded-lg"
      style={{ background }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={`
          bg-white dark:bg-gray-800 p-4 cursor-grab active:cursor-grabbing
          ${task.completed ? 'opacity-60' : ''}
        `}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(task.id)}
            className="flex-shrink-0 mt-1"
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <div
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center
                ${
                  task.completed
                    ? 'bg-primary border-primary'
                    : 'border-gray-300 dark:border-gray-600'
                }
              `}
            >
              {task.completed && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </button>

          <div className="flex-1 min-w-0" onClick={() => onEdit(task)}>
            <h3
              className={`
                text-base font-medium text-gray-900 dark:text-white
                ${task.completed ? 'line-through' : ''}
              `}
            >
              {task.title}
            </h3>
            {task.notes && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {task.notes}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              {task.dueTime && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {dateUtils.formatTime(task.dueTime)}
                </span>
              )}
              {task.reminder && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  🔔 Reminder
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <span className="text-green-600 font-medium">✓ Complete</span>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <span className="text-red-600 font-medium">Delete ✕</span>
      </div>
    </motion.div>
  );
}
