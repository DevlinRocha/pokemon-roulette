<script lang="ts">
import { defineComponent, PropType } from "vue";
import { DifficultyOptions } from "../utilities/interfaces";
import { useScoreStore } from "../stores/score";

export default defineComponent({
  props: {
    difficulty: {
      type: String as PropType<DifficultyOptions>,
      required: true,
    },
    isGuessCorrect: Boolean,
    hasGivenUp: Boolean,
    prevTime: {
      type: Number,
      required: true,
    },
    newBestTime: Boolean,
    bestTime: {
      type: String,
      required: true,
    },
  },

  computed: {
    scoreStore: () => useScoreStore(),

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

  <div>Previous Time: {{ prevTime === -1 ? "---" : prevTime }}</div>
  <div>
    Best Time:
    <span :class="newBestTime && 'correct'">{{ bestTime }}</span>
  </div>
</template>
