import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import SearchInput from '../components/SearchInput';
import SortSelect from '../components/SortSelect';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { getResourceVersions } from '../services/resourceVersionService';
import useDebounce from '../hooks/useDebounce';

const sortOptions = [
  { value: '-created_at', label: 'Más recientes' },
  { value: 'version_number', label: 'Versión asc' },
  { value: '-version_number', label: 'Versión desc' },
];

export default function ResourceVersionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  const debouncedSearch = useDebounce(search, 350);

  const params = useMemo(
    () => ({
      page,
      page_size: 8,
      search: debouncedSearch,
      ordering,
    }),
    [page, debouncedSearch, ordering],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ['resource-versions', params],
    queryFn: () => getResourceVersions(params),
    keepPreviousData: true,
  });

  const totalPages = data ? Math.ceil(data.count / (params.page_size || 8)) : 1;

  return (
    <Layout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Listado</p>
          <h1>Versiones de recursos</h1>
        </div>
      </section>

      <div className="toolbar-wrapper">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre o nota" />
        <SortSelect value={ordering} onChange={setOrdering} options={sortOptions} />
      </div>

      {isLoading && <p>Cargando versiones...</p>}
      {isError && <p>Error al cargar las versiones.</p>}

      {!isLoading && !isError && data && (
        <>
          <div className="results-summary">
            <span>{data.count} resultados</span>
          </div>

          {data.results.length === 0 ? (
            <EmptyState message="No se encontraron versiones de recursos." />
          ) : (
            <div className="card-grid">
              {data.results.map((version) => (
                <article key={version.id} className="card">
                  <div className="card-header">
                    <span className="badge badge-warning">v{version.version_number}</span>
                  </div>
                  <h3>{version.original_filename || 'Archivo sin nombre'}</h3>
                  <p>{version.notes || 'Sin notas'}</p>
                </article>
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
