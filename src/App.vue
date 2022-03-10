<script lang="ts">
import { defineComponent } from "vue";
import Pokemon from "./components/Pokemon.vue";
import GenerationFilter from "./components/GenerationFilter.vue";

export interface PokemonData {
  name: string;
  img: string;
}

export default defineComponent({
  mounted() {
    this.setPokemon();
  },

  data() {
    return {
      title: "Who's that Pokémon?",

      minPokedex: 1,

      maxPokedex: 898,

      pokemon: {} as PokemonData,

      inputRef: "",

      isGuessCorrect: false,
    };
  },

  methods: {
    async getPokemon(id: number) {
      if (id > this.maxPokedex)
        throw new Error("Pokémon not found. There are 898 known Pokémon.");

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return await response.json();
    },

    async setPokemon() {
      const pokemonData = await this.getPokemon(
        this.getRandomId(this.minPokedex, this.maxPokedex)
      );

      this.reset();

      this.pokemon = {
        name: pokemonData.species.name.toLowerCase(),
        img: pokemonData.sprites.front_default,
      };
    },

    getRandomId(min: number, max: number) {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    },

    handleInput() {
      if (this.inputRef.toLowerCase() === this.pokemon.name.toLowerCase())
        this.correctGuess();
    },

    correctGuess() {
      this.isGuessCorrect = true;
      this.title = `It's ${this.capitalize(this.pokemon.name)}!`;
    },

    capitalize(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    reset() {
      this.inputRef = "";
      this.isGuessCorrect = false;
      this.title = "Who's that Pokémon?";
    },
  },
  components: { Pokemon, GenerationFilter },
});
</script>

<template>
  <div class="container">
    <h1>{{ title }}</h1>

    <div class="flex">
      <GenerationFilter />

      <div class="container">
        <Pokemon :pokemon="pokemon" :isGuessCorrect="isGuessCorrect" />

        <input @input="handleInput" v-model="inputRef" type="text" />

        <button @click="setPokemon">Reset</button>
      </div>
    </div>
  </div>
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

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex {
  display: flex;
}
</style>
