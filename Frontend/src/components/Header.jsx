import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div>
        <Link className="brand" to={user ? "/feed" : "/"}>
          TaskPlanet Social
        </Link>
        
      </div>

      <nav className="topbar-actions">
        {user ? (
          <>
            <div className="user-chip">
              {user.profileImage ? (
                <img
                  alt={user.name}
                  className="avatar avatar-small"
                  src={user.profileImage}
                />
              ) : (
                <div className="avatar avatar-small avatar-fallback">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="welcome-text">Hi, {user.name}</span>
            </div>
            {location.pathname !== "/feed" && (
              <Link className="ghost-button" to="/feed">
                Feed
              </Link>
            )}
            <button className="ghost-button" onClick={handleLogout} type="button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="ghost-button" to="/login">
              Login
            </Link>
            <Link className="primary-button" to="/signup">
              Signup
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
