export default function EmptyState({ message = 'No hay resultados disponibles.' }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  );
}
