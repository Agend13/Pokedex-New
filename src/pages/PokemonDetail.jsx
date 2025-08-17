import { useParams } from "react-router-dom";
import pokemonList from "../data/pokemon.json"; // dein JSON mit allen Pokémon

function PokemonDetail() {
  const { id } = useParams();
  const pokemon = pokemonList.find((p) => p.id === parseInt(id));

  if (!pokemon) return <div>Pokémon nicht gefunden 😢</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{pokemon.name.de} (#{pokemon.id})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pokemon.cards.map((card, index) => (
          <div key={index} className="hover:scale-105 transition">
            <img
              src={card.imageUrl}
              alt={card.name}
              className="rounded shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonDetail;
