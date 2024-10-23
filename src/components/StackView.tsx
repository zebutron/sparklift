import React, { useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useStore } from '../store';
import { TaskItem } from './TaskItem';

export const StackView: React.FC = () => {
  const { tasks, addTask, moveTask } = useStore();
  const [error, setError] = React.useState('');
  const tasksContainerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      moveTask(active.id, newIndex);
    }
  };

  const handleAddTask = () => {
    addTask({ description: '' });
    // Scroll to bottom after adding new task
    setTimeout(() => {
      if (tasksContainerRef.current) {
        tasksContainerRef.current.scrollTop = tasksContainerRef.current.scrollHeight;
      }
    }, 0);
  };

  // Auto-scroll when tasks change
  useEffect(() => {
    if (tasksContainerRef.current && tasks.length > 0 && tasks[tasks.length - 1].description === '') {
      tasksContainerRef.current.scrollTop = tasksContainerRef.current.scrollHeight;
    }
  }, [tasks]);

  return (
    <div className="relative h-full flex flex-col p-4">
      {error && (
        <div className="mb-4 text-red-400 text-center">
          {error}
        </div>
      )}

      <div 
        ref={tasksContainerRef}
        className="flex-1 overflow-y-auto pr-2 mb-16 space-y-1"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task, index) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                autoFocus={index === tasks.length - 1 && task.description === ''}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <button
          onClick={handleAddTask}
          className="px-6 py-2 bg-green-500 bg-opacity-20 text-green-300 rounded-lg hover:bg-opacity-30 transition-colors"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};