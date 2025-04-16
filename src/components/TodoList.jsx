import { useState, useEffect } from "react";
import todoService from "../services/todoService";
import React from "react";
import { toast } from "react-toastify";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await todoService.getAllTodos();
      setTodos(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch todos");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    try {
      const newTodo = await todoService.createTodo(inputValue);
      setTodos([...todos, newTodo]);
      setInputValue("");
      toast.success("Task added successfully!");
    } catch (err) {
      setError("Failed to create todo");
      toast.error("Failed to create todo");
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, {
        completed: !completed,
      });
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (err) {
      setError("Failed to update todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this task?")) {
        await todoService.deleteTodo(id);
        setTodos(todos.filter((todo) => todo._id !== id));
        toast.success("Task deleted successfully!");
      }
    } catch (err) {
      setError("Failed to delete todo");
      toast.error("Failed to delete todo");
    }
  };

  const startEditing = (todo) => {
    if (window.confirm("Are you sure you want to edit this task?")) {
      setEditingId(todo._id);
      setEditValue(todo.title);
    }
  };

  const handleEdit = async (id) => {
    if (!editValue.trim()) return;
    try {
      const updatedTodo = await todoService.updateTodo(id, {
        title: editValue,
      });
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
      setEditingId(null);
      toast.success("Task updated successfully!");
    } catch (err) {
      setError("Failed to update todo");
      toast.error("Failed to update todo");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: "url('/images/todo.jpg')" }} // or use an online URL
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 z-10 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 shadow-lg transition"
      >
        Logout
      </button>

      <div className="z-10 max-w-xl w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-black">
            Stay on Track, Crush Your Goals!
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm shadow">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow"
            >
              Add
            </button>
          </div>
        </form>

        <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo._id, todo.completed)}
                  className="h-5 w-5 accent-indigo-500"
                />
                {editingId === todo._id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEdit(todo._id);
                      else if (e.key === "Escape") setEditingId(null);
                    }}
                    className="flex-1 p-2 border rounded-md outline-none border-gray-300"
                    autoFocus
                  />
                ) : (
                  <span
                    className={`flex-1 text-lg ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                    onDoubleClick={() => startEditing(todo)}
                  >
                    {todo.title}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {editingId !== todo._id && (
                  <button
                    onClick={() => startEditing(todo)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
