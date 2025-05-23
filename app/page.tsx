"use client";

import { useState, useEffect } from "react";
import TodoItem from "@/components/TodoItem";
import AddTodo from "@/components/AddTodo";
import UserDialog from "@/components/UserDialog";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  deadline?: string;
  createdAt?: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    filterTodos();
  }, [todos, searchTerm]);

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-2xl rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-lg">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Todo List</h1>
          <UserDialog />
        </header>

        <div className="space-y-6">
         
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search todos..."
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              
              {(searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="rounded-md bg-neutral-700 px-3 py-2 text-xs text-white hover:bg-neutral-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Accordion for Add Todo section */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-800/50 overflow-hidden">
            <button 
              onClick={toggleAddTodo}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-700/30 transition-colors"
            >
              <h2 className="text-lg font-medium">Add New Todo</h2>
              <svg 
                className={`w-5 h-5 transform ${isAddTodoOpen ? 'rotate-180' : ''} transition-transform`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {/* Expanded content */}
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isAddTodoOpen ? "max-h-96 p-4" : "max-h-0"
              }`}
            >
              <AddTodo onAdd={addTodo} />
            </div>
          </div>

         <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-medium">Your Tasks</h2>
              <span className="text-sm text-neutral-400">
                {filteredTodos.length} {filteredTodos.length === 1 ? "task" : "tasks"}
              </span>
            </div>

            {filteredTodos.length === 0 ? (
              <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-800/30 p-8 text-center text-neutral-500">
                {todos.length === 0
                  ? "No todos yet. Add one above!"
                  : "No matching tasks found for your filters."}
              </div>
            ) : (
              <ul className="space-y-3">
                {filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}