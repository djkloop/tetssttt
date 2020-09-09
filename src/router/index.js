/*
 * @Author        : djkloop
 * @Date          : 2020-09-04 16:38:48
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-09-04 16:45:16
 * @Description   : 头部注释
 * @FilePath      : /vd/src/router/index.js
 */
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  }
];

const router = new VueRouter({
  routes
});

export default router;
