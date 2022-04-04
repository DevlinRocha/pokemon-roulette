<script lang="ts">
import { defineComponent, PropType } from "vue";
import { DifficultyType } from "../utilities/interfaces";

export default defineComponent({
  props: {
    difficulty: {
      type: String as PropType<DifficultyType>,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    isGuessCorrect: Boolean,
    hasGivenUp: Boolean,
    prevScore: {
      type: Number,
      required: true,
    },
    newHighScore: Boolean,
    prevTime: {
      type: Number,
      required: true,
    },
    newBestTime: Boolean,
    easyHighScore: {
      type: Number,
      required: true,
    },
    normalHighScore: {
      type: Number,
      required: true,
    },
    bestTime: {
      type: String,
      required: true,
    },
  },

  computed: {
    highScore() {
      return this[`${this.difficulty}HighScore`];
    },
  },
});
</script>

<template>
  <div>
    Current Score: {{ score }}
    <span v-show="isGuessCorrect" class="correct">+1</span
    ><span v-show="hasGivenUp && prevScore > 0" class="invalid"
      >-{{ prevScore }}</span
    >
  </div>
  <div>
    High Score:
    <span :class="newHighScore && 'correct'">{{ highScore }}</span>
  </div>

  <div>Previous Time: {{ prevTime }}</div>
  <div>
    Best Time:
    <span :class="newBestTime && 'correct'">{{ bestTime }}</span>
  </div>
</template>
