import React, { createContext, useCallback, useEffect, useState } from 'react';
import { apiFetch } from './api';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const meRes = await apiFetch('/auth/me');
      if (meRes.ok) {
        const me = await meRes.json();
        setUser(me);
        return me;
      }

      // Try refresh once, then retry /me
      const refreshRes = await apiFetch('/auth/refresh', { method: 'POST' });
      if (refreshRes.ok) {
        const meRes2 = await apiFetch('/auth/me');
        if (meRes2.ok) {
          const me2 = await meRes2.json();
          setUser(me2);
          return me2;
        }
      }

      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
