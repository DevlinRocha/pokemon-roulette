<script lang="ts">
import { defineComponent } from "vue";
import {
  capitalize,
  normalizePokemonName,
} from "../utilities/functions";
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

  data() {
    return {
      guess: "",
      highlightedSuggestionIndex: -1,
      isSuggestionMenuOpen: false,
    };
  },

  methods: {
    handleInput() {
      const input = this.$refs.inputRef as HTMLInputElement;
      const nextValue = capitalize(input.value);

      this.highlightedSuggestionIndex = -1;
      this.isSuggestionMenuOpen = input.value.length > 0;

      this.updateValue(nextValue);
    },

    compareValue(value: string) {
      return normalizePokemonName(value);
    },

    updateValue(value: string) {
      this.$emit("update:modelValue", value);

      if (
        this.compareValue(value) ===
        this.compareValue(this.gameStore.currentPokemon.name)
      ) {
        this.closeSuggestions();
        this.$emit("correctGuess");
      }
    },

    giveUp() {
      const input = this.$refs.inputRef as HTMLInputElement;
      this.guess = input.value;
      this.closeSuggestions();
      this.$emit("giveUp");
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

    handleFocus() {
      if (!this.gameStore.pokemonNames.length) {
        void this.gameStore.loadPokemonNames();
      }

      this.isSuggestionMenuOpen =
        !!this.modelValue &&
        !this.gameStore.isGuessCorrect &&
        !this.gameStore.hasGivenUp;
    },

    handleBlur() {
      window.setTimeout(() => this.closeSuggestions(), 100);
    },

    cycleSuggestions(direction: 1 | -1) {
      if (!this.shouldShowSuggestions) return;

      const lastSuggestionIndex = this.suggestions.length - 1;

      if (direction === 1) {
        this.highlightedSuggestionIndex =
          this.highlightedSuggestionIndex < lastSuggestionIndex
            ? this.highlightedSuggestionIndex + 1
            : 0;
        return;
      }

      this.highlightedSuggestionIndex =
        this.highlightedSuggestionIndex > 0
          ? this.highlightedSuggestionIndex - 1
          : lastSuggestionIndex;
    },

    handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        this.closeSuggestions();
        return;
      }

      if (
        event.key === "Enter" &&
        event.shiftKey &&
        !this.gameStore.isGuessCorrect &&
        !this.gameStore.hasGivenUp
      ) {
        event.preventDefault();
        this.giveUp();
        return;
      }

      if (event.key === "ArrowDown") {
        if (!this.suggestions.length) return;
        event.preventDefault();
        this.isSuggestionMenuOpen = true;
        this.cycleSuggestions(1);
      }

      if (event.key === "ArrowUp") {
        if (!this.suggestions.length) return;
        event.preventDefault();
        this.cycleSuggestions(-1);
      }

      if (event.key === "Tab" && this.shouldShowSuggestions) {
        event.preventDefault();
        this.cycleSuggestions(event.shiftKey ? -1 : 1);
      }

      if (
        event.key === "Enter" &&
        !this.gameStore.isGuessCorrect &&
        !this.gameStore.hasGivenUp
      ) {
        event.preventDefault();

        if (!this.shouldShowSuggestions) return;

        const selectedSuggestion =
          this.highlightedSuggestionIndex >= 0
            ? this.suggestions[this.highlightedSuggestionIndex]
            : this.suggestions[0];

        if (selectedSuggestion) {
          this.selectSuggestion(selectedSuggestion);
        }
      }
    },

    selectSuggestion(suggestion: string) {
      this.updateValue(suggestion);
      this.closeSuggestions();

      this.$nextTick(() => {
        const input = this.$refs.inputRef as HTMLInputElement;
        input.focus();
      });
    },

    closeSuggestions() {
      this.isSuggestionMenuOpen = false;
      this.highlightedSuggestionIndex = -1;
    },
  },

  computed: {
    ...mapStores(useScoreStore, useTimeStore, useGameStore),

    suggestions(): string[] {
      const searchValue = this.compareValue(this.modelValue);

      if (
        !searchValue ||
        this.gameStore.isGuessCorrect ||
        this.gameStore.hasGivenUp
      ) {
        return [];
      }

      const startsWithMatches: string[] = [];
      const containsMatches: string[] = [];

      this.gameStore.autocompletePokemonNames.forEach(
        ({ name }: { name: string }) => {
        const normalizedName = this.compareValue(name);

        if (normalizedName.startsWith(searchValue)) {
          startsWithMatches.push(name);
          return;
        }

        if (normalizedName.includes(searchValue)) {
          containsMatches.push(name);
        }
        }
      );

      return [...startsWithMatches, ...containsMatches].slice(0, 8);
    },

    shouldShowSuggestions(): boolean {
      return this.isSuggestionMenuOpen && this.suggestions.length > 0;
    },
  },
});
</script>

<template>
  <form
    class="column-container"
    @submit.prevent="
      gameStore.isGuessCorrect || gameStore.hasGivenUp
        ? $emit('nextPokemon')
        : giveUp()
    "
  >
    <span
      :class="
        !gameStore.isGuessCorrect &&
        !scoreStore.newHighScore &&
        !timeStore.newBestTime &&
        (!gameStore.hasGivenUp || !guess) &&
        'hidden'
      "
    >
      {{
        (timeStore.newBestTime && "New best time!") ||
        (gameStore.isGuessCorrect && "Good job!") ||
        (scoreStore.newHighScore && "New high score!") ||
        (gameStore.hasGivenUp && `You guessed ${guess}`)
      }}
    </span>

    <div class="input-container">
      <input
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
        @keydown="handleKeydown"
        ref="inputRef"
        :value="modelValue"
        :disabled="gameStore.isGuessCorrect || gameStore.hasGivenUp"
        :class="
          (gameStore.hasGivenUp && 'invalid') ||
          (gameStore.isGuessCorrect && 'correct')
        "
        aria-autocomplete="list"
        autocorrect="false"
        autocomplete="off"
        placeholder="Guess Pokémon..."
        spellcheck="false"
      />

      <ul v-if="shouldShowSuggestions" class="suggestions" role="listbox">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="suggestion"
          :class="['suggestion', index === highlightedSuggestionIndex && 'active']"
          @mousedown.prevent="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </li>
      </ul>
    </div>

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
.input-container {
  position: relative;
  width: min(100%, 22rem);
  margin: 16px 0;
}

input {
  width: 100%;
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
  -webkit-text-fill-color: #fff; /* Safari */
  border: 2px solid var(--cancel-color);
}

.suggestions {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 16rem;
  overflow-y: auto;
  padding: 4px 0;
  list-style: none;
  background-color: #fff;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  box-shadow: 0 12px 24px rgba(27, 83, 186, 0.16);
  z-index: 10;
}

.suggestion {
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
}

.suggestion.active,
.suggestion:hover {
  background-color: var(--secondary-color);
  color: #fff;
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
