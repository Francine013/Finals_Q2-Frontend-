export const AboutPage = () => (
  <main className="container">
    <div className="page-header">
      <h1>About This Project</h1>
      <p>Finals_Q2 — A production-grade Todo Management System</p>
    </div>

    <div className="about-grid">
      <div className="about-card">
        <h3>🏗️ Architecture</h3>
        <ul>
          <li>React + TypeScript + Vite</li>
          <li>React Router for client-side navigation</li>
          <li>Context API for global state management</li>
          <li>react-hook-form for performant form handling</li>
        </ul>
      </div>

      <div className="about-card">
        <h3>🔗 Blockchain Integrity</h3>
        <ul>
          <li>SHA-256 hashing for every Todo item</li>
          <li>Chain linked via PreviousHash references</li>
          <li>Real-time chain verification endpoint</li>
          <li>Proof of Work mining before task creation</li>
        </ul>
      </div>

      <div className="about-card">
        <h3>🎯 Focus-Flow System</h3>
        <ul>
          <li><strong>Capacity:</strong> Max 5 active tasks at any time</li>
          <li><strong>FIFO:</strong> Tasks must be completed in creation order</li>
          <li><strong>Ghosting:</strong> Completed tasks vanish after 15 seconds</li>
        </ul>
      </div>

      <div className="about-card">
        <h3>🛠️ Technical Debt Fixes</h3>
        <ul>
          <li><strong>Bug #1:</strong> Fixed filter logic — uses <code>t.id !== id</code> instead of <code>t.title !== id</code></li>
          <li><strong>Bug #2:</strong> Fixed update logic — uses <code>map()</code> instead of <code>filter()</code></li>
          <li><strong>Bug #3:</strong> Fixed reconciliation — uses <code>todo.id</code> as key, not array index</li>
        </ul>
      </div>
    </div>
  </main>
);
