<script lang="ts">
import { defineComponent } from "vue";
import Pokemon from "./components/Pokemon.vue";
import GenerationFilter from "./components/GenerationFilter.vue";
import DifficultySelection from "./components/DifficultySelection.vue";

export interface PokemonData {
  id: number;
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

    async getPokemonName(id: number) {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
      );
      const species = await response.json();
      // English: 7
      return species.names[7].name;
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
        id: pokemonId,
        name: await this.getPokemonName(pokemonId),
        img: pokemonData.sprites.front_default,
      };

      this.focusInput();
    },

    getRandomId(min: number, max: number) {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    },

    handleInput() {
      this.inputVal = this.capitalize(this.inputVal);

      if (this.inputVal.toLowerCase() === this.pokemon.name.toLowerCase())
        this.correctGuess();
    },

    async correctGuess() {
      this.isGuessCorrect = true;
      this.title = `It's ${await this.getPokemonName(this.pokemon.id)}!`;
      this.score = this.score + 1;
      this.focusButton();
    },

    capitalize(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    focusInput() {
      const input = this.$refs.inputRef as HTMLInputElement;
      input.disabled = false;
      input.focus();
    },

    focusButton() {
      const button = this.$refs.buttonRef as HTMLButtonElement;
      button.focus();
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
  <div class="column-container">
    <h1>{{ title }}</h1>

    <div class="container">
      <GenerationFilter
        v-model="selectedGenerationIds"
        :generations="generations"
        class="side-panel-left"
      />

      <div class="center-panel">
        <Pokemon
          :pokemon="pokemon"
          :difficulty="difficulty"
          :isGuessCorrect="isGuessCorrect"
        />

        <form
          class="column-container"
          @submit.prevent="
            isGuessCorrect ? setPokemon(false) : setPokemon(true)
          "
        >
          <div :class="isGuessCorrect ? '' : 'hidden'">Good job!</div>
          <input
            @input="handleInput"
            v-model="inputVal"
            ref="inputRef"
            :disabled="isGuessCorrect"
            autocorrect="false"
            placeholder="Guess Pokémon..."
          />

          <button :class="isGuessCorrect ? 'correct' : ''" ref="buttonRef">
            {{ isGuessCorrect ? "Next Pokémon!" : "Give Up" }}
          </button>
        </form>
      </div>

      <div class="side-panel-right">
        <div>
          Current Score: {{ score }} <span v-show="isGuessCorrect">+1</span>
        </div>

        <DifficultySelection v-model="difficulty" @change="setPokemon(true)" />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --primary-color: #e6bc2f;
  --secondary-color: #1b53ba;
  --confirm-color: #4dad5b;
  --select-color: #30a7d7;
}

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
  color: #2c3e50;
  padding: 16px;
  min-width: 100vw;
  min-height: 100vh;
  width: 100vw;
  height: 100vh;
}

.hidden {
  visibility: hidden;
}
</style>

<style scoped>
.column-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
}

.container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: auto;
}

.side-panel-left {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  height: auto;
  padding-top: 16px;
}

.center-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 0 16px;
}

.side-panel-right {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  padding-top: 16px;
}

input {
  margin: 16px 0;
  padding: 8px;
  font-weight: bold;
  border: 2px solid var(--primary-color);
  border-radius: 4px;
}

input:focus {
  border: 2px solid var(--select-color);
  outline: 1px solid var(--select-color);
}

input:disabled {
  background-color: var(--confirm-color);
  color: #fff;
  border: 2px solid var(--confirm-color);
}

button {
  padding: 8px;
  background-color: #fff;
  border: 2px solid var(--primary-color);
  font-weight: bold;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}

button:focus,
button:hover {
  color: var(--secondary-color);
}

.correct {
  background-color: var(--primary-color);
  color: #fff;
}

.correct:focus,
.correct:hover {
  outline: 2px solid var(--select-color);
  color: #fff;
}

span {
  color: var(--confirm-color);
}
</style>
