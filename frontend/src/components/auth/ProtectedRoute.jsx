import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait for AuthContext to finish reading from localStorage
  // before making an auth decision, so logged-in users aren't
  // incorrectly redirected on page refresh.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-indigo-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
