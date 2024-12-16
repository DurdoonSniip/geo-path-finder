import { Company } from "@/types/company";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, CheckSquare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CompanyCardProps {
  company: Company;
  isFirst: boolean;
  onCompletionToggle: (id: string, completed: boolean) => void;
}

const CompanyCard = ({ company, isFirst, onCompletionToggle }: CompanyCardProps) => {
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

  // Vérifier si les horaires d'ouverture sont définis
  const hasOpeningHours = company.openingHours && 
    typeof company.openingHours.start === 'string' && 
    typeof company.openingHours.end === 'string';

  return (
    <Card className={`hover:shadow-lg transition-shadow ${company.completed ? 'opacity-50' : ''}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={company.completed}
                onCheckedChange={(checked) => onCompletionToggle(company.id, checked === true)}
                className="mt-1"
              />
              <div>
                <h3 className="font-semibold text-lg">{company.name}</h3>
                <p className="text-gray-600">{company.city}</p>
                {hasOpeningHours && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm font-medium ${company.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {company.isOpen ? 'Ouvert' : 'Fermé'}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({company.openingHours.start} - {company.openingHours.end})
                    </span>
                    {company.scheduledTime && (
                      <span className="text-sm font-medium text-blue-600 ml-2">
                        Passage prévu à {company.scheduledTime}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {company.distanceFromPrevious !== undefined && (
              <p className="text-sm text-gray-500 mt-2">
                Distance {isFirst ? "du point de départ" : "de l'entreprise précédente"} :{" "}
                {company.distanceFromPrevious.toFixed(2)} km
              </p>
            )}

            {company.durationFromPrevious !== undefined && company.durationFromPrevious > 0 && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Clock size={14} />
                Durée en voiture depuis {isFirst ? "le point de départ" : "l'entreprise précédente"} : {formatDuration(company.durationFromPrevious)}
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