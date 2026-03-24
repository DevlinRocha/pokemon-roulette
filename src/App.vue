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

  async mounted() {
    this.gameStore.selectAllGenerations();
    void this.gameStore.loadPokemonNames();
    await this.gameStore.loadPokemon();
    await this.nextPokemon();
  },

  methods: {
    async correctGuess() {
      this.gameStore.isGuessCorrect = true;
      this.stopTimer();
      this.title = `It's ${this.gameStore.currentPokemon.name}!`;
      this.scoreStore.currentScore++;
      this.focus();
    },

    focus(element?: HTMLInputElement | HTMLButtonElement) {
      const answerFormRef = this.$refs.answerFormRef as InstanceType<
        typeof AnswerForm
      >;
      answerFormRef.focus(element);
    },

    async nextPokemon() {
      await this.gameStore.setPokemon();
      this.gameStore.inputVal = "";
      this.gameStore.isGuessCorrect = false;
      this.gameStore.hasGivenUp = false;
      this.scoreStore.newHighScore = false;
      this.timeStore.newBestTime = false;
      this.title = "Who's that Pokémon?";
      this.focus();
      this.startTimer();
      await this.gameStore.loadPokemon();
    },

    giveUp() {
      this.stopTimer();
      this.scoreStore.giveUp();
      this.gameStore.giveUp();
      this.title = `It's ${this.gameStore.currentPokemon.name}!`;
      this.timeStore.prevTime = -1;
      this.timeStore.currentTime = 0;
      this.focus();
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
  <div class="column-container" @click="focus()">
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
        <DifficultySelection
          v-model="gameStore.difficulty"
          @changeDifficulty="giveUp"
        />
        <section class="hotkey-legend" @click.stop>
          <h2>Hotkeys</h2>
          <dl>
            <div>
              <dt>Arrow Up / Arrow Down</dt>
              <dd>Move through autofill suggestions</dd>
            </div>
            <div>
              <dt>Tab / Shift+Tab</dt>
              <dd>Cycle autofill suggestions forward or backward</dd>
            </div>
            <div>
              <dt>Enter</dt>
              <dd>Choose the highlighted suggestion, or the top result</dd>
            </div>
            <div>
              <dt>Shift+Enter</dt>
              <dd>Give up</dd>
            </div>
            <div>
              <dt>Escape</dt>
              <dd>Close the autofill menu</dd>
            </div>
          </dl>
        </section>
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
  height: 100%;
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

.hotkey-legend {
  margin-top: 20px;
  padding: 12px;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  background-color: rgba(230, 188, 47, 0.12);
}

.hotkey-legend h2 {
  margin-bottom: 8px;
  font-size: 1rem;
}

.hotkey-legend dl {
  display: grid;
  gap: 10px;
}

.hotkey-legend dt {
  font-weight: bold;
}

.hotkey-legend dd {
  margin: 2px 0 0;
  font-size: 0.95rem;
}
</style>
