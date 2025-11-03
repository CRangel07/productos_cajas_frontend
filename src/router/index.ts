import {
  Router,
  createRouter,
  RouteRecordRaw,
  createWebHistory,
} from "vue-router";
import ProductosLayout from "../layouts/ProductosLayout.vue";
import RegistroView from "../views/RegistroView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import LoginLayout from "../layouts/LoginLayout.vue";
import { useAuthStore } from "../stores/authStore";
import { useAlert } from "../composables/useAlert";
import LineasView from "../views/LineasView.vue";

const rutasApp: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: { name: "regp_registro_page" },
  },
  {
    path: "/login",
    component: LoginLayout,
    name: "regp_login",
  },
  {
    path: "",
    component: ProductosLayout,
    name: "regp_home",
    children: [
      { path: "", component: RegistroView, name: "regp_registro_page" },
      { path: "lineas", component: LineasView, name: "regp_registro_lineas" },
    ],
    meta: { reqAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundView, // sin reqAuth
  },
];

export const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // más flexible
  routes: rutasApp,
  linkExactActiveClass: "text-cyan-200! font-medium!"
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const alert = useAlert();
  const auth = authStore.autenticado;
  const requiresAuth = to.meta.reqAuth;

  if (requiresAuth && !auth) {
    alert.notificacion({
      text: "Se requiere iniciar sesión para acceder a esta ruta.",
    });
    return next({ name: "regp_login" });
  }

  if (auth && to.name === "regp_login") {
    alert.notificacion({
      icon: "warning",
      text: "Ya haz iniciado sesión",
    });
    return next({ name: "regp_registro_page" });
  }

  next();
});
