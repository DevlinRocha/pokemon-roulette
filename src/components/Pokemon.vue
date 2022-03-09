<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PokemonData } from "../App.vue";

export default defineComponent({
  props: {
    pokemon: {
      type: Object as PropType<PokemonData>,
      required: true,
    },

    isGuessCorrect: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<template>
  <img
    :class="[$props.isGuessCorrect === false ? 'unknown' : '']"
    :src="$props.pokemon.img"
  />
</template>

<style scoped>
.unknown {
  filter: brightness(0);
}
</style>
