# Frontend ReactJS para Stackify — guía de arquitectura y desarrollo

Este documento define la ruta para crear desde cero un frontend moderno en ReactJS para una aplicación con backend en Django REST Framework. Está orientado a un stack técnico real, con una estructura escalable, consumo de API, experiencia de usuario y soporte para listados con paginación, filtros, búsqueda y ordenación.

## 1. Objetivo del frontend

El frontend debe actuar como capa de presentación para gestionar la información del sistema, incluyendo:

- Repositorios
- Proyectos
- Recursos
- Versiones de recursos
- Relaciones entre entidades
- Acciones CRUD básicas
- Dashboard y panel de administración

La arquitectura propuesta separa claramente:

- API layer
- servicios
- páginas
- componentes reutilizables
- almacenamiento de estado
- rutas y navegación

---

## 2. Stack recomendado

### Tecnologías base

- React 18+
- Vite
- React Router DOM
- Axios
- TanStack Query (opcional pero recomendado)
- CSS moderno o Tailwind CSS

### ¿Por qué esta stack?

- Vite acelera el desarrollo y mejora el rendimiento
- React Router maneja la navegación SPA
- Axios centraliza llamadas a la API
- TanStack Query simplifica caching, estado async y sincronización
- Tailwind o CSS modular mejora la estética tech y la mantenibilidad

---

## 3. Requisitos previos

Necesitas tener instalado lo siguiente:

- Node.js 18 o superior
- npm o yarn
- Git
- Django corriendo en el backend
- Puerto local del backend disponible, por ejemplo: http://localhost:8000

Verificación:

```bash
node -v
npm -v
python --version
```

---

## 4. Crear el proyecto frontend

Desde la raíz del proyecto:

```bash
mkdir frontend
cd frontend
npm create vite@latest . -- --template react
```

Luego, instala las dependencias base:

```bash
npm install
npm install react-router-dom axios @tanstack/react-query
```

Si decides usar Tailwind:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

---

## 5. Estructura recomendada del proyecto

Una estructura limpia y profesional sería:

```text
frontend/
  src/
    api/
      api.js
    components/
      Navbar.jsx
      Sidebar.jsx
      RepositoryCard.jsx
      FilterBar.jsx
      Pagination.jsx
      SearchInput.jsx
      SortSelect.jsx
    pages/
      HomePage.jsx
      RepositoriesPage.jsx
      RepositoryDetailPage.jsx
      ProjectsPage.jsx
      ResourcesPage.jsx
      ResourceVersionsPage.jsx
    services/
      repositoryService.js
      projectService.js
      resourceService.js
    hooks/
      useRepositories.js
      useProjects.js
    routes/
      AppRoutes.jsx
    utils/
      formatters.js
      queryParams.js
    App.jsx
    main.jsx
    index.css
  .env
```

Esta estructura permite escalar sin mezclar responsabilidades.

---

## 6. Variables de entorno

Crear `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:8000/api
```

Esto evita hardcodear la URL del backend dentro de los componentes.

---

## 7. Configuración de Axios

Crear `src/api/api.js`:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export default api;
```

Este archivo debe ser el punto central para todas las requests del sistema.

---

## 8. Configuración de CORS en Django

Para que el frontend pueda consumir la API desde un puerto diferente, como `5173`, se requiere CORS en Django.

Instalar:

```bash
pip install django-cors-headers
```

Agregar en configuración:

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
]
```

También puedes usar una configuración más flexible si estás en entorno de desarrollo:

```python
CORS_ALLOW_ALL_ORIGINS = True
```

Solo recomendado para desarrollo.

---

## 9. Servicios de la API

Cada entidad debe tener un servicio especial para encapsular sus requests.

### `src/services/repositoryService.js`

```js
import api from '../api/api';

export const getRepositories = async (params = {}) => {
  const response = await api.get('/repositories/', { params });
  return response.data;
};

export const getRepositoryById = async (id) => {
  const response = await api.get(`/repositories/${id}/`);
  return response.data;
};

export const createRepository = async (payload) => {
  const response = await api.post('/repositories/', payload);
  return response.data;
};

export const updateRepository = async (id, payload) => {
  const response = await api.put(`/repositories/${id}/`, payload);
  return response.data;
};

export const deleteRepository = async (id) => {
  const response = await api.delete(`/repositories/${id}/`);
  return response.data;
};
```

### `src/services/projectService.js`

```js
import api from '../api/api';

export const getProjects = async (params = {}) => {
  const response = await api.get('/projects/', { params });
  return response.data;
};
```

### `src/services/resourceService.js`

```js
import api from '../api/api';

export const getResources = async (params = {}) => {
  const response = await api.get('/resources/', { params });
  return response.data;
};
```

---

## 10. Manejo de paginación, filtros, búsqueda y ordenación

El backend ya está preparado para soportar estos mecanismos con DRF y sus query params. La práctica recomendada es que el frontend construya la URL con parámetros dinámicos.

### Parámetros comunes

- `page`: número de página
- `page_size`: cantidad de elementos por página
- `search`: texto libre de búsqueda
- `ordering`: campo de ordenación
- `owner`: filtro por propietario
- `project`: filtro por proyecto
- `visibility`: filtro por visibilidad
- `resource_type`: filtro por tipo

Ejemplo:

```js
const params = {
  page: 2,
  page_size: 10,
  search: 'auth',
  ordering: '-updated_at',
  visibility: 'public',
};
```

Request final:

```js
api.get('/repositories/', { params });
```

### Ejemplo de respuesta paginada

```json
{
  "count": 120,
  "next": "http://localhost:8000/api/repositories/?page=2",
  "previous": null,
  "results": [
    { "id": 1, "name": "stackify" },
    { "id": 2, "name": "analytics" }
  ]
}
```

Esto permite implementar controles de paginación en la UI sin complejidad extra.

---

## 11. Patrón recomendado para listados

### 11.1 Filtros

Usa un componente `FilterBar` con controles como:

- select por visibilidad
- select por tipo
- input de fecha o texto
- chips de categorías

Ejemplo:

```jsx
const [filters, setFilters] = useState({
  visibility: '',
  project: '',
  resource_type: '',
});
```

### 11.2 Búsqueda

Se recomienda un campo de búsqueda global con debounce:

```jsx
const [search, setSearch] = useState('');

useEffect(() => {
  const timeout = setTimeout(() => {
    setParams((prev) => ({ ...prev, search }));
  }, 300);

  return () => clearTimeout(timeout);
}, [search]);
```

### 11.3 Ordenación

Usa un selector con valores como:

- `name`
- `-name`
- `created_at`
- `-created_at`
- `updated_at`
- `-updated_at`

Ejemplo:

```jsx
<select
  value={ordering}
  onChange={(e) => setOrdering(e.target.value)}
>
  <option value="-updated_at">Más recientes</option>
  <option value="name">Nombre A-Z</option>
  <option value="-name">Nombre Z-A</option>
</select>
```

### 11.4 Paginación

Crear un componente reutilizable `Pagination` que maneje:

- botón anterior
- número de páginas
- botón siguiente
- estado activo de la página

Ejemplo:

```jsx
const totalPages = Math.ceil(total / pageSize);

<button disabled={page === 1} onClick={() => setPage(page - 1)}>
  Anterior
</button>

<button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
  Siguiente
</button>
```

---

## 12. Implementación real con React Query

Recomendado para estado async y caché.

### Instalación

```bash
npm install @tanstack/react-query
```

### Configuración en main.jsx

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

### Ejemplo de uso

```jsx
import { useQuery } from '@tanstack/react-query';
import { getRepositories } from '../services/repositoryService';

export default function RepositoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-updated_at');

  const { data, isLoading, error } = useQuery({
    queryKey: ['repositories', { page, search, ordering }],
    queryFn: () =>
      getRepositories({
        page,
        page_size: 10,
        search,
        ordering,
      }),
  });

  if (isLoading) return <p>Cargando repositorios...</p>;
  if (error) return <p>Error cargando datos.</p>;

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar repositorio"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={ordering} onChange={(e) => setOrdering(e.target.value)}>
        <option value="-updated_at">Más recientes</option>
        <option value="name">Nombre A-Z</option>
        <option value="-name">Nombre Z-A</option>
      </select>

      {data.results.map((repo) => (
        <div key={repo.id}>{repo.name}</div>
      ))}

      <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
        Anterior
      </button>
      <button onClick={() => setPage((p) => p + 1)} disabled={!data.next}>
        Siguiente
      </button>
    </div>
  );
}
```

---

## 13. Ejemplo de listado completo para repositorios

```jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRepositories } from '../services/repositoryService';

export default function RepositoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-updated_at');
  const [visibility, setVisibility] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['repositories', { page, search, ordering, visibility }],
    queryFn: () =>
      getRepositories({
        page,
        page_size: 8,
        search,
        ordering,
        visibility,
      }),
  });

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>No se pudieron cargar los repositorios.</p>;

  return (
    <section>
      <header>
        <h1>Repositorios</h1>
      </header>

      <div className="toolbar">
        <input
          type="text"
          value={search}
          placeholder="Buscar repositorios"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="">Todos</option>
          <option value="public">Públicos</option>
          <option value="private">Privados</option>
        </select>

        <select value={ordering} onChange={(e) => setOrdering(e.target.value)}>
          <option value="-updated_at">Más recientes</option>
          <option value="name">Nombre A-Z</option>
          <option value="-name">Nombre Z-A</option>
        </select>
      </div>

      <div className="grid">
        {data.results.map((repo) => (
          <article key={repo.id} className="card">
            <h2>{repo.name}</h2>
            <p>{repo.description || 'Sin descripción'}</p>
            <small>{repo.visibility}</small>
          </article>
        ))}
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Anterior
        </button>
        <span>Página {page}</span>
        <button disabled={!data.next} onClick={() => setPage((p) => p + 1)}>
          Siguiente
        </button>
      </div>
    </section>
  );
}
```

---

## 14. Estilo visual tech

Para darle un estilo más moderno y técnico, usa un sistema visual basado en:

- fondo oscuro o neutrales profundos
- paneles con bordes suaves
- colores de marca muy contrastados
- tarjetas con hover profesional
- tipografía fuerte para títulos y métricas
- UI con spacing consistente

Ejemplo de CSS base:

```css
:root {
  --bg: #0b1020;
  --panel: #121a2b;
  --panel-alt: #1a2438;
  --primary: #5eead4;
  --text: #e2e8f0;
  --muted: #94a3b8;
  --border: rgba(148, 163, 184, 0.15);
}

body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
}

.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.2);
}

.toolbar {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

input, select, button {
  border-radius: 10px;
  border: 1px solid var(--border);
  padding: 0.75rem 1rem;
  background: var(--panel-alt);
  color: var(--text);
}

button {
  cursor: pointer;
  background: var(--primary);
  color: #062b2a;
  font-weight: 700;
}
```

---

## 15. Rutas recomendadas

Usa React Router para definir las pantallas principales:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RepositoriesPage from './pages/RepositoriesPage';
import RepositoryDetailPage from './pages/RepositoryDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ResourcesPage from './pages/ResourcesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/repositories" element={<RepositoriesPage />} />
        <Route path="/repositories/:id" element={<RepositoryDetailPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 16. Recomendaciones de UX para listados

Para que los listados sean productivos y profesionales:

- mostrar contador de resultados
- incluir búsqueda instantánea
- ofrecer filtros rápidos por tipo y estado
- ordenar por fecha o nombre
- usar paginación clara
- mostrar mensajes de vacío cuando no haya registros
- incluir loading skeletons para mejor UX

Ejemplo de estado vacío:

```jsx
{data.results.length === 0 && <p>No se encontraron resultados.</p>}
```

---

## 17. Flujo recomendado para Stackify

La experiencia ideal para este proyecto sería:

1. Dashboard principal
2. Listado de repositorios con filtros y búsqueda
3. Detalle del repositorio
4. Listado de proyectos por repositorio
5. Listado de recursos por proyecto
6. Historial de versiones de recurso
7. Formularios CRUD para crear y editar datos
8. Panel administrativo con métricas

---

## 18. Comandos clave

```bash
# Crear proyecto
npm create vite@latest frontend -- --template react

# Instalar dependencias
npm install react-router-dom axios @tanstack/react-query

# Ejecutar proyecto
npm run dev

# Construir versión de producción
npm run build
```

---

## 19. Recomendación final

Para este proyecto, la combinación más sólida es:

- React + Vite para frontend
- React Router para navegación
- Axios para API
- TanStack Query para listados con paginación y cache
- CSS moderno o Tailwind para un estilo tech
- DRF query params para filtros, búsqueda y ordenación

Esto genera una solución fácil de mantener, rápida y muy adecuada para una app tipo Stackify.

---

## 20. Siguiente fase sugerida

Si quieres, el siguiente paso puede ser:

- crear el frontend real en la carpeta `frontend/`
- generar la estructura completa de componentes
- desarrollar la pantalla de repositorios con paginación, búsqueda y filtros
- conectar la UI directamente con los endpoints del backend Django
- dejar un demo visual listo para usar
