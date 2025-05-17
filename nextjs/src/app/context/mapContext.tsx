import { Map } from "leaflet";
import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Create the context with default values
const MapContext = createContext<{
  showSlope: boolean;
  toggleShowSlope: () => void;
  activeShade: number;
  toggleActiveShade: (value: number) => void;
  map: { current: Map | null };
  setMap: Dispatch<SetStateAction<{ current: Map | null }>>;
}>({
  showSlope: false,
  toggleShowSlope: () => {},
  activeShade: -1,
  toggleActiveShade: () => {},
  map: { current: null },
  setMap: () => {},
});

const MapProvider = ({ children }: { children: ReactNode }) => {
  const [showSlope, setShowSlope] = useState(false);
  const [activeShade, setActiveShade] = useState(-1);
  const [map, setMap] = useState<{ current: Map | null }>({ current: null });

  const toggleShowSlope = () => {
    setShowSlope(!showSlope);
  };

  const toggleActiveShade = (value: number) => {
    setActiveShade(value === activeShade ? -1 : value);
  };
  return (
    <MapContext
      value={{
        showSlope,
        toggleShowSlope,
        activeShade,
        toggleActiveShade,
        map,
        setMap,
      }}
    >
      {children}
    </MapContext>
  );
};

export { MapContext, MapProvider };
