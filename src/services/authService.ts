import type { AdminSession, CustomerSession } from '../types/auth';

export const DEMO_CUSTOMER_CREDENTIALS = {
  email: 'customer@meika.id',
  password: 'meika123',
  profile: {
    id: 'cust-nadia',
    name: 'Nadia Putri',
    phone: '081288990011',
    defaultCity: 'Jakarta Selatan',
    defaultAddress: 'Jl. Kemang Raya No. 24, Mampang Prapatan',
  },
} as const;

export const DEMO_ADMIN_CREDENTIALS = {
  email: 'admin@meika.id',
  password: 'meika-admin-2026',
  profile: {
    id: 'admin-meika',
    name: 'Mei Kalista (Admin)',
  },
} as const;

export type AuthResult<T> =
  | { ok: true; session: T }
  | { ok: false; error: string };

export function loginCustomer(emailInput: string, passwordInput: string): AuthResult<CustomerSession> {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();

  if (!email || !password) {
    return { ok: false, error: 'Email dan kata sandi pelanggan wajib diisi.' };
  }

  if (email === DEMO_ADMIN_CREDENTIALS.email) {
    return {
      ok: false,
      error: 'Akun Administrator tidak masuk melalui portal pelanggan. Gunakan halaman Admin Login.',
    };
  }

  if (email === DEMO_CUSTOMER_CREDENTIALS.email && password === DEMO_CUSTOMER_CREDENTIALS.password) {
    return {
      ok: true,
      session: {
        id: DEMO_CUSTOMER_CREDENTIALS.profile.id,
        name: DEMO_CUSTOMER_CREDENTIALS.profile.name,
        email: DEMO_CUSTOMER_CREDENTIALS.email,
        phone: DEMO_CUSTOMER_CREDENTIALS.profile.phone,
        defaultCity: DEMO_CUSTOMER_CREDENTIALS.profile.defaultCity,
        defaultAddress: DEMO_CUSTOMER_CREDENTIALS.profile.defaultAddress,
        role: 'customer',
        loggedInAtIso: new Date().toISOString(),
      },
    };
  }

  return { ok: false, error: 'Email atau kata sandi akun pelanggan demo tidak sesuai.' };
}

export function loginAdmin(emailInput: string, passwordInput: string): AuthResult<AdminSession> {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();

  if (!email || !password) {
    return { ok: false, error: 'Email dan kata sandi administrator wajib diisi.' };
  }

  if (email === DEMO_ADMIN_CREDENTIALS.email && password === DEMO_ADMIN_CREDENTIALS.password) {
    return {
      ok: true,
      session: {
        id: DEMO_ADMIN_CREDENTIALS.profile.id,
        name: DEMO_ADMIN_CREDENTIALS.profile.name,
        email: DEMO_ADMIN_CREDENTIALS.email,
        role: 'admin',
        loggedInAtIso: new Date().toISOString(),
      },
    };
  }

  if (email === DEMO_CUSTOMER_CREDENTIALS.email) {
    return {
      ok: false,
      error: 'Akses ditolak: akun pelanggan tidak memiliki otorisasi Administrator.',
    };
  }

  return { ok: false, error: 'Kredensial administrator tidak valid.' };
}

export function canAccessAdmin(adminSession: AdminSession | null): boolean {
  return adminSession !== null && adminSession.role === 'admin';
}

export type AdminGateState = 'authorized' | 'forbidden-customer' | 'unauthenticated';

export function getAdminGateState(
  adminSession: AdminSession | null,
  customerSession: CustomerSession | null,
): AdminGateState {
  if (canAccessAdmin(adminSession)) {
    return 'authorized';
  }
  if (customerSession !== null && customerSession.role === 'customer') {
    return 'forbidden-customer';
  }
  return 'unauthenticated';
}

