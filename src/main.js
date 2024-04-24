import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()

const routes = [
    { path: window.symfony.views.dashboard, component: () => import('@/Views/Home.vue') },
    { path: window.symfony.views.quotes, component: () => import('@/Views/Quotes/Quotes.vue') },
    { path: window.symfony.views.quotes_quote, component: () => import('@/Views/Quotes/Quote.vue') },
    { path: window.symfony.views.orders, component: () => import('@/Views/Orders/Orders.vue') },
    { path: window.symfony.views.orders_order, component: () => import('@/Views/Orders/Order.vue') },
    { path: window.symfony.views.website, component: () => import('@/Views/Website/Website.vue') },
    { path: window.symfony.views.purchase_orders, component: () => import('@/Views/PurchaseOrders/PurchaseOrders.vue') },
    { path: window.symfony.views.reports_orders, component: () => import('@/Views/Reports/Magento.vue') },
    { path: window.symfony.views.images_upload, component: () => import('@/Views/Images/UploadImage.vue') },
    { path: window.symfony.views.images_update, component: () => import('@/Views/Images/UpdateImages.vue') },
    { path: window.symfony.views.global_sheets, component: () => import('@/Views/GlobalSheets.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')
