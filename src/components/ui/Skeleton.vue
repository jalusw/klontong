<script setup lang="ts">
import { computed } from "vue";

interface Props {
  class?: string;
  width?: string | number;
  height?: string | number;
  variant?: "text" | "rectangular" | "circular" | "rounded";
  lines?: number;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  width: undefined,
  height: undefined,
  variant: "rectangular",
  lines: 1,
  animated: true,
});

const skeletonClasses = computed(() => {
  const baseClasses = "bg-gray-200";
  const animationClasses = props.animated ? "animate-pulse" : "";

  const variantClasses = {
    text: "h-4",
    rectangular: "rounded-md",
    circular: "rounded-full",
    rounded: "rounded-lg",
  };

  return [baseClasses, animationClasses, variantClasses[props.variant], props.class]
    .filter(Boolean)
    .join(" ");
});

const skeletonStyle = computed(() => {
  const style: Record<string, string> = {};

  if (props.width) {
    style.width = typeof props.width === "number" ? `${props.width}px` : props.width;
  }

  if (props.height) {
    style.height = typeof props.height === "number" ? `${props.height}px` : props.height;
  }

  return style;
});
</script>

<template>
  <div :class="skeletonClasses" :style="skeletonStyle">
    <template v-if="variant === 'text' && lines > 1">
      <div
        v-for="i in lines"
        :key="i"
        :class="[
          'bg-gray-200',
          animated ? 'animate-pulse' : '',
          'h-4 rounded',
          i < lines ? 'mb-2' : '',
        ]"
        :style="{
          width: i === lines ? '75%' : '100%',
        }"
      />
    </template>
    <slot v-else />
  </div>
</template>
