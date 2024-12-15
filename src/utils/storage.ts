import { Company } from "@/types/company";

const STORAGE_KEY = "companies";

export const saveCompanies = (companies: Company[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
};

export const loadCompanies = (): Company[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};