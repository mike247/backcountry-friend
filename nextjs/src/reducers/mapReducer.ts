import { MapViewState } from "deck.gl";
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
    title: "Topo 250",
    url: linzUrlBuilder(TOPO_250),
    active: true,
    meta: {
      ...baseMapMeta,
      minZoom: mapMeta.minZoom,
      maxZoom: 11,
      opacity: 1,
    },
  },
  {
    title: "Topo 50",
    active: true,
    url: linzUrlBuilder(TOPO_50),
    meta: {
      ...baseMapMeta,
      minZoom: 11,
      maxZoom: mapMeta.maxZoom,
      opacity: 1,
    },
  },
  {
    title: "Satellite",
    active: false,
    url: maptilerUrlBuilder("satellite-v2", "jpg"),
    meta: {
      minZoom: 0,
      maxZoom: 22,
      opacity: 1,
    },
  },
];

export type Layer = {
  title: string;
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
  legend: {
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
        maxNativeZoom: 10,
        minNativeZoom: 10,
        opacity: 0.5,
      },
    },
    {
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
        maxNativeZoom: 11,
        minNativeZoom: 11,
        opacity: 0.5,
      },
    },
  ],
};

type MapConfig = {
  meta: {
    center: LatLngTuple;
    zoom: number;
    maxZoom: number;
    minZoom: number;
  };
  threeDimensions: boolean;
  viewState: MapViewState;
  searchResults: {
    center: LatLngTuple | null;
    zoom: number;
  };
  baseMap: Layer[];
  dataLayers: {
    slopeLayers: DataLayer;
    shadeLayers: DataLayer;
  };
};

export const initialMap: MapConfig = {
  meta: mapMeta,
  threeDimensions: false,
  viewState: {
    ...mapMeta,
    latitude: mapMeta.center[0],
    longitude: mapMeta.center[1],
    pitch: 0,
    maxPitch: 80,
  },
  searchResults: {
    center: null,
    zoom: 12,
  },
  baseMap,
  dataLayers: {
    slopeLayers,
    shadeLayers,
  },
};

type Action =
  | {
      type: "updateLayerActive";
      payload: {
        index: number;
        dataLayer: keyof typeof initialMap.dataLayers;
        value: boolean;
      };
    }
  | {
      type: "setSearchCenter";
      payload: {
        center: LatLngTuple;
      };
    }
  | {
      type: "toggleSatelliteImages";
      payload: {
        value: boolean;
      };
    }
  | {
      type: "toggle3dMode";
      payload: {
        value: boolean;
      };
    }
  | {
      type: "updateViewState";
      payload: {
        value: MapViewState;
      };
    };

export const mapReducer = (map: MapConfig, action: Action) => {
  switch (action.type) {
    case "updateLayerActive":
      const { dataLayer, index, value } = action.payload;
      // map.dataLayers[dataLayer].layers[index].active = !currentState;
      return {
        ...map,
        dataLayers: {
          ...map.dataLayers,
          [dataLayer]: {
            ...map.dataLayers[dataLayer],
            layers: map.dataLayers[dataLayer].layers.map((layer, i) => {
              layer.active = false;
              if (i === index) {
                layer.active = value;
              }
              return layer;
            }),
          },
        },
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
    case "toggleSatelliteImages": {
      return {
        ...map,
        baseMap: map.baseMap.map((layer) => {
          layer.active = !action.payload.value;
          if (layer.title === "Satellite") layer.active = action.payload.value;
          return layer;
        }),
      };
    }
    case "toggle3dMode": {
      return {
        ...map,
        threeDimensions: action.payload.value,
        viewState: {
          ...map.viewState,
          pitch: action.payload.value ? 60 : 0,
        },
      };
    }
    case "updateViewState": {
      return {
        ...map,
        viewState: action.payload.value,
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
