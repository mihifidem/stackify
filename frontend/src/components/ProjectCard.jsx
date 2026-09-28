export default function ProjectCard({ project, onDelete }) {
  return (
    <article className="card">
      <div className="card-header">
        <span className="badge badge-accent">{project.project_type}</span>
      </div>

      <h3>{project.title}</h3>
      <p>{project.description || 'Sin descripción disponible.'}</p>

      <div className="meta-row">
        <span>Slug: {project.slug}</span>
      </div>

      <div className="actions-row actions-grid">
        <a className="btn btn-secondary" href="#" onClick={(event) => event.preventDefault()}>
          Ver detalle
        </a>
        <a className="btn btn-secondary" href="#" onClick={(event) => event.preventDefault()}>
          Editar
        </a>
        <button type="button" className="btn btn-danger" onClick={() => onDelete(project.id)}>
          Eliminar
        </button>
      </div>
    </article>
  );
}
