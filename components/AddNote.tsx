"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AddNoteProps {
  onAdd: (title: string, content: string) => void;
}

export default function AddNote({ onAdd }: AddNoteProps) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [previewMode, setPreviewMode] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAdd(title, content);
    setTitle("");
    setContent("");
    setPreviewMode(false);
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={handleChangeTitle}
          placeholder="Note title..."
          className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 backdrop-blur-sm px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors shadow-lg"
          required
        />
        
        {/* Editor/Preview Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
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
            type="button"
            onClick={() => setPreviewMode(true)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              previewMode 
                ? "bg-indigo-600 text-white" 
                : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
            }`}
          >
            Preview
          </button>
          <span className="text-xs text-slate-400 ml-2">
            Supports Markdown formatting
          </span>
        </div>

        {previewMode ? (
            <div className="min-h-[200px] rounded-lg border border-slate-600/50 bg-slate-900/60 backdrop-blur-sm p-4 shadow-lg">
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || "*Start writing to see preview...*"}
                </ReactMarkdown>
              </div>
            </div>
        ) : (
          <textarea
            value={content}
            onChange={handleChangeContent}
            placeholder="Write your note in Markdown...

Examples:
# Heading
**Bold text**
*Italic text*
- List item
```code```"
            className="w-full h-48 rounded-lg border border-slate-600/50 bg-slate-900/60 backdrop-blur-sm px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 resize-none transition-colors shadow-lg font-mono text-sm"
            required
          />
        )}
      </div>
      
      <button
        type="submit"
        disabled={!title.trim() || !content.trim()}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 font-medium text-white hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/25"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Note
      </button>
    </form>
  );
}