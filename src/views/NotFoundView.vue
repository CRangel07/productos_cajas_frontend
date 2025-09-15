<template>
  <Nav />
  <div class="contenedor-main flex items-center justify-center">
    <div>
      <p
        class="text-xl font-semibold bg-yellow-100 text-yellow-600 p-4 rounded"
      >
        Esta ruta a la que intentas acceder no existe
      </p>
      <button
        class="bg-slate-200 p-1 rounded block m-auto mt-5 cursor-pointer"
        @click="handleRuta"
      >
        Regresar a Lista
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Nav from "../components/Nav.vue";

const router = useRouter();

const handleRuta = () => {
  router.replace({ name: "regp_home" });
};
</script>

<style scoped></style>
