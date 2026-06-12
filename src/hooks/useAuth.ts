import { useState, useEffect } from 'react';
import type { User, UserSession } from '../types/index';
import { storage } from '../utils/storage';

interface AuthState {
  username: string | null;
  login: (rawUsername: string) => void;
  logout: () => void;
}

export const useAuth = (): AuthState => {
  const [username, setUsername] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    const session = storage.getSession();
    if (session) {
      setUsername(session.username);
    }
  }, []);

  const login = (rawUsername: string) => {
    // Normalize: trim + lowercase
    const normalized = rawUsername.trim().toLowerCase();

    // Validate non-empty
    if (!normalized) {
      console.warn('Username cannot be empty after normalization');
      return;
    }

    // Look up or create user
    const users = storage.getUsers();
    if (!users[normalized]) {
      const newUser: User = {
        username: normalized,
        createdAt: new Date().toISOString(),
      };
      storage.saveUser(newUser);
    }

    // Save session
    const session: UserSession = { username: normalized };
    storage.saveSession(session);

    // Update state
    setUsername(normalized);
  };

  const logout = () => {
    storage.clearSession();
    setUsername(null);
  };

  return {
    username,
    login,
    logout,
  };
};
