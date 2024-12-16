import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { geocodeAddress } from "@/utils/geocoding";
import { calculateDistances } from "@/utils/distance";
import { saveCompanies } from "@/utils/storage";
import { Company } from "@/types/company";

interface CompanyFormProps {
  numberOfCompanies: number;
  onSubmit: (companies: Company[]) => void;
}

const CompanyForm = ({ numberOfCompanies, onSubmit }: CompanyFormProps) => {
  const [companies, setCompanies] = useState<Array<{ 
    name: string; 
    city: string;
    openingHours: { start: string; end: string; }
  }>>(
    Array(numberOfCompanies).fill({ 
      name: "", 
      city: "", 
      openingHours: { start: "09:00", end: "17:00" }
    })
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    index: number, 
    field: "name" | "city" | "openingStart" | "openingEnd", 
    value: string
  ) => {
    const newCompanies = [...companies];
    if (field === "openingStart" || field === "openingEnd") {
      newCompanies[index] = {
        ...newCompanies[index],
        openingHours: {
          ...newCompanies[index].openingHours,
          [field === "openingStart" ? "start" : "end"]: value
        }
      };
    } else {
      newCompanies[index] = { ...newCompanies[index], [field]: value };
    }
    setCompanies(newCompanies);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const companiesWithCoordinates: Company[] = [];

      for (const company of companies) {
        const coordinates = await geocodeAddress(company.name, company.city);
        if (coordinates) {
          companiesWithCoordinates.push({
            id: Math.random().toString(36).substr(2, 9),
            ...company,
            ...coordinates,
            isOpen: false, // sera mis à jour lors du tri
          });
        }
      }

      if (companiesWithCoordinates.length === companies.length) {
        const sortedCompanies = await calculateDistances(companiesWithCoordinates);
        saveCompanies(sortedCompanies);
        onSubmit(sortedCompanies);
        toast({
          title: "Succès !",
          description: "Les entreprises ont été géocodées et triées avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement des données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {companies.map((company, index) => (
        <div key={index} className="space-y-4 p-4 bg-white rounded-lg shadow">
          <h3 className="font-medium">Entreprise {index + 1}</h3>
          
          <div className="space-y-2">
            <Label htmlFor={`company-name-${index}`}>Nom de l'entreprise</Label>
            <Input
              id={`company-name-${index}`}
              value={company.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`company-city-${index}`}>Ville</Label>
            <Input
              id={`company-city-${index}`}
              value={company.city}
              onChange={(e) => handleInputChange(index, "city", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`opening-start-${index}`}>Heure d'ouverture</Label>
              <Input
                id={`opening-start-${index}`}
                type="time"
                value={company.openingHours.start}
                onChange={(e) => handleInputChange(index, "openingStart", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`opening-end-${index}`}>Heure de fermeture</Label>
              <Input
                id={`opening-end-${index}`}
                type="time"
                value={company.openingHours.end}
                onChange={(e) => handleInputChange(index, "openingEnd", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Traitement en cours..." : "Valider"}
      </Button>
    </form>
  );
};

export default CompanyForm;