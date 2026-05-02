import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Restore the saved user so refreshes keep the session alive.
    try {
      const saved = localStorage.getItem('yt_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Keep the saved token available for authenticated API calls.
  const [token, setToken] = useState(() => localStorage.getItem('yt_token') || null);

  function login(newToken, newUser) {
    // Keep auth in state and localStorage together.
    localStorage.setItem('yt_token', newToken);
    localStorage.setItem('yt_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem('yt_token');
    localStorage.removeItem('yt_user');
    setToken(null);
    setUser(null);
  }

  function updateUser(updates) {
    setUser(prev => {
      // Save profile updates right away so the UI stays in sync after reloads.
      const next = { ...prev, ...updates };
      localStorage.setItem('yt_user', JSON.stringify(next));
      return next;
    });
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  // This guard makes sure auth hooks are only used inside the provider.
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
