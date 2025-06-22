import { maptilerUrlBuilder } from "@/reducers/utils";
import { PathLayer, TileLayer } from "deck.gl";

const TileDebugLayer = new TileLayer({
  id: "tile-boundary-debug",
  tileSize: 512,
  minZoom: 0,
  maxZoom: 15,
  data: maptilerUrlBuilder("01971055-af3c-776d-a91e-b7b117d2b300", "png"), // or any source

  renderSubLayers: ({ tile }) => {
    const { boundingBox: bbox } = tile;

    const west = bbox[0][0];
    const east = bbox[1][0];
    const north = bbox[1][0];
    const south = bbox[1][1];

    const border = [
      [west, south],
      [west, north],
      [east, north],
      [east, south],
      [west, south], // close the loop
    ];

    return new PathLayer({
      id: `tile-border-${west}-${south}-${north}`,
      data: [{ path: border }],
      getPath: (d) => d.path,
      getWidth: 2,
      getColor: [255, 0, 0],
      widthMinPixels: 1,
      pickable: false,
    });
  },
});

export default TileDebugLayer;
