import { useState, useEffect } from "react";
import NumberInput from "@/components/NumberInput";
import CompanyForm from "@/components/CompanyForm";
import CompanyList from "@/components/CompanyList";
import { Company } from "@/types/company";
import { loadCompanies } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const [numberOfCompanies, setNumberOfCompanies] = useState<number>(0);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier d'abord s'il y a des données partagées dans l'URL
    const sharedData = searchParams.get('data');
    if (sharedData) {
      try {
        const decodedData = JSON.parse(atob(sharedData));
        if (decodedData.companies && Array.isArray(decodedData.companies)) {
          const companiesWithIds = decodedData.companies.map((company: any) => ({
            ...company,
            id: Math.random().toString(36).substr(2, 9),
          }));
          setCompanies(companiesWithIds);
          toast({
            title: "Itinéraire partagé chargé",
            description: "L'itinéraire partagé a été chargé avec succès.",
          });
        }
      } catch (error) {
        console.error('Erreur lors du décodage des données partagées:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'itinéraire partagé.",
          variant: "destructive",
        });
      }
    } else {
      // Si pas de données partagées, charger les données locales
      const savedCompanies = loadCompanies();
      if (savedCompanies.length > 0) {
        setCompanies(savedCompanies);
      }
    }
  }, [searchParams, toast]);

  const handleCompaniesSubmit = (sortedCompanies: Company[]) => {
    setCompanies(sortedCompanies);
  };

  const handleClear = () => {
    setCompanies([]);
    setNumberOfCompanies(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Optimisateur de Route Entreprises
        </h1>
        
        {companies.length === 0 ? (
          <>
            <NumberInput 
              value={numberOfCompanies} 
              onChange={setNumberOfCompanies} 
            />
            {numberOfCompanies > 0 && (
              <CompanyForm 
                numberOfCompanies={numberOfCompanies}
                onSubmit={handleCompaniesSubmit}
              />
            )}
          </>
        ) : (
          <CompanyList 
            companies={companies}
            onClear={handleClear}
            onUpdateCompanies={setCompanies}
          />
        )}
      </div>
    </div>
  );
};

export default Index;