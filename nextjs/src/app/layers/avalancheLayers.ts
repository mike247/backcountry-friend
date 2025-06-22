import { PolygonLayer } from "deck.gl";
import { _TerrainExtension as TerrainExtension } from "@deck.gl/extensions";
import { Device } from "@luma.gl/core";
import { shaderTilelayer } from "./shaderTileLayer";
import { AvalancheLayer } from "@/reducers/state";
import shaderLookup from "../shaders/shaderLookup";
import { Forecast } from "@/reducers/forecastTypes";
import { AvalancheUniformProps } from "../shaders/uniforms";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
}

async function createMaskTexture(device: Device, src: string) {
  const image = await loadImage(src);

  const texture = device.createTexture({
    data: image,
  });

  return texture;
}

const likelihoodColor: {
  0: [number, number, number];
  1: [number, number, number];
  2: [number, number, number];
  3: [number, number, number];
  4: [number, number, number];
  5: [number, number, number];
} = {
  0: [0.847, 0.847, 0.847],
  1: [0.329, 0.733, 0.318],
  2: [1.0, 0.957, 0.125],
  3: [0.973, 0.592, 0.173],
  4: [0.941, 0.165, 0.165],
  5: [0, 0, 0],
};

const consolidateForecasts = (regionForecast: Forecast | undefined) => {
  const baseAspects = {
    n: 0,
    ne: 0,
    e: 0,
    se: 0,
    s: 0,
    sw: 0,
    w: 0,
    nw: 0,
  };

  const consolidatedForecast: Record<string, Record<string, number>> = {
    ha: { ...baseAspects },
    a: { ...baseAspects },
    sa: { ...baseAspects },
  };

  if (regionForecast) {
    for (const danger of regionForecast.avalancheDangers) {
      if (!danger) continue;
      const likelihood = danger.likelihood ?? 0;

      for (const key of Object.keys(consolidatedForecast)) {
        const aspects = danger.aspects?.[key];
        if (!aspects) continue;

        for (const aspect of Object.keys(baseAspects)) {
          if (aspects[aspect] >= 0) {
            consolidatedForecast[key][aspect] = Math.max(
              consolidatedForecast[key][aspect],
              aspects[aspect] > 0 ? aspects[aspect] : likelihood
            );
          }
        }
      }
    }
  }

  return consolidatedForecast;
};

const generateAvalancheLayers = async ({
  threeDimensions,
  device,
  avalancheLayer,
  forecast,
}: {
  threeDimensions: boolean;
  device: Device;
  avalancheLayer: AvalancheLayer;
  forecast: Forecast[];
}) => {
  const shaderProps: { [key: string]: number } = {};
  Object.keys(avalancheLayer.sliders).forEach((key) => {
    shaderProps[key] = avalancheLayer.sliders[key].value;
  });

  const layers = avalancheLayer.regions.map(async (region) => {
    const regionForecast = forecast.find((f) => f.regionId === region.regionId);
    const consolidatedForecast = consolidateForecasts(regionForecast);
    const avalancheUniforms: AvalancheUniformProps = Object.keys(
      consolidatedForecast
    ).reduce(
      (out, altitude) => {
        const aspects = consolidatedForecast[altitude];
        Object.keys(aspects).forEach((aspect) => {
          const key = `${altitude}_${aspect}` as keyof Omit<
            AvalancheUniformProps,
            "ha_min" | "a_min"
          >;
          const likelihood = aspects[aspect] as 0 | 1 | 2 | 3 | 4 | 5;
          const color = likelihoodColor[likelihood];
          out[key] = color;
        });

        return out;
      },
      {
        ha_min: regionForecast?.altitudeDanger[0].altitudeFrom ?? 0,
        a_min: regionForecast?.altitudeDanger[1].altitudeFrom ?? 0,
      } as AvalancheUniformProps
    );

    const maskTexture = await createMaskTexture(device, region.mask);
    const shader = shaderTilelayer({
      threeDimensions,
      id: region.id,
      minZoom: avalancheLayer.meta.minZoom,
      maxZoom: avalancheLayer.meta.maxZoom,
      data: avalancheLayer.url,
      shaderProps,
      visible: avalancheLayer.active,
      shader: shaderLookup[avalancheLayer.id],
      texture: maskTexture,
      maskBounds: region.maskBounds,
      avalancheUniforms,
    });

    const max = Math.max(
      ...Object.values(consolidatedForecast).flatMap((aspect) =>
        Object.values(aspect)
      )
    );

    const polygon = new PolygonLayer<{
      points: [longitude: number, latitude: number][];
    }>({
      id: region.id + "-polygon" + threeDimensions,
      data: [
        {
          points: region.bounds,
        },
      ],
      getPolygon: (d) => d.points,
      getLineColor: likelihoodColor[max as 0 | 1 | 2 | 3 | 4 | 5].map(
        (col) => col * 256
      ) as [number, number, number], // TODO Tidy up types
      filled: false,
      getLineWidth: 5,
      stroked: true,
      lineWidthUnits: "pixels",
      extensions: threeDimensions ? [new TerrainExtension()] : [],
      opacity: 1.0,
    });

    return [shader, polygon];
  });

  return (await Promise.all(layers)).flat();
};

export default generateAvalancheLayers;
