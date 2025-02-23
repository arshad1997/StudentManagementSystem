import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Students from '../views/Students.vue';
import Courses from '../views/Courses.vue';
import Payments from '../views/Payments.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/students', component: Students },
  { path: '/courses', component: Courses },
  { path: '/payments', component: Payments }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
