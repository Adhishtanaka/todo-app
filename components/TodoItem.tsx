"use client";

interface Todo {
  id: string;
  title: string;
  description?: string | null;
  deadline?: string | null;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-800 p-4 shadow-sm">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
          className="mr-3 h-5 w-5 rounded border-neutral-600 bg-neutral-900 text-indigo-500 focus:ring-indigo-500"
        />
        <div>
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
      <button
        onClick={() => onDelete(todo.id)}
        className="ml-4 rounded bg-red-300 px-2 py-1 text-xs text-black hover:bg-red-400"
      >
        Delete
      </button>
    </li>
  );
}
