import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Todo, ChainStatus } from "../types/Todo";

const API_URL = "http://localhost:5000/api/todos";

interface TodoContextType {
  todos: Todo[];
  chainStatus: ChainStatus;
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string, nonce?: number) => Promise<boolean>;
  updateTodo: (id: string, updates: Partial<Pick<Todo, "title" | "completed">>, nonce?: number) => Promise<boolean>;
  deleteTodo: (id: string) => Promise<boolean>;
  verifyChain: () => Promise<void>;
  // Focus-Flow
  activeTodoCount: number;
  canAddTodo: boolean;
  canComplete: (id: string) => boolean;
  ghostingTodos: Set<string>;
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [chainStatus, setChainStatus] = useState<ChainStatus>({ valid: true, message: "Chain Valid" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ghostingTodos, setGhostingTodos] = useState<Set<string>>(new Set());

  // ==================== API CALLS ====================

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data: Todo[] = await res.json();
        setTodos(data);
      } else {
        setError("Failed to fetch todos");
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTodo = async (title: string, nonce?: number): Promise<boolean> => {
    try {
      const body: any = { title, completed: false };
      if (nonce !== undefined) body.nonce = nonce;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        await fetchTodos();
        await verifyChain();
        return true;
      } else {
        const err = await res.json();
        setError(err.error || "Failed to add todo");
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error - check if API is running");
      return false;
    }
  };

  // FIX Technical Debt #2: Use map instead of filter for updates
  const updateTodo = async (id: string, updates: Partial<Pick<Todo, "title" | "completed">>, nonce?: number): Promise<boolean> => {
    try {
      const body: any = { ...updates };
      if (nonce !== undefined) body.nonce = nonce;

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        // FIXED: Use map (not filter) for immutable state updates
        setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
        await fetchTodos(); // Re-sync with server for hash updates
        await verifyChain();
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error - check if API is running");
      return false;
    }
  };

  // FIX Technical Debt #1: Use id (not title) for filtering on delete
  const deleteTodo = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        // FIXED: Filter by id, not title
        setTodos(prev => prev.filter(t => t.id !== id));
        await verifyChain();
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error - check if API is running");
      return false;
    }
  };

  const verifyChain = async () => {
    try {
      const res = await fetch(`${API_URL}/verify`);
      const data = await res.json();
      if (res.ok) {
        setChainStatus({ valid: true, message: data.message });
      } else {
        setChainStatus({ valid: false, message: data.message || "Chain Tampered" });
      }
    } catch (err) {
      setChainStatus({ 
        valid: false, 
        message: err instanceof Error ? err.message : "Verification failed — server unreachable" 
      });
    }
  };

  // ==================== FOCUS-FLOW ====================

  const activeTodos = todos.filter(t => !t.completed);
  const activeTodoCount = activeTodos.length;
  const canAddTodo = activeTodoCount < 5;

  // FIFO: Only the oldest active (uncompleted) todo can be completed
  const canComplete = (id: string): boolean => {
    if (activeTodos.length === 0) return false;
    // Sort by creation date, the first one is the oldest
    const sorted = [...activeTodos].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return sorted[0].id === id;
  };

  // Shadow Archive (Ghosting): 15s auto-vanish after completion
  useEffect(() => {
    const completedTodos = todos.filter(t => t.completed && !ghostingTodos.has(t.id));

    completedTodos.forEach(todo => {
      setGhostingTodos(prev => new Set(prev).add(todo.id));

      const timer = setTimeout(() => {
        deleteTodo(todo.id);
        setGhostingTodos(prev => {
          const next = new Set(prev);
          next.delete(todo.id);
          return next;
        });
      }, 15000);

      return () => clearTimeout(timer);
    });
  }, [todos]);

  // Initial fetch + verify
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    if (todos.length > 0) verifyChain();
  }, [todos.length]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        chainStatus,
        isLoading,
        error,
        fetchTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        verifyChain,
        activeTodoCount,
        canAddTodo,
        canComplete,
        ghostingTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
