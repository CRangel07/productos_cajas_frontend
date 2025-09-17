import { useApi } from "../composables/useApi";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ILoginUsuario } from "../types/responses";
import { useAlert } from "../composables/useAlert";

export const useAuthStore = defineStore("regp_store_auth", () => {
  const LocalKey = "session_info_regp_azteca";

  const router = useRouter();
  const alertas = useAlert();

  const { apiFetch, error, loading } = useApi();

  const usuarioLS = localStorage.getItem(LocalKey)
    ? (JSON.parse(localStorage.getItem(LocalKey)!) as ILoginUsuario)
    : null;

  const autenticado = computed<boolean>(() => !!usuario.value);

  const usuario = ref<ILoginUsuario | null>(usuarioLS);

  const login = async (username: string, pass: string) => {
    const responseLogin = await apiFetch<{ usuario: ILoginUsuario }>("/login", {
      method: "POST",
      body: { usuario: username, contrasena: pass },
    });

    if (responseLogin && error.value === null) {
      usuario.value = responseLogin.usuario;
      localStorage.setItem(LocalKey, JSON.stringify(usuario.value));
      router.replace({ name: "regp_registro_page" });
      alertas.notificacion({
        icon: "success",
        text: `Bienvenido ${usuario.value.usuario_nick}`,
      });
    }
  };

  const logout = async () => {
    const responseLogout = await apiFetch<{}>("/logout", {
      method: "POST",
    });

    if (responseLogout && error.value === null) {
      localStorage.removeItem(LocalKey);
      usuario.value = null;
      router.replace({ name: "regp_login" });
    }
  };

  return { login, logout, error, loading, usuario, autenticado };
});
