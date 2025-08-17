import { useMemo, useState } from "react";
import data from "./pokemon.json";

// Hilfsfunktionen
const pad3 = (n) => String(n).padStart(3, "0");
// Offizielle Artwork-URL (groß & hübsch)
const artUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
// Fallback (klassischer kleiner Sprite)
const spriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

function PokeCard({ id, name }) {
  // Versuche zuerst das große Artwork, falle zurück auf kleinen Sprite
  const [src, setSrc] = useState(artUrl(id));
  return (
    <div
      className="group bg-white rounded-2xl shadow p-4 flex flex-col items-center gap-3
                 transition-transform"
    >
      <div className="w-28 h-28 flex items-center justify-center">
        <img
          src={src}
          alt={name}
          loading="lazy"
          className="max-w-full max-h-full"
          onError={() => setSrc(spriteUrl(id))}
        />
      </div>
      <div className="text-center">
        <div className="text-xs font-mono text-gray-500">#{pad3(id)}</div>
        <div className="text-base font-semibold">{name}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((p) => p.name.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-6">Pokédex (Deutsch)</h1>

      <div className="flex justify-center mb-6">
        <input
          type="search"
          placeholder="Pokémon suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-3 border rounded-xl text-neutral-900 placeholder:text-neutral-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div
        className="grid gap-4
                   grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {filtered.map((p) => (
          <PokeCard key={p.id} id={p.id} name={p.name} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-8">Kein Treffer.</p>
      )}
    </div>
  );
}
