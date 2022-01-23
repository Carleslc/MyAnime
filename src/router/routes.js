const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ name: 'home', path: '', component: () => import('pages/Index.vue') }],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
