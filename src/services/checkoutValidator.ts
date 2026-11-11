import type { CustomerShippingDetails } from '../types/order';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^(08|628|\+628)[0-9]{8,13}$/;
const POSTAL_RE = /^[0-9]{5}$/;

export function validateCheckoutForm(
  form: CustomerShippingDetails,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (form.fullName.trim().length < 2) {
    errors.fullName = 'Nama lengkap minimal 2 karakter.';
  }
  if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = 'Masukkan alamat email yang valid (contoh: nama@email.com).';
  }
  const normalizedPhone = form.phone.replace(/[\s-]/g, '');
  if (!PHONE_RE.test(normalizedPhone)) {
    errors.phone = 'Nomor HP wajib format Indonesia (contoh: 081234567890).';
  }
  if (form.address.trim().length < 10) {
    errors.address = 'Alamat lengkap minimal 10 karakter beserta patokan/nomor rumah.';
  }
  if (!form.province.trim()) {
    errors.province = 'Pilih atau isi provinsi tujuan.';
  }
  if (!form.city.trim()) {
    errors.city = 'Isi nama kota atau kabupaten.';
  }
  if (!form.district.trim()) {
    errors.district = 'Isi nama kecamatan tujuan.';
  }
  if (!POSTAL_RE.test(form.postalCode.trim())) {
    errors.postalCode = 'Kode pos wajib terdiri dari 5 digit angka.';
  }

  return errors;
}

export function validateNewsletterEmail(emailInput: string): string | null {
  const email = emailInput.trim();
  if (!email) {
    return 'Masukkan alamat email terlebih dahulu.';
  }
  if (!EMAIL_RE.test(email)) {
    return 'Format email belum valid (contoh: nama@email.com).';
  }
  return null;
}

