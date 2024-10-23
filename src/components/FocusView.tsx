import React, { useEffect } from 'react';
import { Play, Pause, Plus } from 'lucide-react';
import { useStore } from '../store';

export const FocusView: React.FC = () => {
  const {
    tasks,
    timerRunning,
    elapsedTime,
    toggleTimer,
    updateElapsedTime,
    setActiveTab
  } = useStore();

  const currentTask = tasks[0];
  const parentTask = currentTask?.parentId
    ? tasks.find(t => t.id === currentTask.parentId)
    : null;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: number;
    if (timerRunning && currentTask) {
      interval = setInterval(() => {
        updateElapsedTime(elapsedTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, elapsedTime]);

  const progress = currentTask
    ? (elapsedTime / currentTask.scope) * 100
    : 0;

  if (!currentTask) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <p className="mb-4">No tasks in your stack</p>
        <button
          onClick={() => setActiveTab('stack')}
          className="px-6 py-2 bg-green-500 bg-opacity-20 text-green-300 rounded-lg hover:bg-opacity-30 transition-colors"
        >
          Add Task
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col bg-gray-800">
      {/* Timer and Progress Bar */}
      <div className="relative">
        <div
          className="absolute inset-0 bg-gray-700 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
        <div className="relative px-4 py-8 text-center">
          <span className="text-4xl font-mono text-gray-100">
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      {/* Task Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {parentTask && (
          <p className="text-gray-500 text-sm mb-2">
            {parentTask.description}
          </p>
        )}
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-100">
          {currentTask.description}
        </h1>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 inset-x-0 p-4 flex justify-between">
        <button
          onClick={toggleTimer}
          className="p-4 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600"
        >
          {timerRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('stack')}
          className="p-4 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};