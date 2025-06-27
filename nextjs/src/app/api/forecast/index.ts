function isStillValid({
  validPeriod,
  created,
}: {
  validPeriod: string;
  created: string;
}) {
  const createdDate = new Date(created.replace(" ", "T")); // Convert to ISO format
  const now = new Date();

  // Extract hours from the "validPeriod" string
  const match = validPeriod.match(/^(\d+)\s*hrs$/i);
  if (!match) {
    throw new Error("Unsupported validPeriod format");
  }

  const validHours = parseInt(match[1], 10);
  const expiryDate = new Date(
    createdDate.getTime() + validHours * 60 * 60 * 1000
  );

  return now <= expiryDate;
}

type forecast = {
  created: string;
  validPeriod: string;
  regionId: number;
};

export const getForecast = async () => {
  const url = "https://www.avalanche.net.nz/api/forecast";

  const response = await fetch(url, { next: { revalidate: 3600 } });

  const { forecasts } = await response.json();
  const validForecasts = forecasts.reduce(
    (acc: forecast[], forecast: forecast) => {
      if (
        isStillValid({
          created: forecast.created,
          validPeriod: forecast.validPeriod,
        })
      ) {
        const existing = acc.find((f) => f.regionId === forecast.regionId);
        // acc.push(forecast);
        if (existing) {
          if (new Date(existing.created) < new Date(forecast.created)) {
            acc = acc.filter((f) => f.regionId !== forecast.regionId);
            acc.push(forecast);
          }
        } else {
          acc.push(forecast);
        }
      }
      return acc;
    },
    []
  );

  return validForecasts;
};
