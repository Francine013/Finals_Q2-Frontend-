# Finals_Q2 — Todo Management System (Frontend)

## Overview
A production-grade Todo Management System built with **React + TypeScript + Vite**, featuring blockchain-style integrity verification and a focus-optimized productivity system.

## Setup & Run
```bash
npm install
npm run dev
```
Frontend starts at `http://localhost:5173`. Requires the backend (`Finals_Q1`) running at `http://localhost:5000`.

## Architecture

### Core Stack
- **Vite** — Fast HMR and ES module builds
- **React Router** — Client-side routing (`/` and `/about`)
- **Context API** — `TodoContext` for CRUD state, `ThemeContext` for global theming
- **react-hook-form** — Performant uncontrolled form handling

### Component Hierarchy
```
App (Router & Global Providers)
 └── Layout (Navbar, ChainBanner, Footer)
      ├── TodoPage (Route: "/")
      │    ├── AddTodoForm (react-hook-form + Proof of Work)
      │    └── TodoList
      │         └── TodoItem
      │              └── EditTodoModal
      └── AboutPage (Route: "/about")
```

### Bonus A: Focus-Flow Constraint
- **Capacity:** Max 5 active tasks — "Add" disables with visual warning
- **FIFO:** Tasks must be completed in order of creation
- **Ghosting:** Completed tasks auto-vanish after 15 seconds

### Bonus B: Blockchain Immutability
- Every todo displays its truncated SHA-256 hash
- Chain verification button calls `GET /api/todos/verify`
- **REDACTED/TAMPERED** banner if chain integrity fails
- **Proof of Work** mining required before creating a task

## Technical Debt Resolution (Evidence)

The following intentional defects from the Technical Audit have been integrated and remediated within the Finals_Q2 implementation:

### 1. Defective Filter Logic (ID vs Title Mismatch)
*   **Defect:** `setTodos(prev => prev.filter(t => t.title !== id));` — Incorrectly attempted to filter by title using a unique identifier.
*   **Refactor:** `setTodos(prev => prev.filter(t => t.id !== id));` — Correctly identifies the unique todo object for removal.

### 2. Defective Update Logic (Filter vs Map)
*   **Defect:** `const updated = todos.filter(t => t.id === id ? { ...t, ...updates } : t);` — Misused `filter` which would return a list of only the updated item (or an incorrect object if mismatch).
*   **Refactor:** `setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));` — Uses `map` to perform a safe, immutable update across the collection.

### 3. Defective Reconciliation (Index vs Key)
*   **Defect:** `{todos.map((t, index) => <li key={index}>{t.title}</li>)}` — Using array index as a key leads to rendering bugs when the collection is reordered or filtered.
*   **Refactor:** `<TodoItem key={todo.id} todo={todo} />` — Uses the persistent GUID from the backend to ensure stable reconciliation.

## Theming System
The shared `ThemeContext` from Phase 1 is fully integrated. Selecting a theme applies a global CSS class to the `document.body`, enabling seamless transitions for:
*   **Midnight** (Default): Purple accents on dark slate.
*   **Emerald**: Green accents on deep teal.
*   **Solarized**: Gold accents on cream.
*   **Default**: Indigo accents on clean white.

## Advanced Challenges Implemented
*   **Focus-Flow Constraint:** Capacity limits (5), FIFO completion enforcement, and 15s Shadow Archive (Ghosting).
*   **Blockchain Immutability:** SHA-256 ledger, Genesis block linkage, and real-time Chain Verification.
*   **Mining Activity:** SHA-256 Proof of Work (prefix `00`) required for every task creation.
