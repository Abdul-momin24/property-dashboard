function SearchBar({
  search,
  setSearch,
}) {
  return (
    <input
      type="text"
      placeholder="Search owner or property..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl outline-none text-white w-full md:w-[350px]"
    />
  );
}

export default SearchBar;