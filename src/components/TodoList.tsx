import { useTodos } from "../hooks/useTodos";
import { TodoItem } from "./TodoItem";

export const TodoList = () => {
  const { todos, isLoading, error } = useTodos();

  if (isLoading) {
    return <div className="loading-state">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error-state">⚠️ {error}</div>;
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📋</span>
        <p>No tasks yet. Add one above!</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {/* FIX Technical Debt #3: Use todo.id as key, NOT index */}
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};
