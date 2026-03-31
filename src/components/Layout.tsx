import { NavLink } from "react-router-dom";
import { useAppTheme, type Theme } from "../context/ThemeContext";
import { useTodos } from "../hooks/useTodos";

const themes: { key: Theme; label: string; className: string }[] = [
  { key: "default", label: "Default", className: "btn-default" },
  { key: "midnight", label: "Midnight", className: "btn-midnight" },
  { key: "emerald", label: "Emerald", className: "btn-emerald" },
  { key: "solarized", label: "Solarized", className: "btn-solarized" },
];

export const Navbar = () => {
  const { theme, setTheme } = useAppTheme();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h3>📝 TodoApp</h3>
      </div>
      <div className="nav-links">
        <NavLink to="/" end>Tasks</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
      <div className="theme-toggle">
        {themes.map(t => (
          <button
            key={t.key}
            className={`theme-btn ${t.className} ${theme === t.key ? "active-theme" : ""}`}
            onClick={() => setTheme(t.key)}
            title={t.label}
          />
        ))}
      </div>
    </nav>
  );
};

export const ChainBanner = () => {
  const { chainStatus } = useTodos();

  if (chainStatus.valid) return null;

  return (
    <div className="chain-banner">
      <span className="banner-icon">🚨</span>
      <strong>REDACTED / TAMPERED</strong>
      <span>{chainStatus.message}</span>
    </div>
  );
};

export const Footer = () => (
  <footer className="app-footer">
    <p>&copy; 2026 Finals_Q2 — Todo Management System with Blockchain Integrity</p>
  </footer>
);
