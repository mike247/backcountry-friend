export interface Forecast {
  id: number;
  lastEdited: string; // ISO 8601 datetime string
  created: string; // ISO 8601 datetime string
  validPeriod: string; // e.g., "48hrs"
  regionId: number;
  forecaster: string;
  altitudeDanger: AltitudeDanger[];
  avalancheDangers: (AvalancheDanger | null)[];
  importantInformation: string;
  additionalInformation: AdditionalInformation[];
  metserviceForecastLink: string;
}

export interface AltitudeDanger {
  rating: number;
  description: string;
  altitudeFrom?: number;
  altitudeTo?: number;
}

export interface AvalancheDanger {
  priority: string;
  priority_level: number;
  description: string;
  time: AvalancheTime;
  trend: "Increasing" | "Decreasing" | "NoChange" | string; // Extendable
  character: AvalancheCharacter;
  likelihood: number;
  size: number;
  aspects: AvalancheAspects;
}

export interface AvalancheTime {
  start: string; // e.g., "00:00:00"
  end: string; // e.g., "00:00:00"
  isAllDay: boolean;
}

export interface AvalancheCharacter {
  title: string;
  iconUrl: string;
}

export interface AvalancheAspects {
  [key: string]: AspectDirections;
}

export interface AspectDirections {
  [direction: string]: number; // e.g., "n", "ne", "e", "se", "s", etc.
}

export interface AdditionalInformation {
  title: string;
  content: string | null;
  icon: string;
  forecastImages?: ForecastImage[];
}

export interface ForecastImage {
  // Define if structure is known; placeholder for now
  [key: string]: string;
}
