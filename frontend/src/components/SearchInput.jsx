export default function SearchInput({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div className="input-group">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Buscar"
      />
    </div>
  );
}
