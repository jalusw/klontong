<script setup lang="ts">
import { ref, computed } from "vue";
import { EyeIcon, EyeOffIcon } from "lucide-vue-next";

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const isVisible = ref(false);
const inputType = computed(() => (isVisible.value ? "text" : "password"));

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}

function toggle() {
  isVisible.value = !isVisible.value;
}
</script>

<template>
  <div class="relative">
    <input
      :type="inputType"
      :="$attrs"
      class="shadow-border w-full rounded p-2 pr-10 focus:ring focus:outline-none"
      :placeholder="isVisible ? '12345678' : '********'"
      @input="onInput"
    />
    <button
      type="button"
      class="absolute inset-y-0 right-0 px-3 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
      @click="toggle"
    >
      <EyeOffIcon v-if="isVisible" class="h-5 w-5" />
      <EyeIcon v-else class="h-5 w-5" />
    </button>
  </div>
</template>
