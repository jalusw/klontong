<template>
  <input
    :value="modelValue"
    :="$attrs"
    class="shadow-border w-full rounded p-2 focus:ring focus:outline-none"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string;
}>();

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>
