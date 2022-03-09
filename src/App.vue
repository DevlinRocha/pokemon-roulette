<script lang="ts">
import { defineComponent } from "vue";
import Pokemon from "./components/Pokemon.vue";

export interface PokemonData {
  name: string;
  img: string;
}

export default defineComponent({
  async mounted() {
    const pokemonData = await this.getPokemon(this.getRandomId(this.pokedex));

    this.pokemon = {
      name: pokemonData.name.toLowerCase(),
      img: pokemonData.sprites.front_default,
    };
  },

  data() {
    return {
      pokedex: 898, // Maximum Pokémon ID,

      pokemon: { name: "", img: "" }, // Current Pokémon
    };
  },

  methods: {
    async getPokemon(id: number) {
      if (id > this.pokedex)
        throw new Error("Pokémon not found. There are 898 known Pokémon.");

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return await response.json();
    },

    getRandomId(max: number) {
      return Math.floor(Math.random() * max) + 1;
    },
  },
  components: { Pokemon },
});
</script>

<template>
  <Pokemon :pokemon="pokemon" />
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 16px;
  min-width: 100vw;
  min-height: 100vh;
}
</style>
