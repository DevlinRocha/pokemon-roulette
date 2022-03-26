<script lang="ts">
import { defineComponent } from "vue";
import Pokemon from "./components/Pokemon.vue";
import GenerationFilter from "./components/GenerationFilter.vue";
import DifficultySelection from "./components/DifficultySelection.vue";
import AnswerForm from "./components/AnswerForm.vue";

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
    this.nextPokemon();
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
      hasGivenUp: false,
      difficulty: "normal",
      score: 0,
      prevScore: 0,
      easyHighScore: 0,
      normalHighScore: 0,
      newHighScore: false,
      timer: 0,
      time: "",
      prevTime: "",
      bestEasyTime: "",
      bestNormalTime: "",
      bestEasyPokemon: "",
      bestNormalPokemon: "",
      newBestTime: false,
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

    async setPokemon() {
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

      this.pokemon = {
        id: pokemonId,
        name: await this.getPokemonName(pokemonId),
        img: pokemonData.sprites.front_default,
      };
    },

    getRandomId(min: number, max: number) {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    },

    async correctGuess() {
      this.isGuessCorrect = true;
      this.stopTimer();
      this.title = `It's ${await this.getPokemonName(this.pokemon.id)}!`;
      this.score = this.score + 1;
      this.focusButton();
    },

    focusInput() {
      const answerFormRef = this.$refs.answerFormRef as any;
      answerFormRef.$refs.inputRef.disabled = false;
      answerFormRef.$refs.inputRef.focus();
    },

    focusButton() {
      const answerFormRef = this.$refs.answerFormRef as any;
      answerFormRef.$refs.buttonRef.focus();
    },

    async nextPokemon() {
      await this.setPokemon();
      this.inputVal = "";
      this.isGuessCorrect = false;
      this.hasGivenUp = false;
      this.newHighScore = false;
      this.newBestTime = false;
      this.title = "Who's that Pokémon?";
      this.focusInput();
      this.startTimer();
    },

    giveUp() {
      this.stopTimer();
      this.inputVal = this.pokemon.name;
      this.isGuessCorrect = false;
      this.hasGivenUp = true;
      this.title = `It's ${this.pokemon.name}!`;
      this.changeScore();
      this.prevScore = this.score;
      this.score = 0;
      this.prevTime = "";
      this.time = "";
      this.focusButton();
    },

    changeScore() {
      switch (this.difficulty) {
        case "easy":
          if (this.score > this.easyHighScore) this.easyHighScore = this.score;
          break;
        case "normal":
          if (this.score > this.normalHighScore)
            this.normalHighScore = this.score;
        default:
          if (this.score > this.normalHighScore)
            this.normalHighScore = this.score;
      }
    },

    getHighScore() {
      switch (this.difficulty) {
        case "easy":
          return this.easyHighScore;
        case "normal":
          return this.normalHighScore;
        default:
          return this.normalHighScore;
      }
    },

    changeTime() {
      switch (this.difficulty) {
        case "easy":
          if (
            this.bestEasyTime !== "" &&
            Number(this.prevTime) > Number(this.bestEasyTime)
          )
            return;
          this.bestEasyTime = this.prevTime;
          this.bestEasyPokemon = this.pokemon.name;
          this.newBestTime = true;
          break;
        case "normal":
          if (
            this.bestNormalTime !== "" &&
            Number(this.prevTime) > Number(this.bestNormalTime)
          )
            return;
          this.bestNormalTime = this.prevTime;
          this.bestNormalPokemon = this.pokemon.name;
          this.newBestTime = true;
          break;
        default:
          if (
            this.bestNormalTime !== "" &&
            Number(this.prevTime) > Number(this.bestNormalTime)
          )
            return;
          this.bestNormalTime = this.prevTime;
          this.bestNormalPokemon = this.pokemon.name;
          this.newBestTime = true;
      }
    },

    getTime() {
      switch (this.difficulty) {
        case "easy":
          return `${this.bestEasyTime} ${
            this.bestEasyPokemon && `(${this.bestEasyPokemon})`
          }`;
        case "normal":
          return `${this.bestNormalTime} ${
            this.bestNormalPokemon && `(${this.bestNormalPokemon})`
          }`;
        default:
          return `${this.bestEasyTime} ${
            this.bestEasyPokemon && `(${this.bestEasyPokemon})`
          }`;
      }
    },

    startTimer() {
      clearInterval(this.timer);
      const start = new Date().getTime();

      this.timer = Number(
        setInterval(() => {
          return (this.time = String((Date.now() - start) / 1000));
        }, 10)
      );
    },

    stopTimer() {
      clearInterval(this.timer);

      if (!this.isGuessCorrect) return;

      this.prevTime = this.time;
      this.changeTime();
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
  components: { Pokemon, GenerationFilter, DifficultySelection, AnswerForm },
});
</script>

<template>
  <div class="column-container">
    <h1>{{ title }}</h1>

    <div class="container">
      <GenerationFilter
        :generations="generations"
        :score="score"
        v-model="selectedGenerationIds"
        @toggleGeneration="giveUp"
        class="side-panel-left"
      />

      <div class="center-panel">
        <Pokemon
          :pokemon="pokemon"
          :difficulty="difficulty"
          :isGuessCorrect="isGuessCorrect"
          :hasGivenUp="hasGivenUp"
        />

        <AnswerForm
          ref="answerFormRef"
          :pokemon="pokemon"
          :isGuessCorrect="isGuessCorrect"
          :hasGivenUp="hasGivenUp"
          :newHighScore="newHighScore"
          :newBestTime="newBestTime"
          v-model="inputVal"
          @correctGuess="correctGuess"
          @nextPokemon="nextPokemon"
          @giveUp="giveUp"
        />
      </div>

      <div class="side-panel-right">
        <div>
          Current Score: {{ score }}
          <span v-show="isGuessCorrect" class="correct">+1</span
          ><span v-show="hasGivenUp && prevScore > 0" class="invalid"
            >-{{ prevScore }}</span
          >
        </div>
        <div>
          High Score:
          <span :class="newHighScore && 'correct'">{{ getHighScore() }}</span>
        </div>

        <div>Previous Time: {{ prevTime }}</div>
        <div>
          Best Time:
          <span :class="newBestTime && 'correct'">{{ getTime() }}</span>
        </div>

        <DifficultySelection
          :score="score"
          v-model="difficulty"
          @changeDifficulty="giveUp"
        />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --primary-color: #e6bc2f;
  --secondary-color: #1b53ba;
  --select-color: #30a7d7;
  --confirm-color: #4dad5b;
  --cancel-color: #e3350d;
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

span.correct {
  color: var(--confirm-color);
}

span.invalid {
  color: var(--cancel-color);
}
</style>
