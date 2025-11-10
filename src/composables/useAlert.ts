import Swal, { SweetAlertOptions } from "sweetalert2";

// Creamos un mixin global para mantener configuración y stacking
const Toast = Swal.mixin({
  toast: true,
  position: "top-end", // más natural que top-right
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  showCloseButton: true,
  // Pausar al pasar el mouse
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const useAlert = () => {
  const alerta = (opt?: SweetAlertOptions) => {
    return Swal.fire({
      showCancelButton: false,
      focusConfirm: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      showCloseButton: true,
      theme: "dark",
      ...opt,
    });
  };

  const confirm = (opt?: SweetAlertOptions) => {
    return Swal.fire({
      title: "Confirma la acción",
      showCancelButton: true,
      showCloseButton: true,
      focusCancel: true,
      allowOutsideClick: true,
      theme: "dark",
      ...opt,
    });
  };

  const notificacion = (opt: SweetAlertOptions) => {
    // const containers = document.querySelectorAll(
    //   ".swal2-container.swal2-top-end"
    // );
    // if (containers.length >= 3) containers[0].remove(); // elimina el más antiguo
    // Se apilan automáticamente con el mismo mixin
    return Toast.fire({
      icon: "info",
      title: "Notificación",
      ...opt,
    });
  };

  return { confirm, alerta, notificacion };
};
