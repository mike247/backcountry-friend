import { LatLngTuple } from "leaflet";

const baseMapMeta = {
  crossOrigin: true,
  attribution:
    "<a href=“http://data.linz.govt.nz”>Sourced from LINZ. CC BY 4.0</a>",
};

const TOPO_250 = "50798";
const TOPO_50 = "50767";

const linzUrlBuilder = (layerId: string) => {
  return `/api/maps/topo?s={s}&x={x}&y={y}&z={z}&layerId=${layerId}`;
};

const maptilerUrlBuilder = (layerId: string) => {
  return `/api/maps/data?x={x}&y={y}&z={z}&layerId=${layerId}`;
};

export const mapMeta = {
  center: [-44.6943, 169.1417] as LatLngTuple,
  zoom: 8,
  maxZoom: 16,
  minZoom: 6,
};

export const coreMaps = [
  {
    title: "Topo 250",
    url: linzUrlBuilder(TOPO_250),
    meta: {
      ...baseMapMeta,
      minZoom: mapMeta.minZoom,
      maxZoom: 11,
    },
  },
  {
    title: "Topo 50",
    url: linzUrlBuilder(TOPO_50),
    meta: {
      ...baseMapMeta,
      minZoom: 12,
      maxZoom: mapMeta.maxZoom,
    },
  },
];

export const slopeLayers = {
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
      url: maptilerUrlBuilder(process.env.NEXT_PUBLIC_SLOPE_TILE_ID || ""),
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

export const shadeLayers = {
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
      url: maptilerUrlBuilder(process.env.NEXT_PUBLIC_SHADE_9AM_TILE_ID || ""),
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
      url: maptilerUrlBuilder(process.env.NEXT_PUBLIC_SHADE_NOON_TILE_ID || ""),
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
      url: maptilerUrlBuilder(process.env.NEXT_PUBLIC_SHADE_3PM_TILE_ID || ""),
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
