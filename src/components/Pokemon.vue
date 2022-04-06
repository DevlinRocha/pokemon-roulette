<script lang="ts">
import { defineComponent, PropType } from "vue";
import { DifficultyOptions, PokemonData } from "../utilities/interfaces";

export default defineComponent({
  props: {
    pokemon: {
      type: Object as PropType<PokemonData>,
      required: true,
    },
    difficulty: String as PropType<DifficultyOptions>,
    isGuessCorrect: Boolean,
    hasGivenUp: Boolean,
  },
});
</script>

<template>
  <img
    :class="
      !isGuessCorrect && !hasGivenUp && difficulty === 'normal' && 'unknown'
    "
    :src="pokemon.img"
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
