import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore auth state from localStorage on initial mount.
  // isLoading stays true until this completes so consumers
  // (e.g. ProtectedRoute) don't redirect before state is ready.
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("devstack_token");
      const storedUser = localStorage.getItem("devstack_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Corrupted localStorage data — clear it and start fresh
      localStorage.removeItem("devstack_token");
      localStorage.removeItem("devstack_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Call this after a successful login or register API response.
  // Persists to localStorage and updates React state in one step.
  const login = (newToken, newUser) => {
    localStorage.setItem("devstack_token", newToken);
    localStorage.setItem("devstack_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("devstack_token");
    localStorage.removeItem("devstack_user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};