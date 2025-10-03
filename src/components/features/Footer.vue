<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME || "Klontong";
</script>

<template>
  <footer class="mt-16 px-2 py-2 text-center text-sm text-gray-500">
    <div class="container mx-auto flex max-w-screen-lg items-end justify-between">
      <p class="text-2xl font-bold">{{ appName }}</p>
      <p>Copyright © 2025 {{ appName }}</p>
    </div>
  </footer>
</template>
