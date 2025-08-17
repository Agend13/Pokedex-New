import { Link } from "react-router-dom";


import pokemonList from "../data/pokemon.json"; // das ist deine Pokémon-Daten-Datei





function Home() {


  return (


    <div className="p-4">


      <h1 className="text-3xl font-bold mb-6">Pokédex</h1>





      {/* Gitter mit allen Pokémon */}


      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">


        {pokemonList.map((pokemon) => (


          <Link to={`/pokemon/${pokemon.id}`} key={pokemon.id}>


            <div className="cursor-pointer bg-white p-2 rounded shadow hover:shadow-lg transition text-center">


              <img


                src={pokemon.imageUrl}


                alt={pokemon.name.de}


                className="mx-auto h-24 object-contain"


              />


              <p className="mt-2 font-medium">#{pokemon.id} {pokemon.name.de}</p>


            </div>


          </Link>


        ))}


      </div>


    </div>


  );


}





export default Home;
