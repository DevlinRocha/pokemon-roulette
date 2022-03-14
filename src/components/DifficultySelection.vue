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
  <div class="flex">
    <span>Difficulty:</span>
    <select @change="handleChange" ref="difficultyRef">
      <option>Easy</option>
      <option selected>Normal</option>
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
  height: 32px;
}
</style>
