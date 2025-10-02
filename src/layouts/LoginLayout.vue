<template>
  <div
    class="h-screen bg-gray-200 flex flex-col-reverse gap-5 items-center justify-center"
  >
    <p v-if="authStore.error" class="api-error">{{ authStore.error }}</p>
    <form
      @submit.prevent="handleSubmit"
      class="bg-white flex flex-col gap-2 lg:gap-3 lg:flex-row p-5 shadow rounded-lg"
    >
      <input
        v-model="data.usuario"
        type="text"
        placeholder="Usuario"
        class="border px-2 border-slate-400 rounded py-1.5"
        required
      />
      <input
        v-model="data.contrasena"
        class="border px-2 border-slate-400 rounded py-1.5"
        type="password"
        placeholder="Contraseña"
        required
      />
      <button
        type="submit"
        class="bg-lime-500 text-lime-50 font-semibold px-2 py-1.5 rounded cursor-pointer"
        :disabled="authStore.loading"
      >
        Ingresar
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();

const data = reactive<{ usuario: string | null; contrasena: string | null }>({
  usuario: null,
  contrasena: null,
});

const handleSubmit = () => {
  authStore.login(data.usuario!, data.contrasena!);
};
</script>

<style scoped></style>
