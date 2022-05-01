<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useGameStore } from "../stores/game";
import { DifficultyOptions } from "../utilities/interfaces";

export default defineComponent({
  props: {
    difficulty: String as PropType<DifficultyOptions>,
    isGuessCorrect: Boolean,
    hasGivenUp: Boolean,
  },

  computed: {
    gameStore: () => useGameStore(),
  },
});
</script>

<template>
  <img
    :class="
      !isGuessCorrect && !hasGivenUp && difficulty === 'normal' && 'unknown'
    "
    :src="gameStore.pokemon.img"
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
