import { Company } from "@/types/company";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, Image } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface CompanyCardProps {
  company: Company;
  isFirst: boolean;
  onCompletionToggle: (id: string, completed: boolean) => void;
}

const CompanyCard = ({ company, isFirst, onCompletionToggle }: CompanyCardProps) => {
  const [showImage, setShowImage] = useState(false);

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

  const getStreetViewUrl = () => {
    return `https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${company.latitude},${company.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`;
  };

  return (
    <>
      <Card 
        className={`hover:shadow-lg transition-shadow cursor-pointer ${company.completed ? 'opacity-50' : ''}`}
        onClick={() => setShowImage(true)}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={company.completed}
                  onCheckedChange={(checked) => {
                    onCompletionToggle(company.id, checked === true);
                    // Prevent card click when clicking checkbox
                    event?.stopPropagation();
                  }}
                  className="mt-1"
                />
                <div>
                  <h3 className="font-semibold text-lg">{company.name}</h3>
                  <p className="text-gray-600">{company.city}</p>
                  {company.scheduledTime && (
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">
                        Passage prévu à {company.scheduledTime}
                      </span>
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
              onClick={(e) => {
                e.stopPropagation();
                window.open(getWazeUrl(company.latitude, company.longitude));
              }}
              className="flex items-center gap-2"
            >
              <ExternalLink size={16} />
              Waze
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showImage} onOpenChange={setShowImage}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{company.name} - {company.city}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
            <img
              src={`https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${company.latitude},${company.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`}
              alt={`Vue de ${company.name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Si l'image ne charge pas, on affiche une image de secours
                e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop";
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompanyCard;