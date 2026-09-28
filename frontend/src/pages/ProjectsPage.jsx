import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SearchInput from '../components/SearchInput';
import SortSelect from '../components/SortSelect';
import ProjectCard from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { deleteProject, getProjects } from '../services/projectService';
import useDebounce from '../hooks/useDebounce';

const sortOptions = [
  { value: '-updated_at', label: 'Más recientes' },
  { value: 'title', label: 'Título A-Z' },
  { value: '-title', label: 'Título Z-A' },
  { value: 'created_at', label: 'Fecha creación asc' },
  { value: '-created_at', label: 'Fecha creación desc' },
];

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-updated_at');
  const [projectType, setProjectType] = useState('');

  const debouncedSearch = useDebounce(search, 350);

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const params = useMemo(
    () => ({
      page,
      page_size: 8,
      search: debouncedSearch,
      ordering,
      project_type: projectType,
    }),
    [page, debouncedSearch, ordering, projectType],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ['projects', params],
    queryFn: () => getProjects(params),
    keepPreviousData: true,
  });

  const totalPages = data ? Math.ceil(data.count / (params.page_size || 8)) : 1;

  return (
    <Layout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Listado</p>
          <h1>Proyectos</h1>
        </div>

        <Link className="btn btn-primary" to="/projects/new">
          + Nuevo proyecto
        </Link>
      </section>

      <div className="toolbar-wrapper">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por título o descripción"
        />

        <SortSelect value={ordering} onChange={setOrdering} options={sortOptions} />

        <div className="input-group">
          <select value={projectType} onChange={(event) => setProjectType(event.target.value)}>
            <option value="">Todos los tipos</option>
            <option value="libro">Libro</option>
            <option value="revista">Revista</option>
            <option value="comic">Comic</option>
            <option value="course">Course</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {isLoading && <p>Cargando proyectos...</p>}
      {isError && <p>Error al cargar los proyectos.</p>}

      {!isLoading && !isError && data && (
        <>
          <div className="results-summary">
            <span>{data.count} resultados</span>
          </div>

          {data.results.length === 0 ? (
            <EmptyState message="No se encontraron proyectos con esos filtros." />
          ) : (
            <div className="card-grid">
              {data.results.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              ))}
            </div>
          )}

          <Pagination
            page={1}
            totalPages={totalPages}
            hasPrevious={false}
            hasNext={page < totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </Layout>
  );
}
