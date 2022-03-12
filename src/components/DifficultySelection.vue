<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },

  methods: {
    handleChange() {
      const difficulty = this.$refs.difficultyRef as HTMLInputElement;
      this.$emit("update:modelValue", difficulty.value.toLowerCase());
    },
  },
});
</script>

<template>
  <select @change="handleChange" ref="difficultyRef">
    <option>Easy</option>
    <option selected>Normal</option>
  </select>
</template>

<style scoped>
select {
  height: 32px;
}
</style>
