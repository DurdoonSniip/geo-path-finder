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

const calculateArrivalTime = (startTime: string, durationInMinutes: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationInMinutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = Math.floor(totalMinutes % 60);
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};

export const calculateDistances = async (companies: Company[]): Promise<Company[]> => {
  const startTime = "09:00"; // Heure de départ
  let currentTime = startTime;
  const result: Company[] = [];
  const remaining = [...companies];
  
  // Point de départ
  let currentPoint = REFERENCE_POINT;
  
  while (remaining.length > 0) {
    let bestCompanyIndex = -1;
    let bestScore = Infinity;
    
    // Évaluer chaque entreprise restante
    for (let i = 0; i < remaining.length; i++) {
      const company = remaining[i];
      const distance = calculateDistance(
        currentPoint.latitude,
        currentPoint.longitude,
        company.latitude,
        company.longitude
      );
      
      // Score basé sur la distance (plus c'est proche, meilleur c'est)
      const score = distance;
      if (score < bestScore) {
        bestScore = score;
        bestCompanyIndex = i;
      }
    }
    
    const bestCompany = remaining[bestCompanyIndex];
    const duration = await getDrivingDuration(
      currentPoint.latitude,
      currentPoint.longitude,
      bestCompany.latitude,
      bestCompany.longitude
    );
    
    const arrivalTime = calculateArrivalTime(currentTime, duration);
    
    result.push({
      ...bestCompany,
      distanceFromPrevious: bestScore,
      durationFromPrevious: duration,
      scheduledTime: arrivalTime
    });
    
    // Mettre à jour le point actuel et l'heure
    currentPoint = {
      latitude: bestCompany.latitude,
      longitude: bestCompany.longitude
    };
    currentTime = calculateArrivalTime(arrivalTime, 30); // Ajouter 30 minutes pour chaque visite
    
    remaining.splice(bestCompanyIndex, 1);
  }

  return result;
};