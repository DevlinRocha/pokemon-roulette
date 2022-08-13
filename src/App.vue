<script lang="ts">
import { defineComponent } from "vue";
import Pokemon from "./components/Pokemon.vue";
import GenerationFilter from "./components/GenerationFilter.vue";
import DifficultySelection from "./components/DifficultySelection.vue";
import AnswerForm from "./components/AnswerForm.vue";
import Scoreboard from "./components/Scoreboard.vue";
import { mapStores } from "pinia";
import { useScoreStore } from "./stores/score";
import { useTimeStore } from "./stores/time";
import { useGameStore } from "./stores/game";

export default defineComponent({
  data() {
    return {
      title: "Who's that Pokémon?",
    };
  },

  mounted() {
    this.gameStore.selectAllGenerations();
    this.nextPokemon();
  },

  methods: {
    async correctGuess() {
      this.gameStore.isGuessCorrect = true;
      this.stopTimer();
      this.title = `It's ${this.gameStore.pokemon.name}!`;
      this.scoreStore.currentScore++;
      this.focusButton();
    },

    focusInput() {
      const answerFormRef = this.$refs.answerFormRef as any;
      answerFormRef.focusInput();
    },

    focusButton() {
      const answerFormRef = this.$refs.answerFormRef as any;
      answerFormRef.focusButton();
    },

    async nextPokemon() {
      await this.gameStore.setPokemon();
      this.gameStore.inputVal = "";
      this.gameStore.isGuessCorrect = false;
      this.gameStore.hasGivenUp = false;
      this.scoreStore.newHighScore = false;
      this.timeStore.newBestTime = false;
      this.title = "Who's that Pokémon?";
      this.focusInput();
      this.startTimer();
    },

    giveUp() {
      this.stopTimer();
      this.scoreStore.giveUp();
      this.gameStore.inputVal = this.gameStore.pokemon.name;
      this.gameStore.isGuessCorrect = false;
      this.gameStore.hasGivenUp = true;
      this.title = `It's ${this.gameStore.pokemon.name}!`;
      this.timeStore.prevTime = -1;
      this.timeStore.currentTime = 0;
      this.focusButton();
    },

    startTimer() {
      this.timeStore.currentTime = new Date().getTime();
    },

    stopTimer() {
      if (!this.gameStore.isGuessCorrect) return;

      this.timeStore.prevTime =
        (Date.now() - this.timeStore.currentTime) / 1000;
      this.timeStore.changeTime();
    },
  },

  computed: {
    ...mapStores(useScoreStore, useTimeStore, useGameStore),
  },

  watch: {
    "gameStore.difficulty"() {
      this.giveUp();
    },
  },

  components: {
    Pokemon,
    GenerationFilter,
    DifficultySelection,
    AnswerForm,
    Scoreboard,
  },
});
</script>

<template>
  <div class="column-container">
    <h1>{{ title }}</h1>

    <div class="container">
      <GenerationFilter
        v-model="gameStore.selectedGenerationIds"
        @toggleGeneration="giveUp"
        class="side-panel-left"
      />

      <div class="center-panel">
        <Pokemon />

        <AnswerForm
          ref="answerFormRef"
          v-model="gameStore.inputVal"
          @correctGuess="correctGuess"
          @nextPokemon="nextPokemon"
          @giveUp="giveUp"
        />
      </div>

      <div class="side-panel-right">
        <Scoreboard />
        <DifficultySelection v-model="gameStore.difficulty" />
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

span.correct {
  color: var(--confirm-color);
}

span.invalid {
  color: var(--cancel-color);
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
</style>
