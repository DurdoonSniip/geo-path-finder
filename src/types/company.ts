export interface Company {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  distanceFromPrevious?: number;
}

export interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}