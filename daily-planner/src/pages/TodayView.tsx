import { useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useNotifications } from '../hooks/useNotifications';
import { Task, Priority } from '../types';
import { dateUtils } from '../utils/date';
import TaskCard from '../components/TaskCard';
import FAB from '../components/FAB';
import Modal from '../components/Modal';
import { showInterstitialAd } from '../components/InterstitialAdPlaceholder';

interface TodayViewProps {
  showAll?: boolean;
  showCompleted?: boolean;
}

export default function TodayView({ showAll = false, showCompleted = false }: TodayViewProps) {
  const [selectedDate, setSelectedDate] = useState(dateUtils.today());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedCount, setCompletedCount] = useState(0);

  const {
    allTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getTasksForDate,
    getStats,
  } = useTasks();

  const { scheduleNotification, cancelNotification } = useNotifications();
  const stats = getStats();

  const displayTasks = useMemo(() => {
    let tasks = showAll
      ? allTasks
      : showCompleted
      ? allTasks.filter((t) => t.completed)
      : getTasksForDate(selectedDate);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tasks = tasks.filter(
        (t) => t.title.toLowerCase().includes(query) || t.notes?.toLowerCase().includes(query)
      );
    }

    return tasks.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [allTasks, showAll, showCompleted, selectedDate, getTasksForDate, searchQuery]);

  const handleToggleComplete = async (taskId: string) => {
    await toggleComplete(taskId);
    const newCount = completedCount + 1;
    setCompletedCount(newCount);

    // Show interstitial ad every 3 completions
    if (newCount % 3 === 0) {
      await showInterstitialAd();
    }
  };

  const handleDateChange = (direction: 'prev' | 'next') => {
    const newDate = direction === 'next'
      ? dateUtils.addDays(selectedDate, 1)
      : dateUtils.subtractDays(selectedDate, 1);
    setSelectedDate(newDate);
  };

  const handleSaveTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const taskData = {
      title: formData.get('title') as string,
      notes: formData.get('notes') as string,
      dueDate: formData.get('dueDate') as string,
      dueTime: formData.get('dueTime') as string || undefined,
      priority: formData.get('priority') as Priority,
      completed: false,
    };

    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);

        // Cancel old notification if exists
        if (editingTask.reminder) {
          await cancelNotification(editingTask.id);
        }
      } else {
        const newTask = await addTask(taskData);

        // Schedule notification if time is set
        if (taskData.dueTime && newTask) {
          const reminderDate = dateUtils.combineDateAndTime(taskData.dueDate, taskData.dueTime);
          await scheduleNotification(
            newTask.id,
            taskData.title,
            taskData.notes || 'Task reminder',
            reminderDate
          );
          await updateTask(newTask.id, { reminder: reminderDate });
        }
      }

      setShowAddModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingTask(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Stats */}
      {!showAll && !showCompleted && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completedToday} / {stats.totalToday}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{stats.percentageToday}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
            </div>
          </div>
        </div>
      )}

      {/* Date Navigation */}
      {!showAll && !showCompleted && (
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => handleDateChange('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Previous day"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {dateUtils.getRelativeDay(selectedDate)}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {dateUtils.format(selectedDate, 'MMMM D, YYYY')}
            </p>
          </div>

          <button
            onClick={() => handleDateChange('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Next day"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
        />
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {displayTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No matching tasks' : 'No tasks for this day'}
            </p>
          </div>
        ) : (
          displayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggleComplete}
              onEdit={openEditModal}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <FAB onClick={() => setShowAddModal(true)} />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={closeModal}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <form onSubmit={handleSaveTask} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={editingTask?.title}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={editingTask?.notes}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                required
                defaultValue={editingTask?.dueDate || selectedDate}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                type="time"
                id="dueTime"
                name="dueTime"
                defaultValue={editingTask?.dueTime}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue={editingTask?.priority || 'medium'}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              {editingTask ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
