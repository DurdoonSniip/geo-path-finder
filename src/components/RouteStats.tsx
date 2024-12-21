import { Company } from "@/types/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, CheckCircle, Car } from "lucide-react";
import VisitsTimelineChart from "./VisitsTimelineChart";

interface RouteStatsProps {
  companies: Company[];
}

const RouteStats = ({ companies }: RouteStatsProps) => {
  // Calcul des statistiques
  const totalDistance = companies.reduce((acc, company) => 
    acc + (company.distanceFromPrevious || 0), 0
  );
  
  const totalDuration = companies.reduce((acc, company) => 
    acc + (company.durationFromPrevious || 0), 0
  );
  
  const completedCompanies = companies.filter(c => c.completed).length;
  const allCompleted = completedCompanies === companies.length;
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance Totale</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance.toFixed(1)} km</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Total Estimé</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(totalDuration)}</div>
          </CardContent>
        </Card>

        <Card className={allCompleted ? "bg-green-100" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
            <CheckCircle className={`h-4 w-4 ${allCompleted ? "text-green-600" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${allCompleted ? "text-green-600" : ""}`}>
              {completedCompanies}/{companies.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne par Trajet</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalDistance / Math.max(companies.length - 1, 1)).toFixed(1)} km
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Répartition des Visites</CardTitle>
        </CardHeader>
        <CardContent>
          <VisitsTimelineChart companies={companies} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteStats;