import { useEffect, useMemo, useRef, useState } from "react";
import data from "./pokemon.json";

// Helpers
const pad3 = (n) => String(n).padStart(3, "0");
const artUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
const spriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

// Kleine Grid-Karte (KEINE Hover-Animation hier!)
function PokeCard({ id, name, onSelect }) {
  const [src, setSrc] = useState(artUrl(id));
  return (
    <button
      onClick={() => onSelect(id)}
      className="bg-white rounded-2xl shadow p-4 flex flex-col items-center gap-3 w-full"
    >
      <div className="w-24 h-24 flex items-center justify-center">
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
        <div className="text-sm font-semibold">{name}</div>
      </div>
    </button>
  );
}

// GROSSE Einzelansicht links (MIT Hover/Parallax), nur hier!
function FeaturedCard({ id, name }) {
  const [src, setSrc] = useState(artUrl(id));
  const ref = useRef(null);
  const [style, setStyle] = useState({ transform: "perspective(900px)" });

  // Parallax/tilt nur auf dieser Karte
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;  // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1
    const rotY = (px - 0.5) * 14; // +/- Grad
    const rotX = (0.5 - py) * 14;
    setStyle({
      transform: `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`,
    });
  };
  const onLeave = () => {
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-4 select-none transition-transform"
      style={style}
    >
      <div className="w-56 h-56 flex items-center justify-center">
        <img
          src={src}
          alt={name}
          className="max-w-full max-h-full"
          onError={() => setSrc(spriteUrl(id))}
        />
      </div>
      <div className="text-center">
        <div className="text-sm font-mono text-gray-500">#{pad3(id)}</div>
        <div className="text-2xl font-bold">{name}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0); // für Auto-Rotation, wenn nichts gewählt

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? data.filter((p) => p.name.toLowerCase().includes(q)) : data;
  }, [search]);

  // Wenn Suche aktiv ist und die ausgewählte Karte rausfällt → Auswahl zurücksetzen
  useEffect(() => {
    if (selectedId && !filtered.some((p) => p.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  // Auto-Rotation nur wenn NICHTS ausgewählt ist
  useEffect(() => {
    if (selectedId || filtered.length === 0) return;
    const t = setInterval(() => {
      setPreviewIndex((i) => (i + 1) % filtered.length);
    }, 3500);
    return () => clearInterval(t);
  }, [selectedId, filtered.length]);

  // ESC hebt Auswahl auf
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelectedId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const featured =
    selectedId
      ? data.find((p) => p.id === selectedId)
      : filtered[previewIndex] || null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-6">Pokédex (Deutsch)</h1>

      {/* Suche */}
      <div className="flex justify-center mb-6">
        <input
          type="search"
          placeholder="Pokémon suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg p-3 border rounded-xl text-neutral-900 placeholder:text-neutral-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Layout: links Featured, rechts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          {featured ? (
            <FeaturedCard id={featured.id} name={featured.name} />
          ) : (
            <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
              Kein Treffer.
            </div>
          )}
          {/* Hinweis/Controls */}
          <div className="mt-3 text-xs text-gray-500 text-center">
            {selectedId ? "ESC zum Abwählen" : "Auto-Vorschau läuft …"}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div
            className="grid gap-4
                       grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5"
          >
            {filtered.map((p) => (
              <PokeCard
                key={p.id}
                id={p.id}
                name={p.name}
                onSelect={setSelectedId}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 mt-8">Kein Treffer.</p>
          )}
        </div>
      </div>
    </div>
  );
}

