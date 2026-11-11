import { describe, expect, it } from 'vitest';
import {
  DEMO_ADMIN_CREDENTIALS,
  DEMO_CUSTOMER_CREDENTIALS,
  canAccessAdmin,
  getAdminGateState,
  loginAdmin,
  loginCustomer,
} from './authService';

describe('authService RBAC and session separation', () => {
  it('authenticates valid demo admin and customer accounts with distinct roles', () => {
    const cust = loginCustomer(
      DEMO_CUSTOMER_CREDENTIALS.email,
      DEMO_CUSTOMER_CREDENTIALS.password,
    );
    expect(cust.ok).toBe(true);
    if (cust.ok) {
      expect(cust.session.role).toBe('customer');
    }

    const admin = loginAdmin(
      DEMO_ADMIN_CREDENTIALS.email,
      DEMO_ADMIN_CREDENTIALS.password,
    );
    expect(admin.ok).toBe(true);
    if (admin.ok) {
      expect(admin.session.role).toBe('admin');
      expect(canAccessAdmin(admin.session)).toBe(true);
    }
  });

  it('blocks customer credentials or wrong password from gaining admin access', () => {
    const wrongAdmin = loginAdmin(
      DEMO_CUSTOMER_CREDENTIALS.email,
      DEMO_CUSTOMER_CREDENTIALS.password,
    );
    expect(wrongAdmin.ok).toBe(false);
    expect(canAccessAdmin(null)).toBe(false);
  });

  it('distinguishes unauthenticated vs customer-role 403 vs authorized admin on /admin route', () => {
    expect(getAdminGateState(null, null)).toBe('unauthenticated');
    const cust = loginCustomer(
      DEMO_CUSTOMER_CREDENTIALS.email,
      DEMO_CUSTOMER_CREDENTIALS.password,
    );
    expect(cust.ok).toBe(true);
    if (cust.ok) {
      expect(getAdminGateState(null, cust.session)).toBe('forbidden-customer');
    }
    const admin = loginAdmin(
      DEMO_ADMIN_CREDENTIALS.email,
      DEMO_ADMIN_CREDENTIALS.password,
    );
    if (admin.ok && cust.ok) {
      expect(getAdminGateState(admin.session, cust.session)).toBe('authorized');
    }
  });
});

