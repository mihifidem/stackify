export default function FilterBar({ filters, onChange, options = {} }) {
  return (
    <div className="toolbar">
      {options.visibility && (
        <div className="input-group">
          <select
            value={filters.visibility || ''}
            onChange={(event) => onChange('visibility', event.target.value)}
          >
            <option value="">Todas las visibilidades</option>
            <option value="public">Público</option>
            <option value="private">Privado</option>
          </select>
        </div>
      )}

      {options.project && (
        <div className="input-group">
          <select
            value={filters.project || ''}
            onChange={(event) => onChange('project', event.target.value)}
          >
            <option value="">Todos los proyectos</option>
            {options.project.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title || item.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {options.resourceType && (
        <div className="input-group">
          <select
            value={filters.resource_type || ''}
            onChange={(event) => onChange('resource_type', event.target.value)}
          >
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
      )}
    </div>
  );
}
