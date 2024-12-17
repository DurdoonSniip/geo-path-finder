import { Company } from "@/types/company";

const REFERENCE_POINT = {
  latitude: 47.2629133,
  longitude: -1.4844803,
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

const getDrivingDuration = async (
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): Promise<number> => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=false`
    );
    const data = await response.json();
    if (data.routes && data.routes[0]) {
      return data.routes[0].duration / 60; // Conversion en minutes
    }
    return 0;
  } catch (error) {
    console.error("Error fetching duration:", error);
    return 0;
  }
};

const compareScheduledTimes = (a: string, b: string): number => {
  const [hoursA, minutesA] = a.split(':').map(Number);
  const [hoursB, minutesB] = b.split(':').map(Number);
  
  if (hoursA !== hoursB) {
    return hoursA - hoursB;
  }
  return minutesA - minutesB;
};

export const calculateDistances = async (companies: Company[]): Promise<Company[]> => {
  console.log("Sorting companies by scheduled time:", companies);
  
  // Trier les entreprises par heure de passage
  const sortedCompanies = [...companies].sort((a, b) => 
    compareScheduledTimes(a.scheduledTime, b.scheduledTime)
  );
  
  console.log("Companies sorted by scheduled time:", sortedCompanies);

  const result: Company[] = [];
  let currentPoint = REFERENCE_POINT;
  
  for (let i = 0; i < sortedCompanies.length; i++) {
    const company = sortedCompanies[i];
    const distance = calculateDistance(
      currentPoint.latitude,
      currentPoint.longitude,
      company.latitude,
      company.longitude
    );
    
    const duration = await getDrivingDuration(
      currentPoint.latitude,
      currentPoint.longitude,
      company.latitude,
      company.longitude
    );
    
    result.push({
      ...company,
      distanceFromPrevious: distance,
      durationFromPrevious: duration
    });
    
    currentPoint = {
      latitude: company.latitude,
      longitude: company.longitude
    };
  }

  return result;
};