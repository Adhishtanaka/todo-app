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

  const handleChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleChangeDeadline = (e: ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        value={title}
        onChange={handleChangeTitle}
        placeholder="Add a new todo..."
        className="flex-1 rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <input
        type="text"
        value={description}
        onChange={handleChangeDescription}
        placeholder="Add description..."
        className="rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <input
        type="date"
        value={deadline}
        onChange={handleChangeDeadline}
        className="rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add
      </button>
    </form>
  );
}
