import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SearchInput from '../components/SearchInput';
import SortSelect from '../components/SortSelect';
import FilterBar from '../components/FilterBar';
import RepositoryCard from '../components/RepositoryCard';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { deleteRepository, getRepositories } from '../services/repositoryService';
import useDebounce from '../hooks/useDebounce';

const sortOptions = [
  { value: '-updated_at', label: 'Más recientes' },
  { value: 'name', label: 'Nombre A-Z' },
  { value: '-name', label: 'Nombre Z-A' },
  { value: 'created_at', label: 'Fecha creación asc' },
  { value: '-created_at', label: 'Fecha creación desc' },
];

export default function RepositoriesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-updated_at');
  const [visibility, setVisibility] = useState('');

  const debouncedSearch = useDebounce(search, 350);

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteRepository(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
    },
  });

  const params = useMemo(
    () => ({
      page,
      page_size: 8,
      search: debouncedSearch,
      ordering,
      visibility,
    }),
    [page, debouncedSearch, ordering, visibility],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ['repositories', params],
    queryFn: () => getRepositories(params),
    keepPreviousData: true,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, ordering, visibility]);

  const totalPages = data ? Math.ceil(data.count / (params.page_size || 8)) : 1;

  const handleFilterChange = (field, value) => {
    if (field === 'visibility') setVisibility(value);
  };

  return (
    <Layout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Listado</p>
          <h1>Repositorios</h1>
        </div>

        <Link className="btn btn-primary" to="/repositories/new">
          + Nuevo repositorio
        </Link>
      </section>

      <div className="toolbar-wrapper">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre, usuario o descripción"
        />

        <SortSelect value={ordering} onChange={setOrdering} options={sortOptions} />

        <FilterBar
          filters={{ visibility }}
          onChange={handleFilterChange}
          options={{ visibility: true }}
        />
      </div>

      {isLoading && <p>Cargando repositorios...</p>}
      {isError && <p>Error al cargar los repositorios.</p>}

      {!isLoading && !isError && data && (
        <>
          <div className="results-summary">
            <span>{data.count} resultados</span>
          </div>

          {data.results.length === 0 ? (
            <EmptyState message="No se encontraron repositorios con esos filtros." />
          ) : (
            <div className="card-grid">
              {data.results.map((repository) => (
                <RepositoryCard
                  key={repository.id}
                  repository={repository}
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
