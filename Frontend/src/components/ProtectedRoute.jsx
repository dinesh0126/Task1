import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    if (token && !user) {
      restoreSession();
    }
  }, [token, user, restoreSession]);

  if (!token) {
    return <Navigate replace to="/login" />;
  }

  if (isAuthLoading && !user) {
    return <div className="status-card">Loading your session...</div>;
  }

  return children;
}

export default ProtectedRoute;
