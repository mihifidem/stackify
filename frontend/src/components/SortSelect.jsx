export default function SortSelect({ value, onChange, options }) {
  return (
    <div className="input-group">
      <label htmlFor="sort-select" className="sr-only">Ordenar</label>
      <select id="sort-select" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
