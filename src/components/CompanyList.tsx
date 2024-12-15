import { Company } from "@/types/company";
import CompanyCard from "./CompanyCard";

interface CompanyListProps {
  companies: Company[];
}

const CompanyList = ({ companies }: CompanyListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        Liste des entreprises (triées par proximité)
      </h2>
      
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