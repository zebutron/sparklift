import { create } from 'zustand';
import { Task, TaskStore } from './types';

export const useStore = create<TaskStore>((set) => ({
  tasks: [],
  activeTab: 'stack',
  currentTaskId: null,
  timerRunning: false,
  elapsedTime: 0,

  addTask: (task, parentId = null) => set((state) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      description: task.description || '',
      scope: task.scope || 1800, // 30 minutes default
      parentId,
      isCollapsed: false,
      children: [],
      ...task,
    };

    if (!parentId) {
      return { tasks: [...state.tasks, newTask] }; // Add to bottom instead of top
    }

    const updateChildren = (tasks: Task[]): Task[] => {
      return tasks.map(t => {
        if (t.id === parentId) {
          return { ...t, children: [...t.children, newTask] }; // Add to bottom of children
        }
        if (t.children.length > 0) {
          return { ...t, children: updateChildren(t.children) };
        }
        return t;
      });
    };

    return { tasks: updateChildren(state.tasks) };
  }),

  updateTask: (id, updates) => set((state) => {
    const updateTaskInList = (tasks: Task[]): Task[] => {
      return tasks.map(task => {
        if (task.id === id) {
          return { ...task, ...updates };
        }
        if (task.children.length > 0) {
          return { ...task, children: updateTaskInList(task.children) };
        }
        return task;
      });
    };

    return { tasks: updateTaskInList(state.tasks) };
  }),

  deleteTask: (id) => set((state) => {
    const deleteFromList = (tasks: Task[]): Task[] => {
      return tasks.filter(task => {
        if (task.id === id) return false;
        if (task.children.length > 0) {
          task.children = deleteFromList(task.children);
        }
        return true;
      });
    };

    return { tasks: deleteFromList(state.tasks) };
  }),

  moveTask: (taskId, newIndex) => set((state) => {
    const findAndRemove = (tasks: Task[]): [Task[], Task | null] => {
      let found: Task | null = null;
      const newTasks = tasks.filter(task => {
        if (task.id === taskId) {
          found = task;
          return false;
        }
        if (task.children.length > 0) {
          const [newChildren, foundInChildren] = findAndRemove(task.children);
          task.children = newChildren;
          if (foundInChildren) found = foundInChildren;
        }
        return true;
      });
      return [newTasks, found];
    };

    const [tasksWithoutMoved, movedTask] = findAndRemove(state.tasks);
    if (!movedTask) return state;

    const newTasks = [
      ...tasksWithoutMoved.slice(0, newIndex),
      movedTask,
      ...tasksWithoutMoved.slice(newIndex)
    ];

    return { tasks: newTasks };
  }),

  toggleCollapse: (id) => set((state) => ({
    tasks: state.tasks.map(task => {
      if (task.id === id) {
        return { ...task, isCollapsed: !task.isCollapsed };
      }
      return task;
    })
  })),

  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleTimer: () => set((state) => ({ timerRunning: !state.timerRunning })),
  updateElapsedTime: (time) => set({ elapsedTime: time }),
}));