import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getRepositoryById } from '../services/repositoryService';
import { getProjects } from '../services/projectService';
import { formatDate } from '../utils/formatters';

export default function RepositoryDetailPage() {
  const { id } = useParams();

  const repositoryQuery = useQuery({
    queryKey: ['repository', id],
    queryFn: () => getRepositoryById(id),
    enabled: !!id,
  });

  const projectsQuery = useQuery({
    queryKey: ['projects', { repository: id }],
    queryFn: () => getProjects({ repository: id }),
    enabled: !!id,
  });

  if (repositoryQuery.isLoading) return <Layout><p>Cargando repositorio...</p></Layout>;
  if (repositoryQuery.isError) return <Layout><p>Error al cargar el repositorio.</p></Layout>;

  const repository = repositoryQuery.data;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <p className="eyebrow">Detalle</p>
          <h1>{repository.name}</h1>
        </div>
        <Link className="btn btn-secondary" to="/repositories">
          Volver
        </Link>
      </div>

      <section className="detail-panel card">
        <div className="detail-grid">
          <div>
            <p><strong>Propietario:</strong> {repository.owner_username}</p>
            <p><strong>Visibilidad:</strong> {repository.visibility}</p>
            <p><strong>Slug:</strong> {repository.slug}</p>
          </div>
          <div>
            <p><strong>Creado:</strong> {formatDate(repository.created_at)}</p>
            <p><strong>Actualizado:</strong> {formatDate(repository.updated_at)}</p>
          </div>
        </div>

        <p>{repository.description || 'Este repositorio no tiene descripción.'}</p>
      </section>

      <section className="section-block">
        <h2>Proyectos asociados</h2>
        {projectsQuery.isLoading && <p>Cargando proyectos...</p>}
        {projectsQuery.isError && <p>Error al cargar proyectos.</p>}

        {!projectsQuery.isLoading && projectsQuery.data && (
          <div className="card-grid">
            {projectsQuery.data.results?.length ? (
              projectsQuery.data.results.map((project) => (
                <article key={project.id} className="card">
                  <h3>{project.title}</h3>
                  <p>{project.description || 'Sin descripción.'}</p>
                  <span className="badge badge-neutral">{project.project_type}</span>
                </article>
              ))
            ) : (
              <p>No hay proyectos asociados.</p>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
}
