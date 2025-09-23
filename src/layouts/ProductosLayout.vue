<template>
  <div>
    <Nav />
    <div class="p-10">
      <DescargarExcel />
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import DescargarExcel from "../components/DescargarExcel.vue";
import Nav from "../components/Nav.vue";
</script>
