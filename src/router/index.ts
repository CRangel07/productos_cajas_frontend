import {
  Router,
  createRouter,
  RouteRecordRaw,
  createWebHistory,
} from "vue-router";
import ProductosLayout from "../layouts/ProductosLayout.vue";
import RegistroView from "../views/RegistroView.vue";

const rutasApp: RouteRecordRaw[] = [
  {
    path: "/",
    component: ProductosLayout,
    name: "regp_home",
    children: [
      { path: "", component: RegistroView, name: "regp_registro_page" },
    ],
  },
];

export const router: Router = createRouter({
  history: createWebHistory("/productos"),
  routes: rutasApp,
});
