import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
history: createWebHistory(import.meta.env.BASE_URL),
routes: [
{
path: '/',
name: 'home',
component: () => import ('../views/home.vue')
},
{
path: '/about',
name: 'about',
component: () => import('../views/about.vue')
},
{
path: '/compose',
name: 'Compose new Mail',
component: () => import ('../views/compose.vue')
},
{
path: '/history',
name: 'Mail History',
component: () => import ('../views/history.vue')
},
{
path: '/settings',
name: 'Settings',
component: () => import ('../views/settings.vue')
},
{
path: '/list',
name: 'Email List',
component: () => import ('../views/list.vue')
}
]
})

export default router
