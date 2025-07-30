function latLngToTile(lat: number, lng: number, zoom: number) {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
  return { x, y };
}

function latLngToPixelInTile(lat: number, lng: number, zoom: number) {
  const scale = Math.pow(2, zoom);
  const worldX = ((lng + 180) / 360) * scale * 256;
  const worldY =
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
    scale *
    256;

  return {
    pixelX: worldX % 256,
    pixelY: worldY % 256,
  };
}

function decodeElevation(r: number, g: number, b: number) {
  return -10000 + (r * 256 * 256 + g * 256 + b) * 0.1;
}

async function fetchTileImage(x: number, y: number, z: number) {
  const url = `/api/maps/data?x=${x}&y=${y}&z=${z}&layerId=terrain-rgb-v2&format=webp&type=tiles`;
  const response = await fetch(url);
  const blob = await response.blob();
  const img = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(img, 0, 0);
  return ctx?.getImageData(0, 0, 256, 256); // 256x256 elevation tile
}

function getNeighborhood(
  imageData: ImageData,
  centerX: number,
  centerY: number
) {
  const values = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const x = Math.floor(centerX + dx);
      const y = Math.floor(centerY + dy);
      if (x >= 0 && x < 256 && y >= 0 && y < 256) {
        const idx = (y * 256 + x) * 4;
        const [r, g, b] = [
          imageData.data[idx],
          imageData.data[idx + 1],
          imageData.data[idx + 2],
        ];
        const elevation = decodeElevation(r, g, b);
        values.push(elevation);
      } else {
        values.push(null); // or extrapolate later
      }
    }
  }
  return values;
}

function computeSlopeAndAspect(
  elevations: (number | null)[],
  cellSize: number
): {
  slope: number | null;
  aspect: number | null;
} {
  if (elevations.length !== 9 || elevations.some((v) => v === null)) {
    return { slope: null, aspect: null };
  }

  const [z0, z1, z2, z3, z4, z5, z6, z7, z8] = elevations as number[];

  const dzdx = (z2 + 2 * z5 + z8 - (z0 + 2 * z3 + z6)) / (8 * cellSize);
  const dzdy = (z6 + 2 * z7 + z8 - (z0 + 2 * z1 + z2)) / (8 * cellSize);

  const slopeRad = Math.atan(Math.sqrt(dzdx ** 2 + dzdy ** 2));
  const slopeDeg = slopeRad * (180 / Math.PI);

  let aspectRad = Math.atan2(dzdy, -dzdx);
  if (aspectRad < 0) aspectRad += 2 * Math.PI;
  const aspectDeg = aspectRad * (180 / Math.PI);

  return {
    slope: slopeDeg,
    aspect: aspectDeg,
  };
}

async function computeStuff(lat, lng) {
  const tile = latLngToTile(lat, lng, 10);
  const { pixelX, pixelY } = latLngToPixelInTile(lat, lng, 10);
  const imageData = await fetchTileImage(tile.x, tile.y, 10);
  const neighbours = getNeighborhood(imageData, pixelX, pixelY);

  const slopeAndAspect = computeSlopeAndAspect(neighbours, 10);
  console.log(neighbours);
  console.log("elevation:", neighbours[4]);
  console.log(slopeAndAspect);
}

const MetaData = () => {
  return <></>;
};

export default MetaData;
export { computeStuff };
