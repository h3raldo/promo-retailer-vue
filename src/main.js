import { createApp } from 'vue'
import App from './App.vue'

import { createWebHistory, createRouter } from 'vue-router'

console.log('mainJS', window.symfony);

const routes = [
    { path: window.symfony.views.dashboard, component: () => import('@/Views/Home.vue') },
    { path: window.symfony.views.quotes, component: () => import('@/Views/Quotes.vue') },
    { path: window.symfony.views.website, component: () => import('@/Views/Website.vue') },
    { path: window.symfony.views.orders, component: () => import('@/Views/Orders.vue') },
    { path: window.symfony.views.purchase_orders, component: () => import('@/Views/PurchaseOrders.vue') },
    { path: window.symfony.views.quotes_quote, component: () => import('@/Views/Quotes/Quote.vue') },
    { path: window.symfony.views.reports_orders, component: () => import('@/Views/Reports/Magento.vue') },
    { path: window.symfony.views.images_upload, component: () => import('@/Views/UploadImage.vue') },
    { path: window.symfony.views.images_update, component: () => import('@/Views/UpdateImages.vue') },
    { path: window.symfony.views.global_sheets, component: () => import('@/Views/GlobalSheets.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App)
    .use(router)
    .mount('#app')
