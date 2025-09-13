// import { defineStore } from "pinia";
// import { apiRequest } from "../services/fetchApi";
// import { mostrarError, mostrarToast } from "../services/alertas";
// import { ISesionRespuesta } from "../interfaces/apiResponseInterfaces";
// import { ComputedRef, Ref, computed, ref } from "vue";
// import { useRouter } from "vue-router";
// import { RutasNomina } from "../config/routesNames";

// export const useAuthStore = defineStore("auth", () => {
//   const router = useRouter();

//   const sesionDesdeLocalStorage = JSON.parse(
//     localStorage.getItem("token_local")!
//   );

//   const sesion: Ref<ISesionRespuesta | null> = ref(
//     sesionDesdeLocalStorage as ISesionRespuesta | null
//   );

//   const getSesion: ComputedRef<ISesionRespuesta | null> = computed(
//     () => sesion.value
//   );

//   const iniciarSesion = async (data: {
//     usuario: string;
//     contrasena: string;
//   }) => {
//     try {
//       const response: ISesionRespuesta = await apiRequest("/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           usuario: data.usuario,
//           contrasena: data.contrasena,
//         }),
//       });

//       sesion.value = response;

//       localStorage.setItem("token_local", JSON.stringify(sesion.value));

//       redirigirRuta();
//       mostrarToast({
//         text: `Bienvenido ${sesion.value.usuario}, sesión iniciada`,
//         icon: "info",
//       });
//     } catch (error) {
//       mostrarError(error);
//     }
//   };

//   const logout = async () => {
//     try {
//       await apiRequest("/logout", { method: "POST" });
//       sesion.value = null;
//       localStorage.removeItem("token_local");
//       router.replace({ name: RutasNomina.Login });
//       mostrarToast({ text: "Se finalizó la sesión", icon: "info" });
//     } catch (error) {
//       mostrarError(error);
//     }
//   };

//   const redirigirRuta = () => {
//     if (sesion.value?.auth) {
//       router.replace({ name: RutasNomina.Home });
//       return;
//     }
//     router.replace({ name: RutasNomina.Login });
//   };

//   return { iniciarSesion, logout, getSesion };
// });
