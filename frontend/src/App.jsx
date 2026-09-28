import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RepositoriesPage from './pages/RepositoriesPage';
import RepositoryDetailPage from './pages/RepositoryDetailPage';
import RepositoryFormPage from './pages/RepositoryFormPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectFormPage from './pages/ProjectFormPage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceFormPage from './pages/ResourceFormPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/repositories" element={<RepositoriesPage />} />
        <Route path="/repositories/new" element={<RepositoryFormPage />} />
        <Route path="/repositories/:id/edit" element={<RepositoryFormPage />} />
        <Route path="/repositories/:id" element={<RepositoryDetailPage />} />

        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<ProjectFormPage />} />
        <Route path="/projects/:id/edit" element={<ProjectFormPage />} />

        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/new" element={<ResourceFormPage />} />
        <Route path="/resources/:id/edit" element={<ResourceFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}
