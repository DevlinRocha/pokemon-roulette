<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },

  methods: {
    handleChange() {
      const difficulty = this.$refs.difficultyRef as HTMLInputElement;
      if (!this.confirmChange()) return (difficulty.value = this.modelValue);

      this.$emit("update:modelValue", difficulty.value);
    },

    confirmChange() {
      if (this.score <= 0) return true;

      return confirm(
        "Changing the difficulty will reset your current score, are you sure?"
      );
    },
  },
});
</script>

<template>
  <div class="flex">
    <span>Difficulty:</span>
    <select @change="handleChange" ref="difficultyRef">
      <option value="easy">Easy</option>
      <option value="normal" selected>Normal</option>
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
