import { GeocodingResult } from "@/types/company";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

export const geocodeAddress = async (name: string, city: string) => {
  try {
    const query = `${name}, ${city}`;
    const response = await fetch(
      `${NOMINATIM_BASE_URL}?q=${encodeURIComponent(
        query
      )}&format=json&limit=1`
    );
    
    if (!response.ok) {
      throw new Error("Geocoding failed");
    }

    const data: GeocodingResult[] = await response.json();
    
    if (data.length === 0) {
      throw new Error("No results found");
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};