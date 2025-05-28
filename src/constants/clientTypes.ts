// Client types as a const array
export const CLIENT_TYPES = [
  'Individuals',
  'High Net Worth Individuals',
  'Business Owners', 
  'Retirees',
  'Families',
  'Young Professionals',
  'Medical Professionals',
  'Tech Professionals'
] as const;

export type ClientType = typeof CLIENT_TYPES[number];
