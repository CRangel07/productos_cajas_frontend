<template>
  <RouterView />
  <Modal />
</template>

<script setup lang="ts">
import Modal from "./components/Modal.vue";
</script>

<style>
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
</style>
