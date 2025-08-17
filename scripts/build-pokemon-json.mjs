// scripts/build-pokemon-json.mjs
// Erzeugt src/pokemon.json mit allen deutschen Pokémon-Namen (1..1025) aus der PokeAPI.
// Voraussetzungen: Node 18+ (fetch ist eingebaut). Bei älteren Node-Versionen: `npm i node-fetch` und import anpassen.

import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const START_ID = 1;
const END_ID = 1025; // Terapagos (aktuell)
const OUT_PATH = `${__dirname}/../src/pokemon.json`;

// kleines Delay, um PokeAPI nicht zu überlasten
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Hole deutschen Namen aus pokemon-species
async function fetchGermanName(id) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch failed for id=${id}: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  // "names" enthält lokalisierte Namen mit language.name === "de"
  const de = data.names?.find((n) => n.language?.name === "de");
  if (!de || !de.name) {
    // Fallback: offizieller Default-Name (englisch), sollte selten vorkommen
    return data.name;
  }
  return de.name;
}

async function main() {
  const list = [];
  for (let id = START_ID; id <= END_ID; id++) {
    try {
      const name = await fetchGermanName(id);
      list.push({ id, name });
      // optional: Progress-Output
      if (id % 25 === 0 || id === END_ID) {
        console.log(`Fetched #${id}: ${name}`);
      }
      // kleines Delay, um Rate Limits sicher zu meiden
      await sleep(80);
    } catch (err) {
      console.error(`Fehler bei #${id}:`, err.message);
      // Zur Not trotzdem einen Platzhalter setzen – aber lieber abbrechen:
      // process.exit(1);
      list.push({ id, name: `Pokemon${id}` });
    }
  }

  // Ausgabe hübsch formatiert
  const json = JSON.stringify(list, null, 2);
  await mkdir(`${__dirname}/../src`, { recursive: true });
  await writeFile(OUT_PATH, json, "utf-8");
  console.log(`\n✅ Fertig! Geschrieben nach: ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
