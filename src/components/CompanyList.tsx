import { Company } from "@/types/company";
import CompanyCard from "./CompanyCard";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Share2 } from "lucide-react";
import { clearCompanies, saveCompanies, updateCompanyCompletion } from "@/utils/storage";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";
import RouteStats from "./RouteStats";

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
  };

  const handleCompletionToggle = (companyId: string, completed: boolean) => {
    const updatedCompanies = updateCompanyCompletion(companies, companyId, completed);
    onUpdateCompanies(updatedCompanies);
  };

  const handleShare = async () => {
    // Créer un objet avec les données à partager
    const shareData = {
      companies: companies.map(company => ({
        name: company.name,
        city: company.city,
        scheduledTime: company.scheduledTime,
        completed: company.completed
      }))
    };

    // Convertir en string et encoder en base64
    const encodedData = btoa(JSON.stringify(shareData));
    
    // Créer l'URL complète
    const shareUrl = `${window.location.origin}?data=${encodedData}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié !",
        description: "Le lien de partage a été copié dans votre presse-papiers.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien. Veuillez réessayer.",
        variant: "destructive",
      });
    }
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

      // Ajouter un fond gris pour les entreprises complétées
      if (company.completed) {
        pdf.setFillColor(240, 240, 240); // Couleur de fond gris clair
        pdf.rect(margin - 2, yOffset - 5, 170, lineHeight * 6, 'F'); // Rectangle de fond
        pdf.setTextColor(128, 128, 128); // Texte en gris
      } else {
        pdf.setTextColor(0, 0, 0); // Texte en noir
      }

      // Nom de l'entreprise avec statut
      pdf.setFont("helvetica", "bold");
      pdf.text(`${index + 1}. ${company.name}${company.completed ? ' ✓' : ''}`, margin, yOffset);
      yOffset += lineHeight;

      // Ville
      pdf.setFont("helvetica", "normal");
      pdf.text(`Ville: ${company.city}`, margin + 5, yOffset);
      yOffset += lineHeight;

      // Heure de passage prévue
      if (company.scheduledTime) {
        pdf.text(`Heure de passage prévue: ${company.scheduledTime}`, margin + 5, yOffset);
        yOffset += lineHeight;
      }

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
      pdf.setTextColor(0, 0, 255);
      pdf.setFont("helvetica", "bold");
      pdf.textWithLink("Ouvrir dans Waze", margin + 5, yOffset, { url: getWazeUrl(company.latitude, company.longitude) });
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
    <div className="space-y-8">
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
            variant="outline" 
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Partager
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

      <RouteStats companies={companies} />
      
      <div 
        id="company-list" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max"
      >
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