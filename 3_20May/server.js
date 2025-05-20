const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/pokemons', async (req, res) => {
  const { type, count } = req.query;

  try {

    const typeRes = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
    const allPokemon = typeRes.data.pokemon.slice(0, count);

    const pokemonData = await Promise.all(
      allPokemon.map(async (entry) => {
        const pokeRes = await axios.get(entry.pokemon.url);
        const poke = pokeRes.data;

        return {
          name: poke.name,
          image: poke.sprites.front_default,
          types: poke.types.map(t => t.type.name)
        };
      })
    );

    res.json(pokemonData);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Failed to fetch Pokémon');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
