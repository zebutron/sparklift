export interface Task {
  id: string;
  description: string;
  scope: number; // Duration in seconds
  parentId: string | null;
  isCollapsed: boolean;
  children: Task[];
}

export interface TaskStore {
  tasks: Task[];
  activeTab: 'stack' | 'focus';
  currentTaskId: string | null;
  timerRunning: boolean;
  elapsedTime: number;
  addTask: (task: Partial<Task>, parentId?: string | null) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newIndex: number) => void;
  toggleCollapse: (id: string) => void;
  setActiveTab: (tab: 'stack' | 'focus') => void;
  toggleTimer: () => void;
  updateElapsedTime: (time: number) => void;
}