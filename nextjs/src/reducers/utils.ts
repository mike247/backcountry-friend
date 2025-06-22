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
