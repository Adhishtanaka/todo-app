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
  onUpdate: (id: string, updates: { title?: string; description?: string; deadline?: string }) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");
  const [editDeadline, setEditDeadline] = useState(
    todo.deadline ? new Date(todo.deadline).toISOString().split('T')[0] : ""
  );
  const infoRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const isOverdue = () => {
    if (!todo.deadline || todo.completed) return false;
    return new Date(todo.deadline) < new Date();
  };

  const handleSaveEdit = () => {
    const updates: { title?: string; description?: string; deadline?: string } = {};
    
    if (editTitle !== todo.title) updates.title = editTitle;
    if (editDescription !== (todo.description || "")) updates.description = editDescription;
    if (editDeadline !== (todo.deadline ? new Date(todo.deadline).toISOString().split('T')[0] : "")) {
      updates.deadline = editDeadline ? new Date(editDeadline).toISOString() : "";
    }

    if (Object.keys(updates).length > 0) {
      onUpdate(todo.id, updates);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditDeadline(todo.deadline ? new Date(todo.deadline).toISOString().split('T')[0] : "");
    setIsEditing(false);
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
    <li className={`group relative rounded-lg border transition-all duration-200 shadow-lg ${
      isOverdue() 
        ? "border-red-500/40 bg-gradient-to-r from-red-950/40 via-slate-900/80 to-slate-800/60 shadow-red-500/10 backdrop-blur-sm" 
        : "border-slate-700/30 bg-gradient-to-r from-slate-800/40 to-slate-700/20 hover:border-slate-600/40 backdrop-blur-sm"
    } ${isEditing ? "ring-2 ring-indigo-400/40 shadow-indigo-500/20" : ""}`}>
      
      {/* Main Content */}
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-600/50 bg-slate-900/80 text-indigo-400 focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-0 backdrop-blur-sm"
        />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 backdrop-blur-sm px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                placeholder="Todo title"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 backdrop-blur-sm px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 resize-none"
                placeholder="Description (optional)"
                rows={2}
              />
              <input
                type="date"
                value={editDeadline}
                onChange={(e) => setEditDeadline(e.target.value)}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 backdrop-blur-sm px-3 py-2 text-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              />
              
              {/* Edit Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 px-3 py-1.5 text-sm font-medium text-white hover:from-slate-700 hover:to-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transition-all shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base font-medium leading-snug ${
                    todo.completed ? "text-slate-500 line-through" : "text-white"
                  }`}>
                    {todo.title}
                    {isOverdue() && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-red-500/30 to-pink-500/30 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-red-300 border border-red-500/30">
                        Overdue
                      </span>
                    )}
                  </h3>
                  
                  {todo.description && (
                    <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                      {todo.description}
                    </p>
                  )}
                  
                  {todo.deadline && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className={`text-sm font-medium ${
                        isOverdue() ? "text-red-400" : "text-slate-300"
                      }`}>
                        {new Date(todo.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Edit Button */}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-700/40 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-colors backdrop-blur-sm"
                    title="Edit todo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  {/* Info Button */}
                  <div className="relative" ref={infoRef}>
                    <button
                      onClick={() => setShowInfo(!showInfo)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-700/40 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors backdrop-blur-sm"
                      title="Show details"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    
                    {/* Info Modal */}
                    {showInfo && (
                      <div className="absolute right-0 top-full mt-2 z-20 w-72 rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md p-4 shadow-2xl shadow-slate-900/50">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white">Todo Details</h4>
                            <button
                              onClick={() => setShowInfo(false)}
                              className="rounded-lg p-1 text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Created:</span>
                              <span className="text-slate-300">{formatDate(todo.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Updated:</span>
                              <span className="text-slate-300">{formatDate(todo.updatedAt)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Status:</span>
                              <span className={`font-medium ${todo.completed ? "text-emerald-400" : "text-amber-400"}`}>
                                {todo.completed ? "Completed" : "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => onDelete(todo.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-colors backdrop-blur-sm"
                    title="Delete todo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
