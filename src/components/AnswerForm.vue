<script lang="ts">
import { defineComponent } from "vue";
import { capitalize } from "../utilities/functions";
import { mapStores } from "pinia";
import { useScoreStore } from "../stores/score";
import { useTimeStore } from "../stores/time";
import { useGameStore } from "../stores/game";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },

  methods: {
    handleInput() {
      const input = this.$refs.inputRef as HTMLInputElement;

      this.$emit("update:modelValue", capitalize(input.value));

      if (
        this.compareValue(input.value) ===
        this.compareValue(this.gameStore.currentPokemon.name)
      )
        this.$emit("correctGuess");
    },

    compareValue(value: string) {
      return value
        .normalize("NFKD")
        .replace(/\p{Extended_Pictographic}/u, "")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();
    },

    focus(element?: HTMLInputElement | HTMLButtonElement) {
      if (element) {
        if (element.disabled) element.disabled = false;
        return element.focus();
      }

      const inputRef = this.$refs.inputRef as HTMLInputElement;
      const buttonRef = this.$refs.buttonRef as HTMLButtonElement;

      this.$nextTick(() =>
        inputRef.disabled ? buttonRef.focus() : inputRef.focus()
      );
    },
  },

  computed: {
    ...mapStores(useScoreStore, useTimeStore, useGameStore),
  },
});
</script>

<template>
  <form
    class="column-container"
    @submit.prevent="
      gameStore.isGuessCorrect || gameStore.hasGivenUp
        ? $emit('nextPokemon')
        : $emit('giveUp')
    "
  >
    <span
      :class="
        !gameStore.isGuessCorrect &&
        !scoreStore.newHighScore &&
        !timeStore.newBestTime &&
        'hidden'
      "
    >
      {{
        (timeStore.newBestTime && "New best time!") ||
        (gameStore.isGuessCorrect && "Good job!") ||
        (scoreStore.newHighScore && "New high score!")
      }}
    </span>

    <input
      @input="handleInput"
      ref="inputRef"
      :value="modelValue"
      :disabled="gameStore.isGuessCorrect || gameStore.hasGivenUp"
      :class="
        (gameStore.hasGivenUp && 'invalid') ||
        (gameStore.isGuessCorrect && 'correct')
      "
      autocorrect="false"
      placeholder="Guess Pokémon..."
    />

    <button
      :class="(gameStore.isGuessCorrect || gameStore.hasGivenUp) && 'valid'"
      ref="buttonRef"
    >
      {{
        gameStore.isGuessCorrect || gameStore.hasGivenUp
          ? "Next Pokémon!"
          : "Give Up"
      }}
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
