import React, { useState } from "react";
import type { Todo } from "../types/Todo";
import { useNavigate } from "react-router-dom";
import { useTodos } from "../hooks/useTodos";
import { EditTodoModal } from "./EditTodoModal";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const navigate = useNavigate();
  const { updateTodo, deleteTodo, canComplete, ghostingTodos } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [countdown, setCountdown] = useState(15);
  
  const isGhosting = ghostingTodos.has(todo.id);
  const isCompletable = canComplete(todo.id);

  // Countdown timer for ghosting items
  React.useEffect(() => {
    if (isGhosting) {
      const timer = setInterval(() => {
        setCountdown(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isGhosting]);

  const handleToggle = async () => {
    if (!todo.completed && !isCompletable) return; // FIFO enforcement
    const success = await updateTodo(todo.id, { completed: !todo.completed });
    if (success) navigate("/"); // Programmatic Navigation Requirement
  };

  const handleDelete = async () => {
    const success = await deleteTodo(todo.id);
    if (success) navigate("/"); // Programmatic Navigation Requirement
  };

  const handleEdit = async (newTitle: string) => {
    await updateTodo(todo.id, { title: newTitle });
    setIsEditing(false);
  };

  return (
    <>
      {/* FIX Technical Debt #3: Use todo.id as key (not index) — applied in TodoList */}
      <li className={`todo-item ${todo.completed ? "completed" : ""} ${isGhosting ? "ghosting" : ""}`}>
        <div className="todo-left">
          <button
            className={`toggle-btn ${todo.completed ? "checked" : ""} ${!todo.completed && !isCompletable ? "disabled" : ""}`}
            onClick={handleToggle}
            disabled={!todo.completed && !isCompletable}
            title={!todo.completed && !isCompletable ? "Complete tasks in FIFO order" : "Toggle completion"}
          >
            {todo.completed ? "✓" : "○"}
          </button>
          <div className="todo-info">
            <span className="todo-title">{todo.title}</span>
            <span className="todo-hash" title={`Hash: ${todo.hash}`}>
              🔗 {todo.hash.substring(0, 12)}...
            </span>
          </div>
        </div>
        <div className="todo-actions">
          {isGhosting && (
            <span className="ghost-badge">👻 {countdown}s</span>
          )}
          {!todo.completed && isCompletable && (
            <span className="fifo-badge">▶ Next</span>
          )}
          <button className="btn btn-sm btn-edit" onClick={() => setIsEditing(true)} title="Edit">✏️</button>
          <button className="btn btn-sm btn-delete" onClick={handleDelete} title="Delete">🗑️</button>
        </div>
      </li>

      <EditTodoModal
        isOpen={isEditing}
        currentTitle={todo.title}
        onClose={() => setIsEditing(false)}
        onSave={handleEdit}
      />
    </>
  );
};
