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
      title: "Slope layer 13",
      url: maptilerUrlBuilder("0196d69e-1b6d-7600-bbe7-3a77b6700c22"),
      meta: {
        minZoom: 13,
        maxZoom: mapMeta.maxZoom,
        maxNativeZoom: 13,
        minNativeZoom: 13,
        opacity: 0.5,
      },
    },
    {
      title: "Slope layer 10",
      url: maptilerUrlBuilder("0196d693-b911-717d-9a3d-da05cab96398"),
      meta: {
        minZoom: 10,
        maxZoom: 12,
        maxNativeZoom: 10,
        minNativeZoom: 10,
        opacity: 0.5,
      },
    },
    {
      title: "Slope layer 8",
      url: maptilerUrlBuilder("0196d693-28d0-7094-9884-1f01c1c29aef"),
      meta: {
        minZoom: mapMeta.minZoom,
        maxZoom: 9,
        maxNativeZoom: 8,
        minNativeZoom: 8,
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
    minText: "100% light",
    midText: "",
    maxText: "0% LIGHT",
  },
  layers: [
    {
      title: "Shade @ 9am",
      url: maptilerUrlBuilder("0196d6cd-9379-713b-a7d4-8536d7d0c9e9"),
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
      url: maptilerUrlBuilder("0196d738-16db-7fe0-9d0d-ab9caa809b01"),
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
      url: maptilerUrlBuilder("0196d40a-3477-7aed-bfc4-9633c4bed24c"),
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
