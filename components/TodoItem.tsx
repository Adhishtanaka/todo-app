"use client";

import { useState, useRef, useEffect } from "react";

interface Todo {
  id: string;
  title: string;
  description?: string | null;
  deadline?: string | null;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Close info modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setShowInfo(false);
      }
    };

    if (showInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInfo]);

  return (
    <li className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-800 p-4 shadow-sm">
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
          className="mr-3 h-5 w-5 rounded border-neutral-600 bg-neutral-900 text-indigo-500 focus:ring-indigo-500"
        />
        <div className="flex-1">
          <p
            className={`text-base font-medium ${
              todo.completed ? "text-neutral-500 line-through" : "text-white"
            }`}
          >
            {todo.title}
          </p>
          {todo.description && (
            <p className="text-sm text-neutral-400 mt-1">{todo.description}</p>
          )}
          {todo.deadline && (
            <p className="text-sm text-neutral-300 mt-1">
              Deadline: {new Date(todo.deadline).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 ml-4">
        {/* Info Button */}
        <div className="relative" ref={infoRef}>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="rounded-full bg-blue-600 p-2 text-xs text-white hover:bg-blue-700 transition-colors"
            title="Show info"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          {/* Info Modal/Tooltip */}
          {showInfo && (
            <div className="absolute right-0 top-full mt-2 z-10 w-64 rounded-lg border border-neutral-700 bg-neutral-800 p-3 shadow-lg">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-neutral-300">Created:</span>
                  <p className="text-neutral-400">{formatDate(todo.createdAt)}</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-300">Updated:</span>
                  <p className="text-neutral-400">{formatDate(todo.updatedAt)}</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-300">Status:</span>
                  <p className="text-neutral-400">{todo.completed ? "Completed" : "Pending"}</p>
                </div>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="mt-2 text-xs text-neutral-500 hover:text-neutral-300"
              >
                Close
              </button>
            </div>
          )}
        </div>
        
        {/* Delete Button */}
        <button
          onClick={() => onDelete(todo.id)}
          className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
