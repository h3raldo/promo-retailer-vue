import { createApp } from 'vue'
import App from './App.vue'

import { createWebHistory, createRouter } from 'vue-router'

const routes = [
    { path: '/', component: () => import('@/Views/Home.vue') },
    { path: '/quotes/', component: () => import('@/Views/Quotes.vue') },
    { path: '/quotes/quote/:id/', component: () => import('@/Views/Quotes/Quote.vue') },
    { path: '/reports/magento/', component: () => import('@/Views/Reports/Magento.vue') },
    { path: '/upload-image/', component: () => import('@/Views/UploadImage.vue') },
    { path: '/update-cdn-images/', component: () => import('@/Views/UpdateImages.vue') },
    { path: '/global-sheets/', component: () => import('@/Views/GlobalSheets.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App)
    .use(router)
    .mount('#app')
