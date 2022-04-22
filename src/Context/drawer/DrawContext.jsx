import React, { createContext, useState } from 'react';

export const Draw = {
//   marginleft: number,
};

// const DrawContextProviderProps = {
//   children: React.ReactNode,
// };

// const DrawContextType = {
//   draw: Draw | null,
//   setDraw: React.Dispatch,
// };

export const DrawContext = createContext({});

export const DrawContextProvider = ({ children }) => {
  const [draw, setDraw] = useState({
      marginLeft:null
  });
  return (
      <DrawContext.Provider value ={{draw,setDraw}}>
        {children}
        </DrawContext.Provider>
    );
};
