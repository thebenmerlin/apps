import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../utils/storage';
import { Task } from '../types';

describe('Task Storage', () => {
  beforeEach(async () => {
    await storage.clearAll();
  });

  it('should store and retrieve tasks', async () => {
    const task: Task = {
      id: '1',
      title: 'Test Task',
      dueDate: '2025-01-13',
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storage.addTask(task);
    const tasks = await storage.getTasks();

    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Test Task');
  });

  it('should update a task', async () => {
    const task: Task = {
      id: '1',
      title: 'Test Task',
      dueDate: '2025-01-13',
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storage.addTask(task);
    await storage.updateTask('1', { completed: true });

    const tasks = await storage.getTasks();
    expect(tasks[0].completed).toBe(true);
  });

  it('should delete a task', async () => {
    const task: Task = {
      id: '1',
      title: 'Test Task',
      dueDate: '2025-01-13',
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storage.addTask(task);
    await storage.deleteTask('1');

    const tasks = await storage.getTasks();
    expect(tasks).toHaveLength(0);
  });
});
