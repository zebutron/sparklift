import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, ChevronDown, GripVertical } from 'lucide-react';
import { Task } from '../types';
import { useStore } from '../store';

interface TaskItemProps {
  task: Task;
  depth?: number;
  autoFocus?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, depth = 0, autoFocus = false }) => {
  const [isEditing, setIsEditing] = useState(autoFocus);
  const [description, setDescription] = useState(task.description);
  const [scope, setScope] = useState('00:30');
  const [error, setError] = useState('');
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const scopeInputRef = useRef<HTMLInputElement>(null);
  const updateTask = useStore((state) => state.updateTask);
  const toggleCollapse = useStore((state) => state.toggleCollapse);

  useEffect(() => {
    if (autoFocus && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  }, [autoFocus]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${depth * 2}rem`,
  };

  const parseTimeToSeconds = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60 + minutes) * 60;
  };

  const formatTimeFromSeconds = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && description.trim()) {
      if (scopeInputRef.current) {
        e.preventDefault();
        scopeInputRef.current.focus();
      }
    }
  };

  const handleScopeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const seconds = parseTimeToSeconds(scope);
      if (seconds > 0) {
        setError('');
        updateTask(task.id, { 
          description, 
          scope: seconds
        });
        setIsEditing(false);
      } else {
        setError('Task definition requires scope');
      }
    }
  };

  const handleScopeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}:\d{0,2}$/.test(value)) {
      setScope(value);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div className="flex items-center gap-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg mb-2">
        <button
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-gray-500" />
        </button>

        {task.children.length > 0 && (
          <button
            onClick={() => toggleCollapse(task.id)}
            className="text-gray-500 hover:text-gray-300"
          >
            {task.isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}

        {isEditing ? (
          <div className="flex-1 flex gap-2">
            <input
              ref={descriptionInputRef}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleDescriptionKeyDown}
              className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100"
              autoFocus={autoFocus}
            />
            <input
              ref={scopeInputRef}
              type="text"
              value={scope}
              onChange={handleScopeChange}
              onKeyDown={handleScopeKeyDown}
              className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100 time-input"
              placeholder="HH:MM"
            />
          </div>
        ) : (
          <div
            className="flex-1 flex justify-between items-center cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <span className="text-gray-100">{task.description}</span>
            <span className="text-sm text-gray-400">{formatTimeFromSeconds(task.scope)}</span>
          </div>
        )}
      </div>

      {!task.isCollapsed && task.children.length > 0 && (
        <div className="ml-4">
          {task.children.map((child) => (
            <TaskItem key={child.id} task={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};