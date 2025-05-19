import { MapConfig } from "@/reducers/mapReducer";
import { LightingEffect, _SunLight as SunLight } from "@deck.gl/core";

export const generateEffects = (map: MapConfig) => {
  const effects = [];
  const sun = new SunLight(map.effectsState.sun);
  if (map.effectsState.sun) effects.push(new LightingEffect({ sun }));

  return effects.length ? effects : undefined;
};
