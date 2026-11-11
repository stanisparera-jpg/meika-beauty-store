import { describe, expect, it } from 'vitest';
import { SEED_BRANDS } from './brands';
import { SEED_PRODUCTS } from './products';

const REQUIRED_SUBCATEGORIES = [
  'Foundation',
  'Cushion',
  'Concealer',
  'Loose Powder',
  'Compact Powder',
  'Blush On',
  'Highlighter',
  'Contour',
  'Setting Spray',
  'Lipstick',
  'Lip Tint',
  'Lip Cream',
  'Lip Gloss',
  'Lip Balm',
  'Mascara',
  'Eyeliner',
  'Eyeshadow',
  'Eyebrow Pencil',
  'Eyebrow Gel',
  'Facial Wash',
  'Toner',
  'Serum',
  'Moisturizer',
  'Sunscreen',
  'Micellar Water',
  'Makeup Brush',
  'Beauty Blender',
  'Makeup Remover',
  'Eyelash Curler',
];

const REQUIRED_BRANDS = [
  'Maybelline',
  'Wardah',
  'Emina',
  'Make Over',
  'Somethinc',
  'Skintific',
  'Hanasui',
  'YOU Beauty',
  'Implora',
  'The Originote',
];

describe('MEIKA catalog seed integrity', () => {
  it('includes at least 32 distinct products across all 5 categories, 29 subcategories, and 10 brands', () => {
    expect(SEED_PRODUCTS.length).toBeGreaterThanOrEqual(32);

    const ids = new Set(SEED_PRODUCTS.map((p) => p.id));
    const skus = new Set(SEED_PRODUCTS.map((p) => p.sku));
    const slugs = new Set(SEED_PRODUCTS.map((p) => p.slug));
    const names = new Set(SEED_PRODUCTS.map((p) => p.name));
    const images = new Set(SEED_PRODUCTS.map((p) => p.primaryImage));

    expect(ids.size).toBe(SEED_PRODUCTS.length);
    expect(skus.size).toBe(SEED_PRODUCTS.length);
    expect(slugs.size).toBe(SEED_PRODUCTS.length);
    expect(names.size).toBe(SEED_PRODUCTS.length);
    expect(images.size).toBe(SEED_PRODUCTS.length);

    const categoryNames = new Set(SEED_PRODUCTS.map((p) => p.categoryName));
    expect(categoryNames).toEqual(
      new Set(['Face Makeup', 'Lip Makeup', 'Eye Makeup', 'Skincare', 'Beauty Essentials']),
    );

    const subcats = new Set(SEED_PRODUCTS.map((p) => p.subcategory));
    for (const reqSub of REQUIRED_SUBCATEGORIES) {
      expect(subcats.has(reqSub)).toBe(true);
    }

    const catalogBrands = new Set(SEED_PRODUCTS.map((p) => p.brandName));
    expect(SEED_BRANDS.map((b) => b.name)).toEqual(REQUIRED_BRANDS);
    for (const brand of REQUIRED_BRANDS) {
      expect(catalogBrands.has(brand)).toBe(true);
    }
  });

  it('enforces conditional shades strictly: false for Skincare, Beauty Essentials, and Setting Spray', () => {
    for (const p of SEED_PRODUCTS) {
      expect(p.variants.length).toBeGreaterThanOrEqual(1);
      if (
        p.categoryId === 'skincare' ||
        p.categoryId === 'beauty-essentials' ||
        p.subcategory === 'Setting Spray'
      ) {
        expect(p.hasShades).toBe(false);
      } else {
        expect(p.hasShades).toBe(true);
        for (const v of p.variants) {
          expect(v.colorHex).toMatch(/^#[0-9A-Fa-f]{6}$/);
        }
      }
      if (p.discountPrice !== undefined) {
        expect(p.discountPrice).toBeGreaterThan(0);
        expect(p.discountPrice).toBeLessThan(p.price);
      }
    }
  });

  it('contains zero fabricated certifications, medical claims, or em-dashes', () => {
    const bannedPattern = /(bpom|menyembuhkan|mengobati|100%\s*original|resmi\s*distributor|\u2014)/i;
    for (const p of SEED_PRODUCTS) {
      const combined = `${p.name} ${p.description} ${p.howToUse}`;
      expect(combined).not.toMatch(bannedPattern);
    }
  });
});

