export interface Company {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  distanceFromPrevious?: number;
  durationFromPrevious?: number;
  completed?: boolean;
  openingHours: {
    start: string; // format "HH:mm"
    end: string; // format "HH:mm"
  };
  isOpen?: boolean;
  scheduledTime?: string; // format "HH:mm"
}

export interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}