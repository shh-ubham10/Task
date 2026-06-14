const Header = () => {
  return (
    <header className="header">
      <div />
      <div className="header-right">
        <button className="notif-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="notif-dot" />
        </button>

        <div className="header-user">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
            alt="avatar"
            className="user-avatar"
          />
          <div className="user-info">
            <span className="user-name">Alex Wando</span>
            <span className="user-role">Admin</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;