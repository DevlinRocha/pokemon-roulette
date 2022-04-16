<script lang="ts">
import { defineComponent, PropType } from "vue";
import { DifficultyOptions } from "../utilities/interfaces";
import { useScoreStore } from "../stores/score";
import { useTimeStore } from "../stores/time";

export default defineComponent({
  props: {
    difficulty: {
      type: String as PropType<DifficultyOptions>,
      required: true,
    },
    isGuessCorrect: Boolean,
    hasGivenUp: Boolean,
  },

  computed: {
    scoreStore: () => useScoreStore(),
    timeStore: () => useTimeStore(),

    bestTime() {
      switch (this.difficulty) {
        case DifficultyOptions.EASY:
          if (
            this.timeStore.bestEasyTime === -1 ||
            this.timeStore.bestEasyTime === undefined
          )
            return "---";

          return `${this.timeStore.bestEasyTime} ${
            !!this.timeStore.bestEasyPokemon &&
            `(${this.timeStore.bestEasyPokemon})`
          }`;
        default: // normal
          if (
            this.timeStore.bestNormalTime === -1 ||
            this.timeStore.bestNormalTime === undefined
          )
            return "---";

          return `${this.timeStore.bestNormalTime} ${
            !!this.timeStore.bestNormalPokemon &&
            `(${this.timeStore.bestNormalPokemon})`
          }`;
      }
    },

    highScore() {
      return this.scoreStore[`${this.difficulty}HighScore`];
    },
  },
});
</script>

<template>
  <div>
    Current Score: {{ scoreStore.currentScore }}
    <span v-show="isGuessCorrect" class="correct">+1</span
    ><span v-show="hasGivenUp && scoreStore.prevScore > 0" class="invalid"
      >-{{ scoreStore.prevScore }}</span
    >
  </div>
  <div>
    High Score:
    <span :class="scoreStore.newHighScore && 'correct'">{{ highScore }}</span>
  </div>

  <div>
    Previous Time:
    {{
      timeStore.prevTime === -1 || timeStore.prevTime === undefined
        ? "---"
        : timeStore.prevTime
    }}
  </div>
  <div>
    Best Time:
    <span :class="timeStore.newBestTime && 'correct'">{{ this.bestTime }}</span>
  </div>
</template>
