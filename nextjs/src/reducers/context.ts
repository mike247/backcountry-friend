import { ActionDispatch, createContext, useContext } from "react";
import { MapConfig } from "./state";
import { Action } from "./actions";

export const MapContext = createContext<{
  map: MapConfig;
  dispatch: ActionDispatch<[action: Action]>;
} | null>(null);

export const useMapContext = () => {
  const state = useContext(MapContext);
  if (state === null) {
    throw new Error("MapContext has not been configured, value is null");
  } else if (state === undefined) {
    throw new Error(
      "You're attempting to access MapContext outside of the context provider"
    );
  }
  return state;
};
