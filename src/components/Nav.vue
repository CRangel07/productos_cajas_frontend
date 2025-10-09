<template>
  <Teleport to="body">
    <div
      class="absolute top-0 left-0 bg-gradient-to-r py-2 from-slate-800 to-slate-600 text-slate-50z-[50] w-full px-5"
    >
      <div class="max-w-[1180px] m-auto flex items-center justify-between py-2">
        <h1 class="text-sm lg:text-2xl font-semibold uppercase text-slate-50">
          Registro Productos con Caja
        </h1>
        <nav class="text-white text-xs lg:text-sm">
          <button type="button" @click="authStore.logout()">
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();
</script>
