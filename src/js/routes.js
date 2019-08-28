import HomePage from "../pages/home.vue";
import AboutPage from "../pages/about.vue";

import DynamicRoutePage from "../pages/dynamic-route.vue";
import RequestAndLoad from "../pages/request-and-load.vue";
import NotFoundPage from "../pages/404.vue";

var routes = [
  {
    path: "/",
    component: HomePage
  },
  {
    path: "/about/",
    component: AboutPage
  },

  {
    path: "/dynamic-route/blog/:blogId/post/:postId/",
    component: DynamicRoutePage
  },
  {
    path: "/request-and-load/user/:userId/",

    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    },

    async: function(routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
    }
  },
  {
    path: "(.*)",
    component: NotFoundPage
  }
];

export default routes;
