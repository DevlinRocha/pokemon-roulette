<script lang="ts">
import { defineComponent, PropType } from "vue";
import { capitalize } from "../utilities/functions";
import { PokemonData } from "../utilities/interfaces";
import { useScoreStore } from "../stores/score";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    pokemon: {
      type: Object as PropType<PokemonData>,
      required: true,
    },
    isGuessCorrect: Boolean,
    hasGivenUp: Boolean,
    newBestTime: Boolean,
  },

  methods: {
    handleInput() {
      const input = this.$refs.inputRef as HTMLInputElement;

      this.$emit("update:modelValue", capitalize(input.value));

      if (input.value.toLowerCase() === this.pokemon.name.toLowerCase())
        this.$emit("correctGuess");
    },

    focusInput() {
      const inputRef = this.$refs.inputRef as HTMLInputElement;
      inputRef.disabled = false;
      inputRef.focus();
    },

    focusButton() {
      const buttonRef = this.$refs.buttonRef as HTMLInputElement;
      buttonRef.focus();
    },
  },

  computed: {
    scoreStore: () => useScoreStore(),
  },
});
</script>

<template>
  <form
    class="column-container"
    @submit.prevent="
      isGuessCorrect || hasGivenUp ? $emit('nextPokemon') : $emit('giveUp')
    "
  >
    <span
      :class="
        !isGuessCorrect && !scoreStore.newHighScore && !newBestTime && 'hidden'
      "
    >
      {{
        (newBestTime && "New best time!") ||
        (isGuessCorrect && "Good job!") ||
        (scoreStore.newHighScore && "New high score!")
      }}
    </span>

    <input
      @input="handleInput"
      ref="inputRef"
      :value="modelValue"
      :disabled="isGuessCorrect || hasGivenUp"
      :class="(hasGivenUp && 'invalid') || (isGuessCorrect && 'correct')"
      autocorrect="false"
      placeholder="Guess Pokémon..."
    />

    <button :class="(isGuessCorrect || hasGivenUp) && 'valid'" ref="buttonRef">
      {{ isGuessCorrect || hasGivenUp ? "Next Pokémon!" : "Give Up" }}
    </button>
  </form>
</template>

<style scoped>
input {
  margin: 16px 0;
  padding: 8px;
  font-weight: bold;
  border: 2px solid var(--primary-color);
  border-radius: 4px;
}

input:focus {
  border: 2px solid var(--select-color);
  outline: 1px solid var(--select-color);
}

input.correct {
  background-color: var(--confirm-color);
  color: #fff;
  border: 2px solid var(--confirm-color);
}

input.invalid {
  background-color: var(--cancel-color);
  color: #fff;
  border: 2px solid var(--cancel-color);
}

button {
  padding: 8px;
  background-color: #fff;
  border: 2px solid var(--primary-color);
  font-weight: bold;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}

button:focus,
button:hover {
  color: var(--secondary-color);
}

button.valid {
  background-color: var(--primary-color);
  color: #fff;
}

button.valid:focus,
button.valid:hover {
  outline: 2px solid var(--select-color);
  color: #fff;
}
</style>
