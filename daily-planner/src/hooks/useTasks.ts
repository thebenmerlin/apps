import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFilters } from '../types';
import { storage } from '../utils/storage';
import { dateUtils } from '../utils/date';

export function useTasks(filters?: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from storage
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const storedTasks = await storage.getTasks();
      setTasks(storedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Add task
  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await storage.addTask(newTask);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
      throw err;
    }
  }, []);

  // Update task
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      await storage.updateTask(taskId, updates);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task
        )
      );
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    }
  }, []);

  // Delete task
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await storage.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
      throw err;
    }
  }, []);

  // Toggle task completion
  const toggleComplete = useCallback(async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
    }
  }, [tasks, updateTask]);

  // Filter tasks
  const filteredTasks = useCallback(() => {
    let result = [...tasks];

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.notes?.toLowerCase().includes(search)
      );
    }

    if (filters?.priority) {
      result = result.filter((task) => task.priority === filters.priority);
    }

    if (filters?.date) {
      result = result.filter((task) => task.dueDate === filters.date);
    }

    if (filters?.completed !== undefined) {
      result = result.filter((task) => task.completed === filters.completed);
    }

    return result;
  }, [tasks, filters]);

  // Get tasks for today
  const getTodayTasks = useCallback(() => {
    const today = dateUtils.today();
    return tasks.filter((task) => task.dueDate === today);
  }, [tasks]);

  // Get tasks for a specific date
  const getTasksForDate = useCallback((date: string) => {
    return tasks.filter((task) => task.dueDate === date);
  }, [tasks]);

  // Get tasks for current week
  const getWeekTasks = useCallback(() => {
    const weekDays = dateUtils.getWeekDays();
    return tasks.filter((task) => weekDays.includes(task.dueDate));
  }, [tasks]);

  // Get completion stats
  const getStats = useCallback(() => {
    const today = dateUtils.today();
    const todayTasks = tasks.filter((task) => task.dueDate === today);
    const completedToday = todayTasks.filter((task) => task.completed).length;
    const totalToday = todayTasks.length;

    return {
      completedToday,
      totalToday,
      percentageToday: totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0,
      totalTasks: tasks.length,
      totalCompleted: tasks.filter((task) => task.completed).length,
    };
  }, [tasks]);

  return {
    tasks: filteredTasks(),
    allTasks: tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getTodayTasks,
    getTasksForDate,
    getWeekTasks,
    getStats,
    refresh: loadTasks,
  };
}
