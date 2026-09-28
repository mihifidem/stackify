import { Link } from 'react-router-dom';

export default function RepositoryCard({ repository, onDelete }) {
    
  return (
    <article className="card">
      <div className="card-header">
        <span className="badge badge-neutral">{repository.visibility}</span>
      </div>

      <h3>{repository.name}</h3>
      <p>{repository.description || 'Sin descripción disponible.'}</p>

      <div className="meta-row">
        <span>Propietario: {repository.owner_username}</span>
      </div>

      <div className="actions-row actions-grid">
        <Link className="btn btn-primary" to={`/repositories/${repository.id}`}>
          Ver detalle
        </Link>
        <Link className="btn btn-secondary" to={`/repositories/${repository.id}/edit`}>
          Editar
        </Link>
        <button type="button" className="btn btn-danger" onClick={() => onDelete(repository.id)}>
          Eliminar
        </button>
      </div>
    </article>
  );
}
