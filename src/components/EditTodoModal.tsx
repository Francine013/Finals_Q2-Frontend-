import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = { title: string };

interface EditTodoModalProps {
  isOpen: boolean;
  currentTitle: string;
  onClose: () => void;
  onSave: (newTitle: string) => void;
}

export const EditTodoModal = ({ isOpen, currentTitle, onClose, onSave }: EditTodoModalProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { title: currentTitle },
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Edit Task</h2>
        <form onSubmit={handleSubmit(data => onSave(data.title))}>
          <input
            {...register("title", { required: "Title cannot be empty" })}
            className="todo-input"
            autoFocus
          />
          {errors.title && <span className="form-error">{errors.title.message}</span>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};
