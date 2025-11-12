import localforage from 'localforage';
import { Task } from '../types';

// Configure localforage
localforage.config({
  name: 'daily-planner',
  storeName: 'tasks',
  description: 'Task storage for Daily Planner app',
});

const TASKS_KEY = 'tasks';
const SETTINGS_KEY = 'settings';

export const storage = {
  // Task operations
  async getTasks(): Promise<Task[]> {
    try {
      const tasks = await localforage.getItem<Task[]>(TASKS_KEY);
      return tasks || [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  async setTasks(tasks: Task[]): Promise<void> {
    try {
      await localforage.setItem(TASKS_KEY, tasks);
    } catch (error) {
      console.error('Error setting tasks:', error);
      throw error;
    }
  },

  async addTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    tasks.push(task);
    await this.setTasks(tasks);
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
      await this.setTasks(tasks);
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter((t) => t.id !== taskId);
    await this.setTasks(filtered);
  },

  // Settings operations
  async getSetting<T>(key: string): Promise<T | null> {
    try {
      const settings = await localforage.getItem<Record<string, any>>(SETTINGS_KEY);
      return settings?.[key] ?? null;
    } catch (error) {
      console.error('Error getting setting:', error);
      return null;
    }
  },

  async setSetting<T>(key: string, value: T): Promise<void> {
    try {
      const settings = (await localforage.getItem<Record<string, any>>(SETTINGS_KEY)) || {};
      settings[key] = value;
      await localforage.setItem(SETTINGS_KEY, settings);
    } catch (error) {
      console.error('Error setting setting:', error);
      throw error;
    }
  },

  // Bulk operations
  async exportData(): Promise<string> {
    const tasks = await this.getTasks();
    const settings = await localforage.getItem(SETTINGS_KEY);
    return JSON.stringify({ tasks, settings, version: '1.0.0' }, null, 2);
  },

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      if (data.tasks) {
        await this.setTasks(data.tasks);
      }
      if (data.settings) {
        await localforage.setItem(SETTINGS_KEY, data.settings);
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid data format');
    }
  },

  async clearAll(): Promise<void> {
    await localforage.clear();
  },
};
