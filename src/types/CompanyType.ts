export interface CompanyType {
  _id: string,
  name: string,
  noDiacriticName?: string,
  holding?: { name: string, noDiacriticName?: string }
 }
