import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import {
  createRepository,
  getRepositoryById,
  updateRepository,
} from '../services/repositoryService';

const defaultValues = {
  owner: Number(import.meta.env.VITE_DEFAULT_OWNER_ID || 1),
  name: '',
  description: '',
  visibility: 'public',
  slug: '',
};

export default function RepositoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const queryClient = useQueryClient();

  const [form, setForm] = useState(defaultValues);

  const { data } = useQuery({
    queryKey: ['repository', id],
    queryFn: () => getRepositoryById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (data) {
      setForm({
        owner: data.owner,
        name: data.name,
        description: data.description || '',
        visibility: data.visibility,
        slug: data.slug,
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (isEditing) {
        return updateRepository(id, payload);
      }
      return createRepository(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      navigate('/repositories');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(form);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Formulario</p>
          <h1>{isEditing ? 'Editar repositorio' : 'Nuevo repositorio'}</h1>
        </div>
      </section>

      <form className="form-card card" onSubmit={handleSubmit}>
        <div className="field-grid">
          <label>
            Nombre
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Slug
            <input name="slug" value={form.slug} onChange={handleChange} required />
          </label>

          <label>
            Propietario
            <input name="owner" type="number" value={form.owner} onChange={handleChange} required />
          </label>

          <label>
            Visibilidad
            <select name="visibility" value={form.visibility} onChange={handleChange}>
              <option value="public">Público</option>
              <option value="private">Privado</option>
            </select>
          </label>
        </div>

        <label>
          Descripción
          <textarea name="description" value={form.description} onChange={handleChange} rows="5" />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/repositories')}>
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
}
