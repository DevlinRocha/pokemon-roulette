<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PokemonData } from "../App.vue";

export default defineComponent({
  props: {
    pokemon: {
      type: Object as PropType<PokemonData>,
      required: true,
    },

    difficulty: String,

    isGuessCorrect: Boolean,
  },
});
</script>

<template>
  <img
    :class="[
      isGuessCorrect === false && difficulty === 'normal' ? 'unknown' : '',
    ]"
    :src="pokemon.img"
  />
</template>

<style scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.unknown {
  filter: brightness(0);
}
</style>
