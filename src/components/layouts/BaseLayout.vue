<script setup lang="ts">
import SkipLink from "../ui/SkipLink.vue";
import Navbar from "../features/Navbar.vue";
import Footer from "../features/Footer.vue";
</script>
<template>
  <SkipLink />
  <div class="container mx-auto max-w-screen-lg px-2">
    <Navbar />
    <main id="main" class="mt-6 min-h-screen">
      <slot />
    </main>
  </div>
  <Footer />
</template>
