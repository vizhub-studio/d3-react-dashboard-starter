import { createContext, useState } from 'react';

export const InteractionContext = createContext();

export const InteractionProvider = ({ children }) => {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <InteractionContext.Provider
      value={{ selectedId, setSelectedId }}
    >
      {children}
    </InteractionContext.Provider>
  );
};
