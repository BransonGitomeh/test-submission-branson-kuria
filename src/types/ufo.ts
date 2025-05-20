
// Basic type for a UFO sighting from the API
export interface Sighting {
  date: string; // "DD/MM/YYYY" format from API
  sightings: number;
}

// Type alias for API response
export type UfoSighting = Sighting;

// For processed daily sightings data
export interface DailySighting {
  date: Date; // Standard JavaScript Date object
  sightings: number;
}

// For daily sightings grouped by date
export interface DailySightings {
  date: string;
  sightings: number;
}

// For weekly sightings
export interface WeeklySightings {
  startDate: string | Date;
  endDate: string | Date;
  dailySightings: DailySightings[];
}

// For trend chart data
export interface TrendData {
  date: string;
  sightings: number;
  average?: number | null;
}

// For distribution chart data
export interface DistributionData {
  name: string;
  value: number;
}
