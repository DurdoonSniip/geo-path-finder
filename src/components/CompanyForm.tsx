import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { geocodeAddress } from "@/utils/geocoding";
import { calculateDistances } from "@/utils/distance";
import { saveCompanies } from "@/utils/storage";
import { Company } from "@/types/company";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CompanyFormProps {
  numberOfCompanies: number;
  onSubmit: (companies: Company[]) => void;
}

const CompanyForm = ({ numberOfCompanies, onSubmit }: CompanyFormProps) => {
  const [companies, setCompanies] = useState<Array<{ 
    name: string; 
    city: string;
    scheduledTime: string;
  }>>(
    Array(numberOfCompanies).fill({ 
      name: "", 
      city: "",
      scheduledTime: "09:00"
    })
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [openCompany, setOpenCompany] = useState<number | null>(null);
  const [openCity, setOpenCity] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<{ companies: string[], cities: string[] }>({
    companies: [],
    cities: []
  });

  // Simuler une base de données d'entreprises (à remplacer par une vraie API)
  const companiesDB = [
    "Airbus",
    "Air France",
    "Alstom",
    "BNP Paribas",
    "Bouygues",
    "Carrefour",
    "Danone",
    "EDF",
    "Engie",
    "L'Oréal",
    "LVMH",
    "Michelin",
    "Orange",
    "Renault",
    "Saint-Gobain",
    "Sanofi",
    "Schneider Electric",
    "Société Générale",
    "Total",
    "Veolia"
  ];

  const searchCities = async (query: string) => {
    if (query.length < 2) return [];
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&country=france&city=${query}`);
      const data = await response.json();
      return data.map((item: any) => item.display_name.split(',')[0]);
    } catch (error) {
      console.error('Erreur lors de la recherche des villes:', error);
      return [];
    }
  };

  const searchCompanies = (query: string) => {
    return companiesDB.filter(company => 
      company.toLowerCase().startsWith(query.toLowerCase())
    );
  };

  const handleInputChange = async (
    index: number, 
    field: "name" | "city" | "scheduledTime", 
    value: string
  ) => {
    const newCompanies = [...companies];
    newCompanies[index] = { ...newCompanies[index], [field]: value };
    setCompanies(newCompanies);

    if (field === "name" && value.length >= 2) {
      const companyResults = searchCompanies(value);
      setSuggestions(prev => ({ ...prev, companies: companyResults }));
    } else if (field === "city" && value.length >= 2) {
      const cityResults = await searchCities(value);
      setSuggestions(prev => ({ ...prev, cities: cityResults }));
    }
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
            ...coordinates
          });
        }
      }

      if (companiesWithCoordinates.length === companies.length) {
        const sortedCompanies = await calculateDistances(companiesWithCoordinates);
        saveCompanies(sortedCompanies);
        onSubmit(sortedCompanies);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
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
            <Popover open={openCompany === index} onOpenChange={(open) => setOpenCompany(open ? index : null)}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCompany === index}
                  className="w-full justify-between"
                >
                  {company.name || "Sélectionner une entreprise..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Rechercher une entreprise..." 
                    value={company.name}
                    onValueChange={(value) => handleInputChange(index, "name", value)}
                  />
                  <CommandEmpty>Aucune entreprise trouvée.</CommandEmpty>
                  <CommandGroup>
                    {suggestions.companies.map((suggestion) => (
                      <CommandItem
                        key={suggestion}
                        value={suggestion}
                        onSelect={() => {
                          handleInputChange(index, "name", suggestion);
                          setOpenCompany(null);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            company.name === suggestion ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`company-city-${index}`}>Ville</Label>
            <Popover open={openCity === index} onOpenChange={(open) => setOpenCity(open ? index : null)}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCity === index}
                  className="w-full justify-between"
                >
                  {company.city || "Sélectionner une ville..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Rechercher une ville..." 
                    value={company.city}
                    onValueChange={(value) => handleInputChange(index, "city", value)}
                  />
                  <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                  <CommandGroup>
                    {suggestions.cities.map((suggestion) => (
                      <CommandItem
                        key={suggestion}
                        value={suggestion}
                        onSelect={() => {
                          handleInputChange(index, "city", suggestion);
                          setOpenCity(null);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            company.city === suggestion ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`scheduled-time-${index}`}>Heure de passage prévue</Label>
            <Input
              id={`scheduled-time-${index}`}
              type="time"
              value={company.scheduledTime}
              onChange={(e) => handleInputChange(index, "scheduledTime", e.target.value)}
              required
            />
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