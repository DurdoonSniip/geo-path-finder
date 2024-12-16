import { Company } from "@/types/company";
import CompanyCard from "./CompanyCard";
import { Button } from "@/components/ui/button";
import { Trash2, FilePdf } from "lucide-react";
import { clearCompanies, saveCompanies, updateCompanyCompletion } from "@/utils/storage";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface CompanyListProps {
  companies: Company[];
  onClear: () => void;
  onUpdateCompanies: (companies: Company[]) => void;
}

const CompanyList = ({ companies, onClear, onUpdateCompanies }: CompanyListProps) => {
  const { toast } = useToast();

  const handleClear = () => {
    clearCompanies();
    onClear();
    toast({
      title: "Liste effacée",
      description: "La liste des entreprises a été effacée avec succès.",
    });
  };

  const handleCompletionToggle = (companyId: string, completed: boolean) => {
    const updatedCompanies = updateCompanyCompletion(companies, companyId, completed);
    onUpdateCompanies(updatedCompanies);
  };

  const generatePDF = async () => {
    const element = document.getElementById('company-list');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('entreprises.pdf');

      toast({
        title: "PDF généré",
        description: "Le PDF a été généré avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Liste des entreprises (triées par proximité)
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={generatePDF}
            className="gap-2"
          >
            <FilePdf className="w-4 h-4" />
            Générer un PDF
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleClear}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Effacer la liste
          </Button>
        </div>
      </div>
      
      <div id="company-list" className="space-y-4">
        {companies.map((company, index) => (
          <CompanyCard 
            key={company.id} 
            company={company}
            isFirst={index === 0}
            onCompletionToggle={handleCompletionToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyList;