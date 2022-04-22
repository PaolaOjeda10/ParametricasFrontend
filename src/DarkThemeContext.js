import React, { useState, useEffect } from "react";
const DarkThemeContext = React.createContext();

const mainColors = [
  { bg: "#fff", color: "#000" },
  { bg: "#303030", color: "#fff" },
  // 121212
];

const DartThemeProvider = ({ children }) => {
  const [turnOn, setTurnOn] = useState(false);
  const [mainColor, setMainColor] = useState(mainColors[0]);

  useEffect(() => {
    const color = turnOn ? mainColors[1] : mainColors[0];
    setMainColor(color);
  }, [turnOn]);

  return (
    <DarkThemeContext.Provider
      value={{ turnOn, setTurnOn, mainColor, setMainColor }}
    >
      {children}
    </DarkThemeContext.Provider>
  );
};

export { DarkThemeContext, DartThemeProvider };