<template>
  <AuthLayout>
    <div class="container mx-auto max-w-md rounded-lg bg-neutral-50 p-10">
      <div class="my-4">
        <h1 class="text-4xl font-bold">Daftar</h1>
        <p class="text-neutral-500">Buat akun baru untuk melanjutkan.</p>
      </div>
      <AuthForm default-mode="register" />
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from "../components/layouts/AuthLayout.vue";
import AuthForm from "../components/features/AuthForm.vue";
</script>
