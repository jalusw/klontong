<template>
  <AuthLayout>
    <div class="container mx-auto max-w-md rounded-lg bg-neutral-50 p-10">
      <div class="my-4">
        <h1 class="text-4xl font-bold">Masuk</h1>
        <p class="text-neutral-500">Silahkan isi kredensial untuk melanjutkan.</p>
      </div>
      <AuthForm />
    </div>
  </AuthLayout>
</template>

<script type="ts" setup>
import AuthForm from "../components/features/AuthForm.vue";
import AuthLayout from "../components/layouts/AuthLayout.vue";
</script>
