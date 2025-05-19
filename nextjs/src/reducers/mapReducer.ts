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
  minZoom: 6,
  latitude: -44.6943,
  longitude: 169.1417,
  pitch: 0,
  maxPitch: 80,
};

const TOPO_250 = "50798";
const TOPO_50 = "50767";
// const DEM = "51768";

export const linzUrlBuilder = (layerId: string) => {
  return `/api/maps/topo?s={s}&x={x}&y={y}&z={z}&layerId=${layerId}`;
};

export const maptilerUrlBuilder = (layerId: string, format: string) => {
  return `/api/maps/data?x={x}&y={y}&z={z}&layerId=${layerId}&format=${format}`;
};

const baseMap: Layer[] = [
  {
    id: "250",
    title: "Topo250",
    url: linzUrlBuilder(TOPO_250),
    active: true,
    meta: {
      ...baseMapMeta,
      minZoom: mapMeta.minZoom,
      maxZoom: 13,
      opacity: 1,
    },
  },
  {
    id: "50",
    title: "Topo50",
    active: true,
    url: linzUrlBuilder(TOPO_50),
    meta: {
      ...baseMapMeta,
      minZoom: 12,
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
    satelliteLayers: DataLayer;
    slopeLayers: DataLayer;
    shadeLayers: DataLayer;
  };
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
    satelliteLayers,
    slopeLayers,
    shadeLayers,
  },
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
