<template>
  <div class="relative">
    <!-- Botón campana -->
    <button
      class="relative bg-white dark:bg-slate-900 text-sky-500 hover:text-sky-400 transition-colors rounded-full p-2 shadow-sm hover:shadow-md focus:outline-none"
      @click.stop="showNotis = !showNotis"
    >
      <BellDot :size="22" />
      <span
        v-if="notiStore.notificaciones.length"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5"
      >
        {{ notiStore.notificaciones.length }}
      </span>
    </button>

    <!-- Contenedor de notificaciones -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="showNotis"
        class="absolute z-50 top-12 right-0 w-72 sm:w-80 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700"
        >
          <h3 class="font-semibold text-slate-700 dark:text-slate-200">
            Notificaciones
          </h3>
          <button
            @click="notiStore.cleanAll()"
            class="text-xs text-red-500 hover:text-red-400 font-medium"
          >
            Limpiar todas
          </button>
        </div>

        <!-- Lista -->
        <ul
          v-if="notiStore.notificaciones.length > 0"
          class="max-h-72 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700 scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-transparent"
        >
          <li
            v-for="not in notiStore.notificaciones"
            :key="not.id"
            class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div class="flex-shrink-0">
              <Info :size="18" class="text-sky-500" />
            </div>
            <p class="text-sm leading-tight break-words font-medium text-slate-700">
              {{ not.texto }}
              <span class="text-slate-400 text-xs block">{{ not.time }}</span>
            </p>
          </li>
        </ul>

        <!-- Sin notificaciones -->
        <div
          v-else
          class="text-center py-6 text-sm text-slate-400 dark:text-slate-500 select-none"
        >
          No hay notificaciones
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BellDot, Info } from "lucide-vue-next";
import { useNotificacionStore } from "../stores/notificationStore";

const notiStore = useNotificacionStore();
const showNotis = ref(false);
</script>
