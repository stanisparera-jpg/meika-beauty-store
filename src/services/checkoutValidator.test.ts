import { describe, expect, it } from 'vitest';
import { validateCheckoutForm, validateNewsletterEmail } from './checkoutValidator';

describe('checkoutValidator Indonesian address & contact rules', () => {
  it('flags missing or malformed fields cleanly', () => {
    const errors = validateCheckoutForm({
      fullName: 'A',
      email: 'bukan-email',
      phone: '1234',
      address: 'Pendek',
      province: '',
      city: '',
      district: '',
      postalCode: '123',
      shippingZone: 'jabodetabek',
      shippingService: 'reguler',
    });

    expect(Object.keys(errors)).toEqual(
      expect.arrayContaining([
        'fullName',
        'email',
        'phone',
        'address',
        'province',
        'city',
        'district',
        'postalCode',
      ]),
    );
  });

  it('passes valid Indonesian Jabodetabek/national checkout details and newsletter emails', () => {
    const valid = validateCheckoutForm({
      fullName: 'Nadia Putri',
      email: 'nadia@contoh.id',
      phone: '081288990011',
      address: 'Jl. Kemang Raya No. 24, Mampang Prapatan',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      district: 'Mampang Prapatan',
      postalCode: '12730',
      shippingZone: 'jabodetabek',
      shippingService: 'reguler',
    });

    expect(valid).toEqual({});
    expect(validateNewsletterEmail('nama@email.com')).toBeNull();
    expect(validateNewsletterEmail('salah')).not.toBeNull();
  });
});

