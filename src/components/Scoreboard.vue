<script lang="ts">
import { defineComponent } from "vue";
import { useScoreStore } from "../stores/score";
import { useGameStore } from "../stores/game";
import { mapStores } from "pinia";
import { useTimeStore } from "../stores/time";

export default defineComponent({
  computed: {
    ...mapStores(useScoreStore, useGameStore, useTimeStore),

    highScore() {
      const score = useScoreStore();
      const game = useGameStore();
      return score[`${game.difficulty}HighScore`];
    },
  },
});
</script>

<template>
  <div>
    Current Score: {{ scoreStore.currentScore }}
    <span v-show="gameStore.isGuessCorrect" class="correct">+1</span
    ><span
      v-show="gameStore.hasGivenUp && scoreStore.prevScore > 0"
      class="invalid"
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
    <span :class="timeStore.newBestTime && 'correct'">{{
      timeStore.bestTime
    }}</span>
  </div>
</template>
