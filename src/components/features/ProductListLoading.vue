<script setup lang="ts">
import Card from "../ui/Card.vue";
import Skeleton from "../ui/Skeleton.vue";

const props = withDefaults(
  defineProps<{
    count?: number;
  }>(),
  {
    count: 12,
  }
);
</script>

<template>
  <div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
    <Card v-for="i in props.count" :key="i">
      <div>
        <!-- Image skeleton -->
        <Skeleton :width="'100%'" :height="192" class="mb-4" />

        <div class="p-4">
          <!-- Category skeleton -->
          <Skeleton variant="text" :width="80" :height="16" class="mb-2" />

          <!-- Title skeleton -->
          <Skeleton variant="text" :width="'90%'" :height="20" class="mb-2" />

          <!-- Price skeleton -->
          <Skeleton variant="text" :width="100" :height="18" />
        </div>
      </div>
    </Card>
  </div>
</template>
