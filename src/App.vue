<script lang="ts">
import { defineComponent } from "vue";
import Pokemon from "./components/Pokemon.vue";

export interface PokemonData {
  name: string;
  img: string;
}

export default defineComponent({
  async mounted() {
    this.setPokemon();
  },

  data() {
    return {
      title: "Who's that Pokémon?",

      pokedex: 898, // Maximum Pokémon ID,

      pokemon: {} as PokemonData, // Current Pokémon

      isGuessCorrect: false,
    };
  },

  methods: {
    async getPokemon(id: number) {
      if (id > this.pokedex)
        throw new Error("Pokémon not found. There are 898 known Pokémon.");

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return await response.json();
    },

    async setPokemon() {
      const pokemonData = await this.getPokemon(
        this.getRandomId(1, this.pokedex)
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
      const input = this.$refs.inputRef as HTMLInputElement;

      if (input.value.toLowerCase() === this.pokemon.name.toLowerCase())
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
      const input = this.$refs.inputRef as HTMLInputElement;
      input.value = "";
      this.isGuessCorrect = false;
      this.title = "Who's that Pokémon?";
    },
  },
  components: { Pokemon },
});
</script>

<template>
  <div class="container">
    <h1>{{ title }}</h1>

    <Pokemon :pokemon="pokemon" :isGuessCorrect="isGuessCorrect" />

    <input @input="handleInput" ref="inputRef" type="text" />

    <button @click="setPokemon">Reset</button>
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
</style>
