import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SearchInput from '../components/SearchInput';
import SortSelect from '../components/SortSelect';
import ResourceCard from '../components/ResourceCard';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { deleteResource, getResources } from '../services/resourceService';
import useDebounce from '../hooks/useDebounce';

const sortOptions = [
  { value: '-updated_at', label: 'Más recientes' },
  { value: 'name', label: 'Nombre A-Z' },
  { value: '-name', label: 'Nombre Z-A' },
  { value: 'created_at', label: 'Fecha creación asc' },
  { value: '-created_at', label: 'Fecha creación desc' },
];

export default function ResourcesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-updated_at');
  const [resourceType, setResourceType] = useState('');

  const debouncedSearch = useDebounce(search, 350);

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });

  const params = useMemo(
    () => ({
      page,
      page_size: 8,
      search: debouncedSearch,
      ordering,
      resource_type: resourceType,
    }),
    [page, debouncedSearch, ordering, resourceType],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ['resources', params],
    queryFn: () => getResources(params),
    keepPreviousData: true,
  });

  const totalPages = data ? Math.ceil(data.count / (params.page_size || 8)) : 1;

  return (
    <Layout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Listado</p>
          <h1>Recursos</h1>
        </div>

        <Link className="btn btn-primary" to="/resources/new">
          + Nuevo recurso
        </Link>
      </section>

      <div className="toolbar-wrapper">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o descripción"
        />

        <SortSelect value={ordering} onChange={setOrdering} options={sortOptions} />

        <div className="input-group">
          <select value={resourceType} onChange={(event) => setResourceType(event.target.value)}>
            <option value="">Todos los tipos</option>
            <option value="document">Documento</option>
            <option value="image">Imagen</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
            <option value="font">Fuente</option>
            <option value="archive">Archivo comprimido</option>
            <option value="data">Datos</option>
            <option value="other">Otro</option>
          </select>
        </div>
      </div>

      {isLoading && <p>Cargando recursos...</p>}
      {isError && <p>Error al cargar los recursos.</p>}

      {!isLoading && !isError && data && (
        <>
          <div className="results-summary">
            <span>{data.count} resultados</span>
          </div>

          {data.results.length === 0 ? (
            <EmptyState message="No se encontraron recursos con esos filtros." />
          ) : (
            <div className="card-grid">
              {data.results.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            hasPrevious={page > 1}
            hasNext={page < totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </Layout>
  );
}
