<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PokemonData } from "../App.vue";

export default defineComponent({
  props: {
    pokemon: {
      type: Object as PropType<PokemonData>,
      required: true,
    },
  },

  data() {
    return {
      title: "Who's that Pokémon?",

      isGuessCorrect: false,
    };
  },

  methods: {
    handleInput() {
      const input = this.$refs.inputRef as HTMLInputElement;

      if (input.value.toLowerCase() === this.$props.pokemon.name.toLowerCase())
        this.correctGuess();
    },

    correctGuess() {
      this.isGuessCorrect = true;
      this.title = `It's ${this.capitalize(this.$props.pokemon.name)}!`;
    },

    capitalize(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
});
</script>

<template>
  <h1>{{ title }}</h1>

  <div class="container">
    <img
      :class="[isGuessCorrect === false ? 'unknown' : '']"
      :src="$props.pokemon.img"
    />

    <input @input="handleInput" ref="inputRef" type="text" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.unknown {
  filter: brightness(0);
}
</style>
