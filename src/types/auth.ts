export type UserRole = 'customer' | 'admin';

export interface CustomerSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  defaultCity: string;
  defaultAddress: string;
  role: 'customer';
  loggedInAtIso: string;
}

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  loggedInAtIso: string;
}

