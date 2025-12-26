"use client";

import { useState, useEffect } from "react";
import TodoItem from "@/components/TodoItem";
import AddTodo from "@/components/AddTodo";
import NoteItem from "@/components/NoteItem";
import AddNote from "@/components/AddNote";
import ProfileButton from "@/components/ProfileButton";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<"todos" | "notes">("todos");
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<Set<string>>(new Set());

  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  useEffect(() => {
    fetchTodos();
    fetchNotes();
  }, []);

  useEffect(() => {
    filterTodos();
    filterNotes();
  }, [todos, notes, searchTerm]);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (!response.ok) throw new Error("Failed to fetch todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const filterTodos = () => {
    let filtered = [...todos];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        todo =>
          todo.title.toLowerCase().includes(term) ||
          (todo.description && todo.description.toLowerCase().includes(term))
      );
    }
    setFilteredTodos(filtered);
  };

  const filterNotes = () => {
    let filtered = [...notes];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        note =>
          note.title.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term)
      );
    }
    setFilteredNotes(filtered);
  };

  const addTodo = async (title: string, description?: string, deadline?: string) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, deadline }),
      });

      if (!response.ok) throw new Error("Failed to add todo");
      const newTodo: Todo = await response.json();
      setTodos((prev) => [newTodo, ...prev]);
      // Optionally close the accordion after adding
      setIsAddTodoOpen(false);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    setUpdatingTodoIds(prev => new Set(prev).add(id));
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) throw new Error("Failed to update todo");

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setUpdatingTodoIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const updateTodo = async (id: string, updates: { title?: string; description?: string; deadline?: string }) => {
    setUpdatingTodoIds(prev => new Set(prev).add(id));
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update todo");

      const updatedTodo: Todo = await response.json();
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setUpdatingTodoIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const addNote = async (title: string, content: string) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) throw new Error("Failed to add note");
      const newNote: Note = await response.json();
      setNotes((prev) => [newNote, ...prev]);
      setIsAddNoteOpen(false);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const updateNote = async (id: string, updates: { title?: string; content?: string }) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update note");

      const updatedNote: Note = await response.json();
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      );
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete note");

      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete todo");

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
  };

  const toggleAddTodo = () => {
    setIsAddTodoOpen(prev => !prev);
  };

  const toggleAddNote = () => {
    setIsAddNoteOpen(prev => !prev);
  };

  const handleNoteExpand = (noteId: string) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-4xl rounded-xl border border-slate-800/50 bg-slate-900/80 backdrop-blur-sm p-6 shadow-2xl shadow-blue-950/20">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {currentView === "todos" ? "Todo List" : "Notes"}
          </h1>
          <div className="flex items-center gap-4">
            {/* View Toggle Switch */}
            <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={() => setCurrentView("todos")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  currentView === "todos"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Todos
              </button>
              <button
                onClick={() => setCurrentView("notes")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  currentView === "notes"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Notes
              </button>
            </div>
            <ProfileButton />
          </div>
        </header>

        <div className="space-y-6">
         
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${currentView}...`}
                className="w-full rounded-md border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm px-4 py-2 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400/50"
              />
            </div>
            <div className="flex items-center space-x-2">
              
              {(searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="rounded-md bg-slate-700/50 backdrop-blur-sm px-3 py-2 text-xs text-white hover:bg-slate-600/50 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Add Todo/Note Section */}
          {currentView === "todos" ? (
            <div className="rounded-xl border border-slate-700/30 bg-slate-800/20 backdrop-blur-sm overflow-hidden shadow-lg">
              <button 
                onClick={toggleAddTodo}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-indigo-500/30 to-blue-600/30 p-2 backdrop-blur-sm">
                    <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-white">Add New Todo</h2>
                </div>
                <svg 
                  className={`w-5 h-5 text-slate-400 transform ${isAddTodoOpen ? 'rotate-180' : ''} transition-transform group-hover:text-white`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isAddTodoOpen ? "max-h-96 border-t border-slate-700/30" : "max-h-0"
                }`}
              >
                <div className="p-4 bg-slate-800/10 backdrop-blur-sm">
                  <AddTodo onAdd={addTodo} />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-700/30 bg-slate-800/20 backdrop-blur-sm overflow-hidden shadow-lg">
              <button 
                onClick={toggleAddNote}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-emerald-500/30 to-teal-600/30 p-2 backdrop-blur-sm">
                    <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-white">Add New Note</h2>
                </div>
                <svg 
                  className={`w-5 h-5 text-slate-400 transform ${isAddNoteOpen ? 'rotate-180' : ''} transition-transform group-hover:text-white`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isAddNoteOpen ? "max-h-[600px] border-t border-slate-700/30" : "max-h-0"
                }`}
              >
                <div className="p-4 bg-slate-800/10 backdrop-blur-sm">
                  <AddNote onAdd={addNote} />
                </div>
              </div>
            </div>
          )}

         <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-2 backdrop-blur-sm">
                  {currentView === "todos" ? (
                    <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
                <h2 className="text-lg font-medium text-white">
                  Your {currentView === "todos" ? "Tasks" : "Notes"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">
                  {currentView === "todos" 
                    ? `${filteredTodos.length} ${filteredTodos.length === 1 ? "task" : "tasks"}`
                    : `${filteredNotes.length} ${filteredNotes.length === 1 ? "note" : "notes"}`
                  }
                </span>
                {currentView === "todos" && filteredTodos.some(todo => !todo.completed && todo.deadline && new Date(todo.deadline) < new Date()) && (
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm px-2 py-1 text-xs font-medium text-red-400 border border-red-500/20">
                    {filteredTodos.filter(todo => !todo.completed && todo.deadline && new Date(todo.deadline) < new Date()).length} overdue
                  </span>
                )}
              </div>
            </div>

            {currentView === "todos" ? (
              filteredTodos.length === 0 ? (
                <div className="mt-6 rounded-xl border border-slate-700/30 bg-gradient-to-br from-slate-800/20 to-slate-700/10 backdrop-blur-sm p-8 text-center shadow-lg">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-slate-700/50 to-slate-600/30 backdrop-blur-sm flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-300 mb-2">
                    {todos.length === 0 ? "No todos yet" : "No matching tasks"}
                  </h3>
                  <p className="text-slate-500">
                    {todos.length === 0
                      ? "Create your first todo using the form above"
                      : "Try adjusting your search filters"}
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {filteredTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onUpdate={updateTodo}
                      isUpdating={updatingTodoIds.has(todo.id)}
                    />
                  ))}
                </ul>
              )
            ) : (
              filteredNotes.length === 0 ? (
                <div className="mt-6 rounded-xl border border-slate-700/30 bg-gradient-to-br from-slate-800/20 to-slate-700/10 backdrop-blur-sm p-8 text-center shadow-lg">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-slate-700/50 to-slate-600/30 backdrop-blur-sm flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-300 mb-2">
                    {notes.length === 0 ? "No notes yet" : "No matching notes"}
                  </h3>
                  <p className="text-slate-500">
                    {notes.length === 0
                      ? "Create your first note using the form above"
                      : "Try adjusting your search filters"}
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {filteredNotes.map((note) => (
                    <NoteItem
                      key={note.id}
                      note={note}
                      onDelete={deleteNote}
                      onUpdate={updateNote}
                      isExpanded={expandedNoteId === note.id}
                      onToggleExpand={() => handleNoteExpand(note.id)}
                    />
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
      </div>
      <footer className="mt-8 text-center">
        <p className="text-slate-400 text-sm">Made by Adhishtaaka</p>
      </footer>
      
    </div>
  );
}