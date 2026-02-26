export default function Pagination({ page, totalPages, onPrev, onNext, onGoTo }) {
  // Build page numbers to show (max 5 visible around current)
  const getPages = () => {
    const pages = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('…');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('…');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav className="pagination" role="navigation" aria-label="Task list pagination">
      {/* Previous */}
      <button
        id="prev-page-btn"
        className="pagination-btn"
        onClick={onPrev}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ‹ Previous
      </button>

      {/* Numbered pages */}
      {getPages().map((p, idx) =>
        p === '…' ? (
          <span key={`dots-${idx}`} className="pagination-dots">…</span>
        ) : (
          <button
            key={p}
            className={`pagination-page${p === page ? ' active' : ''}`}
            onClick={() => onGoTo?.(p)}
            aria-label={`Go to page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        id="next-page-btn"
        className="pagination-btn"
        onClick={onNext}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next ›
      </button>
    </nav>
  );
}
