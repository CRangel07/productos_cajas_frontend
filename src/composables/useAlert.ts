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

  return { confirm, alerta };
};
