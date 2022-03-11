<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PokemonData } from "../App.vue";

export default defineComponent({
  props: {
    pokemon: {
      type: Object as PropType<PokemonData>,
      required: true,
    },
    isGuessCorrect: Boolean,
  },
});
</script>

<template>
  <img :class="[isGuessCorrect === false ? 'unknown' : '']" :src="pokemon.img" />
</template>

<style scoped>
.unknown {
  filter: brightness(0);
}
</style>
