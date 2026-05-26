function TenantFilter({
  selectedCity,
  setSelectedCity,
  cities,
}) {
  return (
    <select
      value={selectedCity}
      onChange={(e) =>
        setSelectedCity(e.target.value)
      }
      className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl outline-none text-white w-[220px]"
    >
      {cities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
}

export default TenantFilter;