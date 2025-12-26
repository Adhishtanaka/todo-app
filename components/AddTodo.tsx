"use client";
import { useState, ChangeEvent, FormEvent } from "react";

interface AddTodoProps {
  onAdd: (title: string, description?: string, deadline?: string) => void;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const isoDeadline = deadline ? new Date(deadline).toISOString() : undefined;
    onAdd(title, description, isoDeadline);
    setTitle("");
    setDescription("");
    setDeadline("");
  };
  

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleChangeDeadline = (e: ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={handleChangeTitle}
          placeholder="What needs to be done?"
          className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 backdrop-blur-sm px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors shadow-lg"
          required
        />
        <textarea
          value={description}
          onChange={handleChangeDescription}
          placeholder="Add a description (optional)"
          className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 backdrop-blur-sm px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 resize-none transition-colors shadow-lg"
          rows={3}
        />
        <input
          type="date"
          value={deadline}
          onChange={handleChangeDeadline}
          className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 backdrop-blur-sm px-4 py-3 text-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors shadow-lg"
          placeholder="Set deadline (optional)"
        />
      </div>
      
      <button
        type="submit"
        disabled={!title.trim()}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 font-medium text-white hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/25"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Todo
      </button>
    </form>
  );
}
