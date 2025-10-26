import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard/Dashboard.vue';
import DefaultLayout from '../layout/DefaultLayout.vue';
import Login from '../views/Login/LoginForm.vue';
import Admin from '../views/Admin/Admin.vue';
import { usuarioStore } from '@/stores/usuario';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },

    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const store = usuarioStore();
  if (to.meta.requiresAuth && !store.token) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
