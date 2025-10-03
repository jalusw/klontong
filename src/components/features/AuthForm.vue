<script setup lang="ts">
import { useForm } from "@tanstack/vue-form";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";

import Label from "../ui/Label.vue";
import Input from "../ui/Input.vue";
import Button from "../ui/Button.vue";
import Password from "../ui/Password.vue";
import { useAuth } from "../../composables/useAuth";

const router = useRouter();
const { login, register, isLoading } = useAuth();
const errorMessage = ref<string>("");
const props = defineProps<{ defaultMode?: "login" | "register" }>();
const mode = ref<"login" | "register">(props.defaultMode ?? "login");
const isRegister = computed(() => mode.value === "register");

const onSubmit = async ({
  value,
}: {
  value: { name?: string; email: string; password: string };
}) => {
  errorMessage.value = "";

  const result = isRegister.value
    ? await register({ name: value.name || "User", email: value.email, password: value.password })
    : await login({ email: value.email, password: value.password });

  if (result.success) router.push("/");
  else errorMessage.value = result.error || (isRegister.value ? "Registrasi gagal" : "Login gagal");
};

const form = useForm({
  defaultValues: {
    name: "",
    email: "",
    password: "",
  },
  onSubmit,
});
</script>

<template>
  <form class="mt-8 flex flex-col gap-y-4" autocomplete="on" @submit.prevent="form.handleSubmit">
    <div v-if="isRegister">
      <form.Field name="name">
        <template #default="{ field }">
          <Label for="name-input">Nama</Label>
          <Input
            id="name-input"
            type="text"
            placeholder="Nama lengkap"
            required
            autocomplete="name"
            :name="field.name"
            :value="field.state.value"
            @input="(e: Event) => field.handleChange((e.target as HTMLInputElement).value)"
            @blur="field.handleBlur"
          />
        </template>
      </form.Field>
    </div>
    <div>
      <form.Field name="email">
        <template #default="{ field }">
          <Label for="email-input">Email</Label>
          <Input
            id="email-input"
            type="email"
            placeholder="user@mail.co"
            required
            autocomplete="email"
            :name="field.name"
            :value="field.state.value"
            @input="(e: Event) => field.handleChange((e.target as HTMLInputElement).value)"
            @blur="field.handleBlur"
          />
        </template>
      </form.Field>
    </div>
    <div>
      <form.Field name="password">
        <template #default="{ field }">
          <Label for="password-input">Password</Label>
          <Password
            id="password-input"
            required
            :autocomplete="isRegister ? 'new-password' : 'current-password'"
            :name="field.name"
            :value="field.state.value"
            @input="(e: Event) => field.handleChange((e.target as HTMLInputElement).value)"
            @blur="field.handleBlur"
          />
        </template>
      </form.Field>
    </div>
    <div v-if="errorMessage" class="mt-2 text-sm text-red-600">
      {{ errorMessage }}
    </div>
    <Button type="submit" class="mt-4" :disabled="isLoading">
      {{
        isLoading ? (isRegister ? "Mendaftarkan..." : "Masuk...") : isRegister ? "Daftar" : "Masuk"
      }}
    </Button>
  </form>

  <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
    <span>
      {{ isRegister ? "Sudah punya akun?" : "Belum punya akun?" }}
    </span>
    <button
      type="button"
      class="text-primary underline"
      @click="mode = isRegister ? 'login' : 'register'"
    >
      {{ isRegister ? "Masuk" : "Daftar" }}
    </button>
  </div>
</template>
