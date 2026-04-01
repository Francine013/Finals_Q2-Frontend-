import { AddTodoForm } from "../components/AddTodoForm";
import { TodoList } from "../components/TodoList";
import { useTodos } from "../hooks/useTodos";

export const TodoPage = () => {
  const { chainStatus, verifyChain } = useTodos();

  return (
    <main className="container">
      <div className="page-header">
        <h1>Task Manager</h1>
        <p>Blockchain-secured, focus-optimized productivity.</p>
      </div>

      <AddTodoForm />
      <TodoList />

      <div className="chain-info">
        <button onClick={verifyChain} className="btn btn-ghost btn-sm">
          🔍 Verify Chain
        </button>
        <span className={`chain-status ${chainStatus.valid ? "valid" : "invalid"}`}>
          {chainStatus.valid ? "✅ " : "❌ "}
          {chainStatus.message}
        </span>
      </div>
    </main>
  );
};
