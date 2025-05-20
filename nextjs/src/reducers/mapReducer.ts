import { LatLngTuple } from "leaflet";
import { ActionDispatch, createContext, useContext } from "react";

const baseMapMeta = {
  crossOrigin: true,
  attribution:
    "<a href=“http://data.linz.govt.nz”>Sourced from LINZ. CC BY 4.0</a>",
};

const mapMeta = {
  center: [-44.6943, 169.1417] as LatLngTuple,
  zoom: 8,
  maxZoom: 16,
  minZoom: 1,
  latitude: -44.6943,
  longitude: 169.1417,
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
  offset: -10000,
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

export type ShaderLayer = Layer & {
  sliders: {
    [key: string]: {
      value: number;
      min: number;
      max: number;
      legend?: string[];
      title: string;
    };
  };
};

type DataLayer = {
  legend?: {
    gradient: {
      min: string;
      mid: string;
      max: string;
    };
    minText: string;
    midText: string;
    maxText: string;
  };
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

const slopeLayers: DataLayer = {
  legend: {
    gradient: {
      min: "#00ff63",
      mid: "#ffce00",
      max: "#ff0900",
    },
    minText: "0 degrees",
    midText: "30 Degrees",
    maxText: ">60 degrees",
  },
  layers: [
    {
      id: "slope",
      title: "Slope layer",
      control: {
        icon: "/icons/avalanche.svg",
        alt: "show slope layer",
        title: "Slope Hazards",
        label: "Slope",
      },
      active: false,
      url: maptilerUrlBuilder(
        process.env.NEXT_PUBLIC_SLOPE_TILE_ID || "",
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

const shadeLayers: DataLayer = {
  legend: {
    gradient: {
      max: "#020039",
      mid: "rgba(255,255,255,0)",
      min: "#f0ff00",
    },
    minText: "100% Light",
    midText: "",
    maxText: "0% Light",
  },
  layers: [
    {
      id: "9am",
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
        maxNativeZoom: 10,
        minNativeZoom: 10,
        opacity: 0.5,
      },
    },
    {
      id: "noon",
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
    control: {
      icon: "/icons/avalanche.svg",
      alt: "toggle gpu slope layer",
      title: "Slope angle",
      label: "Gpu Slope",
    },
    active: false,
    url: maptilerUrlBuilder("terrain-rgb-v2", "webp"),
    meta: {
      minZoom: mapMeta.minZoom,
      maxZoom: 14,
      opacity: 0.5,
    },
    sliders: {
      opacity: {
        value: 0.5,
        legend: ["0", "1"],
        title: "Opacity",
        min: 0,
        max: 1,
      },
      cutoffElevation: {
        title: "Elevation",
        value: 200,
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
      },
      cutoffAngle: {
        title: "Min angle",
        value: 5,
        legend: ["0", "10", "20", "30", "40", "50", "60"],
        min: 0,
        max: 60,
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
  effectsState: {
    threeDimensions: boolean;
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
  viewState: {
    maxPitch: number;
  };
  searchResults: {
    center: LatLngTuple | null;
    zoom: number;
  };
  baseMap: Layer[];
  dataLayers: {
    topoLayers: DataLayer;
    satelliteLayers: DataLayer;
    slopeLayers: DataLayer;
    shadeLayers: DataLayer;
  };
  shaderLayers: ShaderLayer[];
};

export const initialMap: MapConfig = {
  meta: mapMeta,
  viewState: {
    maxPitch: 80,
  },
  activeLayers: [],
  effectsState: {
    threeDimensions: false,
    sun: {
      active: false,
      intensity: 3,
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
    topoLayers,
    satelliteLayers,
    slopeLayers,
    shadeLayers,
  },
  shaderLayers,
};

type Action =
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
        effectsState: {
          ...map.effectsState,
          threeDimensions: action.payload.value,
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
    case "updateSlider": {
      console.log(action.payload);
      return {
        ...map,
        shaderLayers: shaderLayers.map((shader) => {
          if (shader.id === action.payload.shader)
            shader.sliders[action.payload.slider].value = action.payload.value;
          console.log(shader);
          return shader;
        }),
      };
    }
    case "updateShader": {
      return {
        ...map,
        shadeLayers: shaderLayers.map((shader) => {
          if (shader.id === action.payload.id)
            shader.active = action.payload.active;
          return shader;
        }),
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
