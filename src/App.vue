<script lang="ts">
import { defineComponent } from "vue";
import Pokemon from "./components/Pokemon.vue";
import { PokemonResource, PokemonData } from "./resources/pokemonResource";

export default defineComponent({
  async mounted() {
    // Odd Pokémon:
    // 413,
    // this.pokemon = await PokemonResource.detail(54);
    let response = await PokemonResource.list();
    this.pokemon = response.resources;
    console.log(this.pokemon);
  },

  data() {
    return {
      pokedex: 898, // Maximum Pokémon ID,
      pokemon: undefined as any, // Current Pokémon
    };
  },

  methods: {
    async getPokemon(id: number) {
      if (id > this.pokedex)
        throw new Error("Pokémon not found. There are 898 known Pokémon.");

      // const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      // return await response.json();

      // let randomPokemon =
      // return randomPokemon;
    },

    getRandomId(max: number) {
      return Math.floor(Math.random() * max) + 1;
    },
  },
  components: { Pokemon },
});
</script>

<template>
  <!-- <Pokemon :pokemon="pokemon" /> -->
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
