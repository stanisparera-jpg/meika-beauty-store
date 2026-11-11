interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Navigasi halaman katalog"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="meika-btn min-h-[44px] px-4 rounded-[var(--r-md)] border border-[var(--border-strong)] bg-white disabled:opacity-45 text-sm text-[#292626] cursor-pointer"
      >
        Sebelumnya
      </button>

      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`meika-btn min-w-[44px] min-h-[44px] px-3 rounded-[var(--r-md)] text-sm font-medium tabular-nums cursor-pointer ${
            p === page
              ? 'bg-[#7A3D49] text-white'
              : 'bg-white border border-[var(--border-hairline)] text-[#292626] hover:bg-[#F6E8E9]'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="meika-btn min-h-[44px] px-4 rounded-[var(--r-md)] border border-[var(--border-strong)] bg-white disabled:opacity-45 text-sm text-[#292626] cursor-pointer"
      >
        Berikutnya
      </button>
    </nav>
  );
}

