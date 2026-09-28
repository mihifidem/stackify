import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function HomePage() {
  return (
    <Layout>
      <section className="hero">
        <div>
          <p className="eyebrow">Sistema de gestión</p>
          <h1>Stackify</h1>
          <p className="hero-copy">
            Centraliza repositorios, proyectos, recursos y versiones de archivos en una
            experiencia moderna y organizada.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/repositories">
              Ver repositorios
            </Link>
            <Link className="btn btn-secondary" to="/projects">
              Ver proyectos
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
