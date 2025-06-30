import { MapViewState } from "deck.gl";
import { initialMap, Layer } from "./state";
import { LatLngTuple } from "leaflet";

export type Action =
  | {
      type: "updateLayerActive";
      payload: {
        id: string;
        dataLayer: keyof typeof initialMap.dataLayers;
        active: boolean;
      };
    }
  | {
      type: "setSearchCenter";
      payload: {
        center: LatLngTuple;
      };
    }
  | {
      type: "toggle3dMode";
      payload: {
        value: boolean;
      };
    }
  | {
      type: "updateTimestamp";
      payload: {
        value: number;
      };
    }
  | { type: "updateShader"; payload: { id: string; active: boolean } }
  | {
      type: "updateUserPosition";
      payload: { latitude: number; longitude: number };
    }
  | { type: "updateViewState"; payload: { viewState: MapViewState } }
  | { type: "toggleSun"; payload: { active: boolean } }
  | { type: "updateActiveBaseLayer"; payload: { layer: Layer } }
  | { type: "toggleAvalancheLayer"; payload: { active: boolean } }
  | {
      type: "updateSlider";
      payload: {
        shader: string;
        slider: string;
        value: number;
      };
    };
