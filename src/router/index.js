import Vue from "vue";
import VueRouter from "vue-router";

let vm = new Vue();

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import(/* webpackChunkName: "pack_1" */ "../views/home"),
  },
  {
    path: "/iconsviewpage",
    name: "iconsviewpage",
    component: () => import(/* webpackChunkName: "private" */ "../views/_iconsView"),
  },
  {
    path: "/calculate",
    name: "calculate",
    component: () => import(/* webpackChunkName: "private" */ "../views/_calculate"),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
