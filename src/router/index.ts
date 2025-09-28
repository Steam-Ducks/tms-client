import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard/Dashboard.vue';
import DefaultLayout from '../layout/DefaultLayout.vue';


const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router

