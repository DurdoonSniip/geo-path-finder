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

export const calculateDistances = (companies: Company[]): Company[] => {
  const result: Company[] = [];
  const remaining = [...companies];

  // Trouver l'entreprise la plus proche du point de référence
  let currentPoint = REFERENCE_POINT;
  
  while (remaining.length > 0) {
    let minDistance = Infinity;
    let closestIndex = -1;

    remaining.forEach((company, index) => {
      const distance = calculateDistance(
        currentPoint.latitude,
        currentPoint.longitude,
        company.latitude,
        company.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    const closestCompany = remaining[closestIndex];
    result.push({
      ...closestCompany,
      distanceFromPrevious: minDistance,
    });

    remaining.splice(closestIndex, 1);
    currentPoint = {
      latitude: closestCompany.latitude,
      longitude: closestCompany.longitude,
    };
  }

  return result;
};