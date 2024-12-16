import { Company } from "@/types/company";
import CompanyCard from "./CompanyCard";
import { Button } from "@/components/ui/button";
import { Trash2, FileText } from "lucide-react";
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

  const generatePDF = async () => {
    const pdf = new jsPDF();
    let yOffset = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;

    // Titre
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("Liste des entreprises", margin, yOffset);
    yOffset += lineHeight * 2;

    // Style pour le contenu
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");

    companies.forEach((company, index) => {
      // Vérifier s'il faut ajouter une nouvelle page
      if (yOffset > pageHeight - 40) {
        pdf.addPage();
        yOffset = 20;
      }

      // Nom de l'entreprise
      pdf.setFont("helvetica", "bold");
      pdf.text(`${index + 1}. ${company.name}${company.completed ? ' (Terminé)' : ''}`, margin, yOffset);
      yOffset += lineHeight;

      // Ville
      pdf.setFont("helvetica", "normal");
      pdf.text(`Ville: ${company.city}`, margin + 5, yOffset);
      yOffset += lineHeight;

      // Distance et durée
      if (company.distanceFromPrevious !== undefined) {
        pdf.text(
          `Distance ${index === 0 ? "du point de départ" : "de l'entreprise précédente"}: ${company.distanceFromPrevious.toFixed(2)} km`,
          margin + 5,
          yOffset
        );
        yOffset += lineHeight;
      }

      if (company.durationFromPrevious !== undefined && company.durationFromPrevious > 0) {
        pdf.text(
          `Durée en voiture: ${formatDuration(company.durationFromPrevious)}`,
          margin + 5,
          yOffset
        );
        yOffset += lineHeight;
      }

      // Lien Waze
      const wazeUrl = getWazeUrl(company.latitude, company.longitude);
      pdf.setTextColor(0, 0, 255);
      pdf.setFont("helvetica", "bold");
      pdf.textWithLink("Ouvrir dans Waze", margin + 5, yOffset, { url: wazeUrl });
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");

      yOffset += lineHeight * 2;
    });

    try {
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
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={generatePDF}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
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
