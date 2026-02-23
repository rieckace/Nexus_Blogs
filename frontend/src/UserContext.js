import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('nexus_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('nexus_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('nexus_user');
      }
    } catch {
      // ignore storage errors
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
