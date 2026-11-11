import type { ProductVariant } from '../types/product';

interface ShadeSwatchesProps {
  hasShades: boolean;
  variants: ProductVariant[];
  selectedVariantId?: string;
  onSelect?: (variantId: string) => void;
  compact?: boolean;
}

export function ShadeSwatches({
  hasShades,
  variants,
  selectedVariantId,
  onSelect,
  compact = false,
}: ShadeSwatchesProps) {
  if (!hasShades) {
    return (
      <p className="m-0 text-[13px] text-[#5E5857]">
        {variants.length > 1 ? `${variants.length} ukuran tersedia` : variants[0]?.label} (Non-Shade)
      </p>
    );
  }

  const maxVisible = compact ? 4 : variants.length;
  const visible = variants.slice(0, maxVisible);
  const overflowCount = variants.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Pilihan shade">
      {visible.map((variant) => {
        const isActive = variant.id === selectedVariantId;
        const swatchColor = variant.colorHex ?? '#E8A5AD';
        if (!onSelect) {
          return (
            <span
              key={variant.id}
              title={variant.label}
              className="w-4 h-4 rounded-full border border-[#292626]/20 inline-block shrink-0"
              style={{ backgroundColor: swatchColor }}
            />
          );
        }
        return (
          <button
            key={variant.id}
            type="button"
            title={variant.label}
            aria-label={`Pilih shade ${variant.label}`}
            aria-pressed={isActive}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(variant.id);
            }}
            className={`w-7 h-7 rounded-full inline-flex items-center justify-center cursor-pointer transition-transform ${
              isActive
                ? 'ring-2 ring-[#7A3D49] ring-offset-1 scale-105'
                : 'hover:scale-105 border border-[#292626]/20'
            }`}
          >
            <span
              className="w-5 h-5 rounded-full border border-black/10 block"
              style={{ backgroundColor: swatchColor }}
            />
          </button>
        );
      })}
      {overflowCount > 0 && (
        <span className="text-[13px] text-[#5E5857] tabular-nums">+{overflowCount}</span>
      )}
    </div>
  );
}

