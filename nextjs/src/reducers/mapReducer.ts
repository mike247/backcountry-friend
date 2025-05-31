import { LatLngTuple } from "leaflet";
import { ActionDispatch, createContext, useContext } from "react";
import { MapViewState } from "@deck.gl/core";

const baseMapMeta = {
  crossOrigin: true,
  attribution:
    "<a href=“http://data.linz.govt.nz”>Sourced from LINZ. CC BY 4.0</a>",
};

const mapMeta = {
  center: [-41.2706, 173.284] as LatLngTuple,
  zoom: 5,
  maxZoom: 16,
  minZoom: 1,
  latitude: -41.2706,
  longitude: 173.284,
  pitch: 0,
  maxPitch: 80,
};

const TOPO_250 = "50798";
const TOPO_50 = "50767";
// const DEM = "51768";

export const ELEVATION_DECODER = {
  rScaler: 6553.6,
  gScaler: 25.6,
  bScaler: 0.1,
  offset: -10000.0,
};

export const linzUrlBuilder = (layerId: string) => {
  return `/api/maps/topo?s={s}&x={x}&y={y}&z={z}&layerId=${layerId}`;
};

export const maptilerUrlBuilder = (
  layerId: string,
  format: string,
  type = "tiles"
) => {
  return `/api/maps/data?x={x}&y={y}&z={z}&layerId=${layerId}&format=${format}&type=${type}`;
};

const baseMap: Layer[] = [
  {
    id: "globalTpop",
    title: "Topo",
    url: maptilerUrlBuilder("outdoor-v2", "png", "maps"),
    active: true,
    meta: {
      ...baseMapMeta,
      minZoom: mapMeta.minZoom,
      maxZoom: mapMeta.maxZoom,
      opacity: 1,
    },
  },
];

export type Layer = {
  title: string;
  hideOn3d?: boolean;
  id: string;
  control?: {
    icon: string;
    alt: string;
    title: string;
    label: string;
  };
  active: boolean;
  url: string;
  meta: {
    minZoom: number;
    maxZoom: number;
    maxNativeZoom?: number;
    minNativeZoom?: number;
    opacity?: number;
  };
};

type Legend = {
  gradient: string[];
  minText: string;
  midText: string;
  maxText: string;
};

export type ShaderLayer = Layer & {
  legend?: Legend;
  sliders: {
    [key: string]: {
      value: number;
      min: number;
      max: number;
      legend?: string[];
      title: string;
      hidden: boolean;
    };
  };
};

type DataLayer = {
  legend?: Legend;
  layers: Layer[];
};

const satelliteLayers: DataLayer = {
  layers: [
    {
      id: "sat",
      title: "Satellite",
      active: false,
      url: maptilerUrlBuilder("satellite-v2", "jpg"),
      control: {
        icon: "/icons/satellite.svg",
        alt: "toggle satellite images",
        title: "Satellite images",
        label: "sat",
      },
      meta: {
        minZoom: 0,
        maxZoom: 22,
        opacity: 1,
      },
    },
  ],
};

// const slopeLayers: DataLayer = {
//   legend: {
//     gradient: {
//       min: "#00ff63",
//       mid: "#ffce00",
//       max: "#ff0900",
//     },
//     minText: "0 degrees",
//     midText: "30 Degrees",
//     maxText: ">60 degrees",
//   },
//   layers: [
//     {
//       id: "slope",
//       title: "Slope layer",
//       control: {
//         icon: "/icons/avalanche.svg",
//         alt: "show slope layer",
//         title: "Slope Hazards",
//         label: "Slope",
//       },
//       active: false,
//       url: maptilerUrlBuilder(
//         process.env.NEXT_PUBLIC_SLOPE_TILE_ID || "",
//         "png"
//       ),
//       meta: {
//         minZoom: mapMeta.minZoom,
//         maxZoom: mapMeta.maxZoom,
//         maxNativeZoom: 13,
//         minNativeZoom: 6,
//         opacity: 0.5,
//       },
//     },
//   ],
// };

const shadeLayers: DataLayer = {
  legend: {
    gradient: ["#020039", "rgba(255,255,255,0)", "#f0ff00"],
    minText: "0% Light",
    midText: "",
    maxText: "100% Light",
  },
  layers: [
    {
      id: "9am",
      hideOn3d: true,
      title: "Shade @ 9am",
      control: {
        icon: "/icons/morning.svg",
        alt: "toggle morning sun and shade layer",
        title: "Morning sun",
        label: "AM",
      },
      active: false,
      url: maptilerUrlBuilder(
        process.env.NEXT_PUBLIC_SHADE_9AM_TILE_ID || "",
        "png"
      ),
      meta: {
        minZoom: mapMeta.minZoom,
        maxZoom: mapMeta.maxZoom,
        maxNativeZoom: 13,
        minNativeZoom: 6,
        opacity: 0.5,
      },
    },
    {
      id: "noon",
      hideOn3d: true,
      title: "Shade @ noon",
      control: {
        icon: "/icons/midday.svg",
        alt: "toggle midday sun and shade layer",
        title: "Midday sun",
        label: "Noon",
      },
      active: false,
      url: maptilerUrlBuilder(
        process.env.NEXT_PUBLIC_SHADE_NOON_TILE_ID || "",
        "png"
      ),
      meta: {
        minZoom: mapMeta.minZoom,
        maxZoom: mapMeta.maxZoom,
        maxNativeZoom: 13,
        minNativeZoom: 6,
        opacity: 0.5,
      },
    },
    {
      id: "3pm",
      hideOn3d: true,
      title: "Shade @ 3pm",
      control: {
        icon: "/icons/afternoon.svg",
        alt: "toggle afternoon sun and shade layer",
        title: "Afternoon sun",
        label: "PM",
      },
      active: false,
      url: maptilerUrlBuilder(
        process.env.NEXT_PUBLIC_SHADE_3PM_TILE_ID || "",
        "png"
      ),
      meta: {
        minZoom: mapMeta.minZoom,
        maxZoom: mapMeta.maxZoom,
        maxNativeZoom: 13,
        minNativeZoom: 6,
        opacity: 0.5,
      },
    },
  ],
};

const topoLayers: DataLayer = {
  layers: [
    {
      id: "250",
      title: "Topo250",
      url: linzUrlBuilder(TOPO_250),
      active: false,
      meta: {
        ...baseMapMeta,
        minZoom: mapMeta.minZoom,
        maxZoom: mapMeta.maxZoom,
        opacity: 1,
      },
      control: {
        icon: "/icons/topo.svg",
        alt: "turn on the topo 250 map",
        title: "Topo 250",
        label: "1:250",
      },
    },
    {
      id: "50",
      title: "Topo50",
      active: false,
      url: linzUrlBuilder(TOPO_50),
      meta: {
        ...baseMapMeta,
        minZoom: mapMeta.minZoom,
        maxZoom: mapMeta.maxZoom,
        opacity: 1,
      },
      control: {
        icon: "/icons/topo.svg",
        alt: "turn on the topo 50 map",
        title: "Topo 50",
        label: "1:50",
      },
    },
  ],
};

const shaderLayers: ShaderLayer[] = [
  {
    id: "gpuSlope",
    title: "Slope angle",
    legend: {
      gradient: ["#00ff63", "#ffce00", "#ff0900", "#000000"],
      minText: "0 degrees",
      midText: "45 Degrees",
      maxText: "90 degrees",
    },
    control: {
      icon: "/icons/angle.svg",
      alt: "toggle gpu slope layer",
      title: "Slope angle",
      label: "Slope",
    },
    active: false,
    url: maptilerUrlBuilder("terrain-rgb-v2", "webp"),
    // url: maptilerUrlBuilder("01971bf1-fd00-70c5-a202-70f8ee2dc5aa", "png"),
    meta: {
      minZoom: 1,
      maxZoom: 12,
      minNativeZoom: 1,
      maxNativeZoom: 14,
      opacity: 0.5,
    },
    sliders: {
      opacity: {
        value: 0.4,
        legend: ["0", "1"],
        title: "Opacity",
        min: 0,
        max: 1,
        hidden: true,
      },
      cutoffElevation: {
        title: "Elevation",
        value: 1,
        min: 0,
        max: 10000,
        legend: [
          "0",
          "1000",
          "2000",
          "3000",
          "4000",
          "5000",
          "6000",
          "7000",
          "8000",
          "9000",
          "10000",
        ],
        hidden: true,
      },
      cutoffAngle: {
        title: "Min angle",
        value: 20,
        legend: ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90"],
        min: 0,
        max: 90,
        hidden: false,
      },
    },
  },
];

export type MapConfig = {
  meta: {
    center: LatLngTuple;
    zoom: number;
    maxZoom: number;
    minZoom: number;
    latitude: number;
    longitude: number;
    pitch: number;
    maxPitch: number;
  };
  threeDimensions: boolean;
  effectsState: {
    sun: {
      active: boolean;
      id?: string;
      _shadow?: boolean;
      intensity?: number;
      color?: [number, number, number];
      timestamp: number;
    };
  };
  activeLayers: Layer[];
  activeShaders: string[];
  viewState: MapViewState;
  searchResults: {
    center: LatLngTuple | null;
    zoom: number;
  };
  baseMap: Layer[];
  dataLayers: {
    topoLayers: DataLayer;
    satelliteLayers: DataLayer;
    // slopeLayers: DataLayer;
    shadeLayers: DataLayer;
  };
  shaderLayers: ShaderLayer[];
};

export const initialMap: MapConfig = {
  meta: mapMeta,
  viewState: mapMeta,
  activeLayers: [],
  activeShaders: [],
  threeDimensions: false,
  effectsState: {
    sun: {
      active: false,
      intensity: 2,
      color: [255, 255, 255],
      timestamp: Date.now(),
    },
  },
  searchResults: {
    center: null,
    zoom: 12,
  },
  baseMap,
  dataLayers: {
    satelliteLayers,
    topoLayers,
    shadeLayers,
    // slopeLayers,
  },
  shaderLayers,
};

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
  | { type: "updateViewState"; payload: { viewState: MapViewState } }
  | { type: "toggleSun"; payload: { active: boolean } }
  | {
      type: "updateSlider";
      payload: {
        shader: string;
        slider: string;
        value: number;
      };
    };

export const mapReducer = (map: MapConfig, action: Action) => {
  switch (action.type) {
    case "updateLayerActive":
      const { dataLayer, id, active } = action.payload;
      const dataLayers = {
        ...map.dataLayers,
        [dataLayer]: {
          ...map.dataLayers[dataLayer],
          layers: map.dataLayers[dataLayer].layers.map((layer) => {
            layer.active = false;
            if (id === layer.id) {
              layer.active = active;
            }
            return layer;
          }),
        },
      };

      // Eco - remove layers not actively looked at
      const activeLayers = Object.entries(map.dataLayers).reduce<Layer[]>(
        (al, [, dataLayer]) => {
          return al.concat(dataLayer.layers.filter((layer) => layer.active));
        },
        []
      );

      // Hybrid - keep layers not actively looked at but selected running
      // const activeLayers = map.activeLayers.concat(
      //   map.dataLayers[dataLayer].layers.filter((layer) => layer.id === id)
      // );

      return {
        ...map,
        activeLayers,
        dataLayers,
      };
    case "setSearchCenter": {
      const { center } = action.payload;
      return {
        ...map,
        searchResults: {
          center,
          zoom: map.searchResults.zoom, // Not settable at the moment
        },
      };
    }
    case "toggle3dMode": {
      return {
        ...map,
        threeDimensions: action.payload.value,
        effectsState: {
          ...map.effectsState,
          sun: {
            ...map.effectsState.sun,
            active: action.payload.value ? map.effectsState.sun.active : false,
          },
        },
      };
    }
    case "updateTimestamp": {
      return {
        ...map,
        effectsState: {
          ...map.effectsState,
          sun: {
            ...map.effectsState.sun,
            timestamp: action.payload.value,
          },
        },
      };
    }
    case "updateViewState": {
      return {
        ...map,
        viewState: action.payload.viewState,
      };
    }
    case "updateSlider": {
      return {
        ...map,
        shaderLayers: shaderLayers.map((shader) => {
          if (shader.id === action.payload.shader)
            shader.sliders[action.payload.slider].value = action.payload.value;
          return shader;
        }),
      };
    }
    case "updateShader": {
      const { id: updatedId, active } = action.payload;

      // Hybrid - keep layers not actively looked at but selected running
      // const activeLayers = map.activeLayers.concat(
      //   map.dataLayers[dataLayer].layers.filter((layer) => layer.id === id)
      // );

      const activeShaders = active
        ? map.activeShaders.concat([updatedId])
        : map.activeShaders.filter((id) => id !== updatedId);
      return {
        ...map,
        activeShaders,
        shadeLayers: shaderLayers.map((shader) => {
          if (shader.id === updatedId) shader.active = active;
          return shader;
        }),
      };
    }
    case "toggleSun": {
      return {
        ...map,
        effectsState: {
          ...map.effectsState,
          sun: {
            ...map.effectsState.sun,
            active: action.payload.active,
          },
        },
      };
    }
    default:
      throw new Error("unknown action type in the map reducer");
  }
};

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
