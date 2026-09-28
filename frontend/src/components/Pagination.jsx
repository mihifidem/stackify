export default function Pagination({ page, totalPages, onPageChange, hasPrevious, hasNext }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button type="button" disabled={!hasPrevious} onClick={() => onPageChange(page - 1)}>
        Anterior
      </button>
      <span className="page-indicator">Página {page}</span>
      <button type="button" disabled={!hasNext} onClick={() => onPageChange(page + 1)}>
        Siguiente
      </button>
    </div>
  );
}
