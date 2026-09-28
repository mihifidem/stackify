import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { createProject, getProjectById, updateProject } from '../services/projectService';

const defaultValues = {
  repository: 1,
  title: '',
  slug: '',
  project_type: 'book',
  description: '',
};

export default function ProjectFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const queryClient = useQueryClient();

  const [form, setForm] = useState(defaultValues);

  const { data } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (data) {
      setForm({
        repository: data.repository,
        title: data.title,
        slug: data.slug,
        project_type: data.project_type,
        description: data.description || '',
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (isEditing) {
        return updateProject(id, payload);
      }
      return createProject(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/projects');
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
          <h1>{isEditing ? 'Editar proyecto' : 'Nuevo proyecto'}</h1>
        </div>
      </section>

      <form className="form-card card" onSubmit={handleSubmit}>
        <div className="field-grid">
          <label>
            Título
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            Slug
            <input name="slug" value={form.slug} onChange={handleChange} required />
          </label>

          <label>
            Repositorio ID
            <input name="repository" type="number" value={form.repository} onChange={handleChange} required />
          </label>

          <label>
            Tipo
            <select name="project_type" value={form.project_type} onChange={handleChange}>
              <option value="libro">Libro</option>
              <option value="revista">Revista</option>
              <option value="comic">Comic</option>
              <option value="course">Course</option>
              <option value="other">Other</option>
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
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/projects')}>
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
}
