import { defineStore } from "pinia";
import { Ref, shallowRef, Component, ref } from "vue";

export const useModalStore = defineStore("ce_modal_store", () => {
  const modalIsOpen: Ref<boolean> = ref(false);
  const modalTitle: Ref<string> = ref("");
  const modalComponent = shallowRef<Component | null>(null);
  const modalProps: Ref<Record<string, any>> = ref({});
  const maxWidth = ref<"sm" | "md" | "lg" | "xl" | "2xl">("sm");

  const openModal = (
    component: Component,
    options: {
      title?: string;
      props?: Record<string, any>;
      width?: "sm" | "md" | "lg" | "xl" | "2xl";
    } = {}
  ) => {
    modalComponent.value = component;
    modalTitle.value = options.title ?? "";
    modalProps.value = options.props ?? {};
    modalIsOpen.value = true;
    maxWidth.value = options.width ?? "sm";
  };

  const closeModal = () => {
    modalIsOpen.value = false;
    modalComponent.value = null;
    modalProps.value = {};
    modalTitle.value = "";
  };

  return {
    modalIsOpen,
    modalTitle,
    modalComponent,
    modalProps,
    maxWidth,
    openModal,
    closeModal,
  };
});
