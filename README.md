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

## Technical Debt Fixes

| Bug | Defective Code | Fix Applied |
|-----|---------------|-------------|
| #1 Filter logic | `t.title !== id` | `t.id !== id` |
| #2 Update logic | `todos.filter(...)` | `todos.map(...)` |
| #3 Reconciliation | `key={index}` | `key={todo.id}` |

## Theming
Four global themes applied across all surfaces:
- **Default** — Indigo on white
- **Midnight** — Purple on dark slate
- **Emerald** — Green on deep teal
- **Solarized** — Gold on cream
