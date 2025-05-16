import { createContext, useState, ReactNode } from "react";

// Create the context with default values
const MapContext = createContext<{
  showSlope: boolean;
  toggleShowSlope: () => void;
  activeShade: number;
  toggleActiveShade: (value: number) => void;
}>({
  showSlope: false,
  toggleShowSlope: () => {},
  activeShade: -1,
  toggleActiveShade: () => {},
});

const MapProvider = ({ children }: { children: ReactNode }) => {
  const [showSlope, setShowSlope] = useState(false);
  const [activeShade, setActiveShade] = useState(-1);

  const toggleShowSlope = () => {
    setShowSlope(!showSlope);
  };

  const toggleActiveShade = (value: number) => {
    setActiveShade(value === activeShade ? -1 : value);
  };
  return (
    <MapContext
      value={{ showSlope, toggleShowSlope, activeShade, toggleActiveShade }}
    >
      {children}
    </MapContext>
  );
};

export { MapContext, MapProvider };
