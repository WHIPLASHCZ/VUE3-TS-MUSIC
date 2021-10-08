import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import mains from "../views/mains.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/recommend",
  },
  {
    path: "/recommend",
    name: "recommend",
    component: () =>
      import(
        "../views/recommend/recommend.vue" /* weboackChunkName:'recommend' */
      ),
    children: [
      {
        path: ":id",
        name: "album",
        component: () =>
          import(
            "../views/albumDetail/albumDetail.vue" /* weboackChunkName:'album' */
          ),
      },
    ],
  },
  {
    path: "/singer",
    name: "singer",
    component: () =>
      import("../views/singer/singer.vue" /* weboackChunkName:'singer' */),
    children: [
      {
        path: ":id",
        name: "singerDetail",
        component: () =>
          import(
            "../views/singerDetail/singerDetail.vue" /* weboackChunkName:'singerDetail' */
          ),
      },
    ],
  },
  {
    path: "/toplist",
    name: "toplist",
    component: () =>
      import("../views/topList/toplist.vue" /* weboackChunkName:'topList' */),
    children: [
      {
        path: ":id",
        name: "listDetail",
        component: () =>
          import(
            "../views/topDetail/topDetail.vue" /* weboackChunkName:'topDetail' */
          ),
      },
    ],
  },
  {
    path: "/search",
    name: "search",
    component: () =>
      import("../views/search/search.vue" /* weboackChunkName:'search' */),
    children: [
      {
        path: ":id",
        name: "singerDetail2",
        component: () =>
          import(
            "../views/singerDetail/singerDetail.vue" /* weboackChunkName:'searchDetail' */
          ),
      },
    ],
  },
  {
    path: "/user",
    name: "user",
    components: {
      user: () =>
        import("../views/user/user.vue" /* weboackChunkName:'user' */),
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("../views/notFound/notfound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
