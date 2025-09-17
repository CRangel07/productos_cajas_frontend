import Swal, { SweetAlertOptions } from "sweetalert2";

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
      showCancelButton: true,
      showCloseButton: true,
      focusCancel: true,
      title: "Confirma la acción",
      allowOutsideClick: true,
      theme: "dark",
      ...opt,
    });
  };

  const notificacion = (opt: SweetAlertOptions) => {
    return Swal.fire({
      toast: true,
      timer: 3000,
      icon: "info",
      showConfirmButton: false,
      timerProgressBar: true,
      position: "top-right",
      showCloseButton: true,
      ...opt,
    });
  };

  return { confirm, alerta, notificacion };
};
