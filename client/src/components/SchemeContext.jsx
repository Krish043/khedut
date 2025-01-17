import React, { createContext, useState } from 'react';

export const SchemeContext = createContext();

export const SchemeProvider = ({ children }) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);

  return (
    <SchemeContext.Provider value={{ selectedSchemeId, setSelectedSchemeId }}>
      {children}
    </SchemeContext.Provider>
  );
};
