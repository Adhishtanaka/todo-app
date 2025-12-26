"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: { title?: string; content?: string }) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function NoteItem({ note, onDelete, onUpdate, isExpanded, onToggleExpand }: NoteItemProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [previewMode, setPreviewMode] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getTrimmedContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const handleSaveEdit = () => {
    const updates: { title?: string; content?: string } = {};
    
    if (editTitle !== note.title) updates.title = editTitle;
    if (editContent !== note.content) updates.content = editContent;

    if (Object.keys(updates).length > 0) {
      onUpdate(note.id, updates);
    }
    setIsEditing(false);
    setPreviewMode(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
    setPreviewMode(false);
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
    <li className="group relative rounded-lg border border-slate-700/30 bg-gradient-to-r from-slate-800/40 to-slate-700/20 hover:border-slate-600/40 backdrop-blur-sm transition-all duration-200 shadow-lg">
      
      {/* Header - Always Visible */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/10 transition-colors"
        onClick={!isEditing ? onToggleExpand : undefined}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <svg 
              className={`w-5 h-5 text-slate-400 transform transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-white leading-snug truncate">
              {note.title}
            </h3>
            {!isExpanded && (
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                {getTrimmedContent(note.content)}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons - Always Visible on Hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
          {/* Edit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
              if (!isExpanded) onToggleExpand();
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-700/40 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-colors backdrop-blur-sm"
            title="Edit note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          {/* Info Button */}
          <div className="relative" ref={infoRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(!showInfo);
              }}
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
                    <h4 className="font-medium text-white">Note Details</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInfo(false);
                      }}
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
                      <span className="text-slate-300">{formatDate(note.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Updated:</span>
                      <span className="text-slate-300">{formatDate(note.updatedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Characters:</span>
                      <span className="text-slate-300">{note.content.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-colors backdrop-blur-sm"
            title="Delete note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? "max-h-[2000px] border-t border-slate-700/30" : "max-h-0"
      }`}>
        <div className="p-4 bg-slate-800/10 backdrop-blur-sm">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 backdrop-blur-sm px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                placeholder="Note title"
                autoFocus
              />
              
              {/* Editor/Preview Toggle */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setPreviewMode(false)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    !previewMode 
                      ? "bg-indigo-600 text-white" 
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setPreviewMode(true)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    previewMode 
                      ? "bg-indigo-600 text-white" 
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                >
                  Preview
                </button>
              </div>

              {previewMode ? (
                <div className="min-h-[200px] rounded-lg border border-slate-600/50 bg-slate-900/60 backdrop-blur-sm p-4">
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {editContent || "*No content to preview*"}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-48 rounded-lg border border-slate-600/50 bg-slate-900/60 backdrop-blur-sm px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 resize-none font-mono text-sm"
                  placeholder="Write your note in Markdown..."
                />
              )}
              
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
            /* Full Markdown Content */
            <div className="rounded-lg bg-slate-900/30 backdrop-blur-sm p-4 border border-slate-700/30">
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {note.content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}