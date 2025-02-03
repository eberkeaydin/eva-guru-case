import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  { path: "/", component: Login }, // Varsayılan olarak Login bileşenini göster
  { path: "/dashboard", component: Dashboard},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;


