<script lang="ts">
import { defineComponent } from "vue";
import { useGameStore } from "../stores/game";
import { DifficultyOptions } from "../utilities/interfaces";

export default defineComponent({
  computed: {
    gameStore: () => useGameStore(),

    DifficultyOptions: () => DifficultyOptions,
  },
});
</script>

<template>
  <img
    :class="
      !gameStore.isGuessCorrect &&
      !gameStore.hasGivenUp &&
      gameStore.difficulty === DifficultyOptions.NORMAL &&
      'unknown'
    "
    :src="gameStore.currentPokemon.img"
    draggable="false"
  />
</template>

<style scoped>
img {
  width: 100%;
  height: auto;
  max-width: 512px;
  object-fit: contain;
}

.unknown {
  filter: brightness(0);
}
</style>
