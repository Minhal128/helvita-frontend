import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider } from './ThemeContext';

const NavContext = createContext(null);

export const useSidebar = () => useContext(NavContext);

export const SidebarContext = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(prevState => !prevState);

  return (
    <NavContext.Provider value={{ isNavOpen, toggleNav }}>
      <ThemeProvider>
        {children}
      </ThemeProvider>

    </NavContext.Provider>
  );
};
