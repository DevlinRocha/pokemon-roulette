<script lang="ts">
import { defineComponent } from "vue";
import { DifficultyOptions } from "../utilities/interfaces";
import { capitalize } from "../utilities/functions";
import { useScoreStore } from "../stores/score";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },

  mounted() {
    this.reset();
  },

  methods: {
    capitalize,

    handleChange() {
      const difficulty = this.$refs.difficultyRef as HTMLSelectElement;
      if (!this.confirmChange()) return (difficulty.value = this.modelValue);

      this.$emit("update:modelValue", difficulty.value);
    },

    confirmChange() {
      if (this.scoreStore.currentScore <= 0) return true;

      return confirm(
        "Changing the difficulty will reset your current score, are you sure?"
      );
    },

    reset() {
      const options = this.$refs.optionsRef as HTMLOptionElement[];
      return options.map(
        (option) =>
          option.value === DifficultyOptions.NORMAL && (option.selected = true)
      );
    },
  },

  computed: {
    DifficultyOptions: () => DifficultyOptions,

    scoreStore: () => useScoreStore(),
  },
});
</script>

<template>
  <div class="flex">
    <span>Difficulty:</span>
    <select @change="handleChange" ref="difficultyRef">
      <option
        v-for="option in DifficultyOptions"
        :value="option"
        ref="optionsRef"
      >
        {{ capitalize(option) }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
  padding-top: 16px;
  align-items: center;
}

span {
  padding-right: 4px;
}

select {
  padding: 4px 0;
}
</style>
