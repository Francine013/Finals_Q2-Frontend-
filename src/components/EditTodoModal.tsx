import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface EditTodoModalProps {
  isOpen: boolean;
  currentTitle: string;
  onClose: () => void;
  onSave: (newTitle: string) => void;
}

export const EditTodoModal = ({ isOpen, currentTitle, onClose, onSave }: EditTodoModalProps) => {
  const navigate = useNavigate();
  // REQUIREMENT: Controlled component using useState
  const [title, setTitle] = useState(currentTitle);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setTitle(currentTitle);
  }, [isOpen, currentTitle]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    onSave(title);
    navigate("/"); // Programmatic Navigation Requirement
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            className="todo-input"
            placeholder="Update task title..."
            autoFocus
          />
          {error && <span className="form-error">{error}</span>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};
