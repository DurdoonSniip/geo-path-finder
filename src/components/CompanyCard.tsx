import { Company } from "@/types/company";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock } from "lucide-react";

interface CompanyCardProps {
  company: Company;
  isFirst: boolean;
}

const CompanyCard = ({ company, isFirst }: CompanyCardProps) => {
  const getWazeUrl = (lat: number, lon: number) => {
    return `https://www.waze.com/ul?ll=${lat}%2C${lon}&navigate=yes`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{company.name}</h3>
            <p className="text-gray-600">{company.city}</p>
            
            {company.distanceFromPrevious !== undefined && (
              <p className="text-sm text-gray-500 mt-2">
                Distance {isFirst ? "du point de départ" : "de l'entreprise précédente"} :{" "}
                {company.distanceFromPrevious.toFixed(2)} km
              </p>
            )}

            {company.durationFromPrevious !== undefined && company.durationFromPrevious > 0 && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Clock size={14} />
                Durée en voiture : {formatDuration(company.durationFromPrevious)}
              </p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(getWazeUrl(company.latitude, company.longitude))}
            className="flex items-center gap-2"
          >
            <ExternalLink size={16} />
            Waze
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;