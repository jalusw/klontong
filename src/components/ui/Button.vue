<script setup lang="ts">
import { cva } from "class-variance-authority";
import { computed } from "vue";

const classes = computed(() => {
  return cva("p-2 rounded focus:ring focus:outline-none", {
    variants: {
      variant: {
        primary: "bg-primary text-white",
        danger: "bg-red-500 text-white",
        ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
        outline: "bg-transparent text-primary border border-primary",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  });
});

const props = defineProps<{
  variant?: "primary" | "danger" | "ghost" | "outline";
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button :="$attrs" :class="classes({ variant: props.variant })" @click="$emit('click')">
    <slot />
  </button>
</template>
