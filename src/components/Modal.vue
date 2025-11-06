<template>
  <Teleport to="body">
    <div
      v-if="modalIsOpen"
      class="fixed left-[50%] top-0 z-[150] flex h-screen w-full -translate-x-[50%] items-center justify-center bg-black/90 bg-opacity-50"
    >
      <div
        class="w-full max-w-[90%] rounded-md bg-white shadow-lg"
        :class="[dynamicClass]"
      >
        <div
          class="mb-4 flex items-center justify-between rounded-t-md border-b border-yellow-700 bg-yellow-100 px-4 py-2.5"
        >
          <div class="flex flex-col">
            <h4 class="font-medium text-yellow-700">
              Registro de Cajas de Productos
            </h4>
            <h3 class="mt-2 font-bold text-yellow-700 lg:text-xl">
              {{ modalTitle }}
            </h3>
          </div>
          <XCircle
            class="cursor-pointer text-yellow-600 hover:text-red-500"
            @click="closeModal"
          />
        </div>
        <div class="max-h-[80vh] overflow-auto p-6">
          <component :is="modalComponent" v-bind="modalProps" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { XCircle } from "lucide-vue-next";
import { useHotkeys } from "../composables/useHotKeys";
import { storeToRefs } from "pinia";
import { useModalStore } from "../stores/modalStore";
import { watch, computed } from "vue";

const modalStore = useModalStore();
const { closeModal } = modalStore;
const { modalComponent, modalIsOpen, modalProps, modalTitle, maxWidth } =
  storeToRefs(modalStore);

const dynamicClass = computed(() => {
  switch (maxWidth.value) {
    case "sm":
      return "md:max-w-[400px]";
    case "md":
      return "md:max-w-[568px]";
    case "lg":
      return "md:max-w-[768px]";
    case "xl":
      return "md:max-w-[968px]";
    case "2xl":
      return "md:max-w-[1200px]";
    default:
      return "md:max-w-[90%]";
  }
});

let removeHotkeys: (() => void) | null = null;

watch(
  modalIsOpen,
  (isOpen) => {
    if (isOpen) {
      removeHotkeys = useHotkeys(["Escape"], () => closeModal());
      document.body.style.overflow = "hidden";
    } else {
      if (removeHotkeys) {
        removeHotkeys();
        removeHotkeys = null;
      }
      document.body.style.overflow = "";
    }
  },
  { immediate: true }
);
</script>
