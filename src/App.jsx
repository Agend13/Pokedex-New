import { useState, useEffect } from "react";
import pokemonData from "./pokemon.json";

export default function App() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(pokemonData);

  useEffect(() => {
    setFiltered(
      pokemonData.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">Pokédex (Deutsch)</h1>
      
      <input
        type="search"
        placeholder="Pokémon suchen..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-80 p-2 border rounded-lg text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <ul className="mt-6 space-y-2">
        {filtered.map((p) => (
          <li key={p.id} className="bg-white px-4 py-2 rounded shadow">
            #{p.id} – {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
