import { useState } from "react";
import NumberInput from "@/components/NumberInput";
import CompanyForm from "@/components/CompanyForm";
import CompanyList from "@/components/CompanyList";
import { Company } from "@/types/company";

const Index = () => {
  const [numberOfCompanies, setNumberOfCompanies] = useState<number>(0);
  const [companies, setCompanies] = useState<Company[]>([]);

  const handleCompaniesSubmit = (sortedCompanies: Company[]) => {
    setCompanies(sortedCompanies);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
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
          <CompanyList companies={companies} />
        )}
      </div>
    </div>
  );
};

export default Index;