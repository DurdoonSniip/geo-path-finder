import { Company } from "@/types/company";
import CompanyCard from "./CompanyCard";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { clearCompanies } from "@/utils/storage";
import { useToast } from "@/components/ui/use-toast";

interface CompanyListProps {
  companies: Company[];
  onClear: () => void;
}

const CompanyList = ({ companies, onClear }: CompanyListProps) => {
  const { toast } = useToast();

  const handleClear = () => {
    clearCompanies();
    onClear();
    toast({
      title: "Liste effacée",
      description: "La liste des entreprises a été effacée avec succès.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Liste des entreprises (triées par proximité)
        </h2>
        <Button 
          variant="destructive" 
          onClick={handleClear}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Effacer la liste
        </Button>
      </div>
      
      <div className="space-y-4">
        {companies.map((company, index) => (
          <CompanyCard 
            key={company.id} 
            company={company}
            isFirst={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyList;