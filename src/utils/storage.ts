const STORAGE_KEY = 'companies';

export const saveCompanies = (companies: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
};

export const loadCompanies = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const clearCompanies = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const updateCompanyCompletion = (companies: any[], companyId: string, completed: boolean) => {
  const updatedCompanies = companies.map(company => 
    company.id === companyId ? { ...company, completed } : company
  );
  saveCompanies(updatedCompanies);
  return updatedCompanies;
};