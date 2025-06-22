import { MapConfig } from "@/reducers/state";
import { LightingEffect, _SunLight as SunLight } from "@deck.gl/core";

export const generateEffects = (map: MapConfig) => {
  const effects = [];
  const sun = new SunLight(map.effectsState.sun);
  if (map.effectsState.sun.active) effects.push(new LightingEffect({ sun }));

  return effects;
};
