import App from "./App.vue";
import persistirPinia from "pinia-plugin-persistedstate";

import { router } from "./router/index";
import { createApp } from "vue";
import { Pinia, createPinia } from "pinia";
import { setupSocketHandlers } from "./config/socketHandlers";

import "./style.css";

const aplicacion = createApp(App);

const pinia: Pinia = createPinia();

pinia.use(persistirPinia);

aplicacion.use(pinia);

aplicacion.use(router);

setupSocketHandlers();

aplicacion.mount("#app");
