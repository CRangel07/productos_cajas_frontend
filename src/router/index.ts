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

const rutasApp: RouteRecordRaw[] = [
  {
    path: "/login",
    component: LoginLayout,
    name: "regp_login",
  },
  {
    path: "/lista",
    component: ProductosLayout,
    name: "regp_home",
    children: [
      { path: "", component: RegistroView, name: "regp_registro_page" },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundView,
  },
];

export const router: Router = createRouter({
  history: createWebHistory("/productos"),
  routes: rutasApp,
});
