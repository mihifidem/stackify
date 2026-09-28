import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { createResource, getResourceById, updateResource } from '../services/resourceService';

const defaultValues = {
  project: 1,
  name: '',
  slug: '',
  resource_type: 'document',
  description: '',
};

export default function ResourceFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const queryClient = useQueryClient();

  const [form, setForm] = useState(defaultValues);

  const { data } = useQuery({
    queryKey: ['resource', id],
    queryFn: () => getResourceById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (data) {
      setForm({
        project: data.project,
        name: data.name,
        slug: data.slug,
        resource_type: data.resource_type,
        description: data.description || '',
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (isEditing) {
        return updateResource(id, payload);
      }
      return createResource(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      navigate('/resources');
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
          <h1>{isEditing ? 'Editar recurso' : 'Nuevo recurso'}</h1>
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
            Proyecto ID
            <input name="project" type="number" value={form.project} onChange={handleChange} required />
          </label>

          <label>
            Tipo
            <select name="resource_type" value={form.resource_type} onChange={handleChange}>
              <option value="document">Documento</option>
              <option value="image">Imagen</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
              <option value="font">Fuente</option>
              <option value="archive">Archivo comprimido</option>
              <option value="data">Datos</option>
              <option value="other">Otro</option>
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
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/resources')}>
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
}
