export interface Company {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  distanceFromPrevious?: number;
  durationFromPrevious?: number;
  completed?: boolean;
}

export interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}