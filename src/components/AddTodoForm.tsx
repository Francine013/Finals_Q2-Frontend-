import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTodos } from "../hooks/useTodos";

type FormValues = { title: string };

// Simple Proof of Work: find nonce where SHA-256(title+nonce) starts with "00"
async function mineNonce(title: string): Promise<number> {
  let nonce = 0;
  while (true) {
    const data = title + nonce;
    const msgBuffer = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    if (hashHex.startsWith("00")) return nonce;
    nonce++;
    if (nonce > 100000) return nonce; // Safety cap
  }
}

export const AddTodoForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  const { addTodo, canAddTodo, activeTodoCount } = useTodos();
  const [isMining, setIsMining] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!canAddTodo) return;
    setIsMining(true);
    try {
      const nonce = await mineNonce(data.title);
      const success = await addTodo(data.title, nonce);
      if (success) reset();
    } finally {
      setIsMining(false);
    }
  };

  return (
    <div className="add-todo-form">
      <form onSubmit={handleSubmit(onSubmit)} className="form-row">
        <div className="input-wrapper">
          <input
            {...register("title", { required: "Task title is required" })}
            placeholder={canAddTodo ? "What needs to be done?" : "Max 5 active tasks reached!"}
            disabled={!canAddTodo || isMining}
            className="todo-input"
          />
          {errors.title && <span className="form-error">{errors.title.message}</span>}
        </div>
        <button
          type="submit"
          disabled={!canAddTodo || isMining}
          className="btn btn-primary"
        >
          {isMining ? "⛏️ Mining..." : "Add Task"}
        </button>
      </form>
      <div className="capacity-bar">
        <div className="capacity-fill" style={{ width: `${(activeTodoCount / 5) * 100}%` }} />
      </div>
      <p className="capacity-text">
        {activeTodoCount}/5 Active Tasks
        {!canAddTodo && <span className="warning-text"> — Capacity reached!</span>}
      </p>
    </div>
  );
};
