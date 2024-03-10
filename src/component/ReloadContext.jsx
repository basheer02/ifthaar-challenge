import React, { createContext, useContext, useEffect, useState } from 'react';

const ReloadContext = createContext();

export const useReload = () => useContext(ReloadContext);

export const ReloadProvider = ({ children }) => {
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsReloading(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <ReloadContext.Provider value={isReloading}>
      {children}
    </ReloadContext.Provider>
  );
};
