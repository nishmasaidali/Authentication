import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const {
    user,
    isLoading
  } = useAuth();

  if (isLoading) {
    return (
      <div className="skeleton-container">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-avatar"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;