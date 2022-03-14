<script lang="ts">
import { defineComponent } from "vue";
import Pokemon from "./components/Pokemon.vue";
import GenerationFilter from "./components/GenerationFilter.vue";
import DifficultySelection from "./components/DifficultySelection.vue";

export interface PokemonData {
  name: string;
  img: string;
}

export interface GenerationData {
  id: number;
  name: string;
  range: [number, number];
}

export default defineComponent({
  mounted() {
    this.setPokemon(true);
  },

  data() {
    return {
      title: "Who's that Pokémon?",
      minPokedex: 1,
      maxPokedex: 898,
      pokemon: {} as PokemonData,
      generations: [
        {
          id: 1,
          name: "Gen I",
          range: [1, 151],
        },
        {
          id: 2,
          name: "Gen II",
          range: [152, 251],
        },
        {
          id: 3,
          name: "Gen III",
          range: [252, 386],
        },
        {
          id: 4,
          name: "Gen IV",
          range: [387, 493],
        },
        {
          id: 5,
          name: "Gen V",
          range: [494, 649],
        },
        {
          id: 6,
          name: "Gen VI",
          range: [650, 721],
        },
        {
          id: 7,
          name: "Gen VII",
          range: [722, 809],
        },
        {
          id: 8,
          name: "Gen VIII",
          range: [810, 905],
        },
      ] as GenerationData[],
      selectedGenerationIds: [1, 2, 3, 4, 5, 6, 7, 8],
      inputVal: "",
      isGuessCorrect: false,
      difficulty: "normal",
      score: 0,
    };
  },

  methods: {
    async getPokemon(id: number) {
      if (id > this.maxPokedex)
        throw new Error(
          `Pokémon not found. There are ${this.maxPokedex} known Pokémon.`
        );

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return await response.json();
    },

    async setPokemon(reset: boolean) {
      let validPokemonId = false;
      let pokemonId: number;

      do {
        // Can change minPokedex and maxPokedex for further optimization
        pokemonId = this.getRandomId(this.minPokedex, this.maxPokedex);

        validPokemonId = this.acceptedPokemonIdRanges.some(
          (range: [number, number]) =>
            pokemonId > range[0] && pokemonId < range[1]
        );

        if (this.acceptedPokemonIdRanges.length === 0) {
          validPokemonId = true;
        }
      } while (!validPokemonId);

      const pokemonData = await this.getPokemon(pokemonId);

      reset ? this.reset() : this.nextPokemon();

      this.pokemon = {
        name: pokemonData.species.name.toLowerCase(),
        img: pokemonData.sprites.front_default,
      };
    },

    getRandomId(min: number, max: number) {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    },

    handleInput() {
      this.inputVal = this.capitalize(this.inputVal);

      if (this.inputVal.toLowerCase() === this.pokemon.name.toLowerCase())
        this.correctGuess();
    },

    correctGuess() {
      this.isGuessCorrect = true;
      this.title = `It's ${this.capitalize(this.pokemon.name)}!`;
      this.score = this.score + 1;
    },

    capitalize(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    nextPokemon() {
      this.inputVal = "";
      this.isGuessCorrect = false;
      this.title = "Who's that Pokémon?";
    },

    reset() {
      this.inputVal = "";
      this.isGuessCorrect = false;
      this.title = "Who's that Pokémon?";
      this.score = 0;
    },
  },

  computed: {
    acceptedPokemonIdRanges: ({ selectedGenerationIds, generations }) => {
      return selectedGenerationIds.map((id: number) => {
        let selectedGeneration = generations.find(
          (generation: GenerationData) => generation.id === id
        );
        return selectedGeneration.range;
      });
    },
  },
  components: { Pokemon, GenerationFilter, DifficultySelection },
});
</script>

<template>
  <div class="container">
    <h1>{{ title }}</h1>

    <div class="flex">
      <GenerationFilter
        v-model="selectedGenerationIds"
        :generations="generations"
      />

      <div class="center-panel container">
        <Pokemon
          :pokemon="pokemon"
          :difficulty="difficulty"
          :isGuessCorrect="isGuessCorrect"
        />

        <input @input="handleInput" v-model="inputVal" type="text" />

        <button @click="isGuessCorrect ? setPokemon(false) : setPokemon(true)">
          {{ isGuessCorrect ? "Next Pokémon!" : "Give Up" }}
        </button>
      </div>

      <div class="container">
        <div>Current Score: {{ score }}</div>

        <DifficultySelection v-model="difficulty" @change="setPokemon(true)" />
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
  padding-top: 16px;
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

.center-panel {
  padding: 0 8px;
}

button {
  margin-top: 8px;
}
</style>
