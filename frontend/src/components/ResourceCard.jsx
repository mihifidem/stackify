export default function ResourceCard({ resource, onDelete }) {
  return (
    <article className="card">
      <div className="card-header">
        <span className="badge badge-success">{resource.resource_type}</span>
      </div>

      <h3>{resource.name}</h3>
      <p>{resource.description || 'Sin descripción disponible.'}</p>

      <div className="meta-row">
        <span>Slug: {resource.slug}</span>
      </div>

      <div className="actions-row actions-grid">
        <a className="btn btn-secondary" href="#" onClick={(event) => event.preventDefault()}>
          Ver detalle
        </a>
        <a className="btn btn-secondary" href="#" onClick={(event) => event.preventDefault()}>
          Editar
        </a>
        <button type="button" className="btn btn-danger" onClick={() => onDelete(resource.id)}>
          Eliminar
        </button>
      </div>
    </article>
  );
}
