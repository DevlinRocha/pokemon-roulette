<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    difficulty: {
      type: String,
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
      type: String,
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
    getTime: {
      type: Function,
      required: true,
    },
  },

  methods: {
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
    <span :class="newHighScore && 'correct'">{{ getHighScore() }}</span>
  </div>

  <div>Previous Time: {{ prevTime }}</div>
  <div>
    Best Time:
    <span :class="newBestTime && 'correct'">{{ getTime() }}</span>
  </div>
</template>
