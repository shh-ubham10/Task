import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <svg width="130" height="32" viewBox="0 0 130 32" fill="none">
          <text x="0" y="24" fontFamily="Arial" fontSize="22" fontWeight="800" fill="#3d5af1">Prep</text>
          <text x="52" y="24" fontFamily="Arial" fontSize="22" fontWeight="800" fill="#1a1a2e">route</text>
          <circle cx="48" cy="10" r="4" fill="#3d5af1" opacity="0.3"/>
        </svg>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/tests/create" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span>Test Creation</span>
        </NavLink>

        <NavLink to="/tests" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          <span>Test Tracking</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;