import { LatLngTuple } from "leaflet";
import { MapViewState } from "@deck.gl/core";
import { linzUrlBuilder, maptilerUrlBuilder } from "./utils";
import { mtCookMask, mtCookBounds, mtCookMaskBounds } from "@/regions/mtCook";
import {
  arthursPassBounds,
  arthursPassMask,
  arthursPassMaskBounds,
} from "@/regions/arthursPass";
import {
  craigieburnBounds,
  craigieburnMask,
  craigieburnMaskBounds,
} from "@/regions/craigieburn";
import { mtHuttBounds, mtHuttMask, mtHuttMaskBounds } from "@/regions/mtHutt";
import {
  twoThumbsBounds,
  twoThumbsMask,
  twoThumbsMaskBounds,
} from "@/regions/twoThumbs";
import { ohauBounds, ohauMask, ohauMaskBounds } from "@/regions/ohau";
import {
  aspiringBounds,
  aspiringMask,
  aspiringMaskBounds,
} from "@/regions/aspiring";
import {
  queenstownBounds,
  queenstownMask,
  queenstownMaskBounds,
} from "@/regions/queenstown";
import { wanakaBounds, wanakaMask, wanakaMaskBounds } from "@/regions/wanaka";
import {
  fiordlandBounds,
  fiordlandMask,
  fiordlandMaskBounds,
} from "@/regions/fiordland";
import {
  tarankiBounds,
  tarankiMask,
  tarankiMaskBounds,
} from "@/regions/taranki";
import {
  tongariroBounds,
  tongariroMask,
  tongariroMaskBounds,
} from "@/regions/tongariro";
import { nelsonBounds, nelsonMask, nelsonMaskBounds } from "@/regions/nelson";
import { Forecast } from "./forecastTypes";

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

export const baseMap: Layer = {
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
};

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
      legendOnly?: boolean;
      blocks?: boolean;
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

export const shadeLayers: DataLayer = {
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

export const topoLayers: DataLayer = {
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

export type AvalancheRegion = {
  id: string;
  regionId: number;
  mask: string;
  bounds: [longitude: number, latitude: number][];
  maskBounds: [number, number, number, number];
};

export const avalancheRegions: AvalancheRegion[] = [
  {
    id: "mtCook",
    regionId: 7,
    mask: mtCookMask,
    bounds: mtCookBounds,
    maskBounds: mtCookMaskBounds,
  },
  {
    id: "arthursPass",
    regionId: 4,
    mask: arthursPassMask,
    bounds: arthursPassBounds,
    maskBounds: arthursPassMaskBounds,
  },
  {
    id: "craigieburn",
    regionId: 5,
    mask: craigieburnMask,
    bounds: craigieburnBounds,
    maskBounds: craigieburnMaskBounds,
  },
  {
    id: "mtHutt",
    regionId: 6,
    mask: mtHuttMask,
    bounds: mtHuttBounds,
    maskBounds: mtHuttMaskBounds,
  },
  {
    id: "twoThumbs",
    regionId: 9,
    mask: twoThumbsMask,
    bounds: twoThumbsBounds,
    maskBounds: twoThumbsMaskBounds,
  },
  {
    id: "ohau",
    regionId: 8,
    mask: ohauMask,
    bounds: ohauBounds,
    maskBounds: ohauMaskBounds,
  },
  {
    id: "aspiring",
    regionId: 15,
    mask: aspiringMask,
    bounds: aspiringBounds,
    maskBounds: aspiringMaskBounds,
  },
  {
    id: "queenstown",
    regionId: 10,
    mask: queenstownMask,
    bounds: queenstownBounds,
    maskBounds: queenstownMaskBounds,
  },
  {
    id: "wanaka",
    regionId: 11,
    mask: wanakaMask,
    bounds: wanakaBounds,
    maskBounds: wanakaMaskBounds,
  },
  {
    id: "fiordland",
    regionId: 12,
    mask: fiordlandMask,
    bounds: fiordlandBounds,
    maskBounds: fiordlandMaskBounds,
  },
  {
    id: "taranki",
    regionId: 2,
    mask: tarankiMask,
    bounds: tarankiBounds,
    maskBounds: tarankiMaskBounds,
  },
  {
    id: "tongariro",
    regionId: 1,
    mask: tongariroMask,
    bounds: tongariroBounds,
    maskBounds: tongariroMaskBounds,
  },
  {
    id: "nelson",
    regionId: 13,
    mask: nelsonMask,
    bounds: nelsonBounds,
    maskBounds: nelsonMaskBounds,
  },
];

export type AvalancheLayer = ShaderLayer & {
  regions: AvalancheRegion[];
};

export const avalancheLayer: AvalancheLayer = {
  id: "gpuAvalancheForecast",
  regions: avalancheRegions,
  title: "Regional Forecast",
  legend: {
    gradient: ["#54BB51", "#FFF420", "#F8972C", "#F02A2F", "#000000"],
    minText: "0 degrees",
    midText: "45 Degrees",
    maxText: "90 degrees",
  },
  control: {
    icon: "/icons/avalanche.svg",
    alt: "toggle avalanche forecast",
    title: "Avalanche forecast",
    label: "Forecast",
  },
  active: true,
  url: maptilerUrlBuilder("terrain-rgb-v2", "webp"),
  // url: maptilerUrlBuilder("01971bf1-fd00-70c5-a202-70f8ee2dc5aa", "png"),
  meta: {
    minZoom: mapMeta.minZoom,
    maxZoom: 14,
    opacity: 0.5,
  },
  sliders: {
    level: {
      title: "Hazard level",
      value: 0,
      legend: ["Low", "Moderate", "Considerable", "High", "Extreme"],
      min: 0,
      max: 90,
      hidden: false,
      legendOnly: true,
      blocks: true,
    },
    opacity: {
      value: 0.6,
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
      hidden: true,
    },
  },
};

export const shaderLayers: ShaderLayer[] = [
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
      minZoom: mapMeta.minZoom,
      maxZoom: 14,
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
        legend: [
          "0°",
          "10°",
          "20°",
          "30°",
          "40°",
          "50°",
          "60°",
          "70°",
          "80°",
          "90°",
        ],
        min: 0,
        max: 90,
        hidden: false,
      },
    },
  },
  {
    id: "gpuAvalanche",
    title: "Avalance terrain",
    legend: {
      gradient: ["#ffce00", "#ff0900", "#ffce00"],
      minText: "0 degrees",
      midText: "45 Degrees",
      maxText: "90 degrees",
    },
    control: {
      icon: "/icons/danger.svg",
      alt: "toggle gpu avalanche layer",
      title: "Avalanche terrain",
      label: "Terrain",
    },
    active: false,
    url: maptilerUrlBuilder("terrain-rgb-v2", "webp"),
    // url: maptilerUrlBuilder("01971bf1-fd00-70c5-a202-70f8ee2dc5aa", "png"),
    meta: {
      minZoom: mapMeta.minZoom,
      maxZoom: 14,
      opacity: 0.5,
    },
    sliders: {
      opacity: {
        value: 0.7,
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
        title: "Angle",
        value: 0,
        legend: ["30°", "34°", "39°", "47°", "55°"],
        min: 0,
        max: 90,
        hidden: false,
        legendOnly: true,
      },
    },
  },
];

export type UserData = {
  position: {
    latitude: number;
    longitude: number;
  };
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
  activeBase: Layer;
  activeLayers: Layer[];
  activeShaders: string[];
  viewState: MapViewState;
  searchResults: {
    center: LatLngTuple | null;
    zoom: number;
  };
  user: UserData;
  baseMap: Layer;
  baseLayers: Layer[];
  dataLayers: {
    // slopeLayers: DataLayer;
    shadeLayers: DataLayer;
  };
  shaderLayers: ShaderLayer[];
  avalancheLayer: AvalancheLayer;
  forecast: Forecast[];
};

export const initialMap: MapConfig = {
  meta: mapMeta,
  viewState: mapMeta,
  activeLayers: [],
  activeBase: topoLayers.layers[0],
  activeShaders: [],
  threeDimensions: false,
  user: {
    position: {
      latitude: -90,
      longitude: 0,
    },
  },
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
  baseLayers: [...satelliteLayers.layers, ...topoLayers.layers],
  dataLayers: {
    shadeLayers,
    // slopeLayers,
  },
  shaderLayers,
  avalancheLayer,
  forecast: [],
};
