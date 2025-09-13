import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { Pinia, createPinia } from "pinia";
import persistirPinia from "pinia-plugin-persistedstate";
import { router } from "./router/index";

const aplicacion = createApp(App);

const pinia: Pinia = createPinia();

pinia.use(persistirPinia);

aplicacion.use(pinia);

aplicacion.use(router);

aplicacion.mount("#app");
