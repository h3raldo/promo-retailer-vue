import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()

const routes = [
    {
        name: 'home',
        path: window.symfony.views.dashboard,
        component: () => import('@/Views/Home.vue') },
    {
        name: 'quotes',
        path: window.symfony.views.quotes,
        component: () => import('@/Views/Quotes/Quotes.vue') },
    {
        name: 'quotes_quote',
        path: window.symfony.views.quotes_quote,
        component: () => import('@/Views/Quotes/Quote/View.vue')
    },
    {
        name: 'orders',
        path: window.symfony.views.orders,
        component: () => import('@/Views/Orders/Orders.vue') },
    {
        name: 'orders_order',
        path: window.symfony.views.orders_order,
        component: () => import('@/Views/Orders/Order/View.vue')
    },
    {
        name: 'decorators',
        path: window.symfony.views.decorators,
        component: () => import('@/Views/Decorators/Decorators.vue')
    },
    {
        name: 'decorators_decorator',
        path: window.symfony.views.decorators_decorator,
        component: () => import('@/Views/Decorators/Decorator/View.vue')
    },
    {
        name: 'websites',
        path: window.symfony.views.websites,
        component: () => import('@/Views/Websites/Websites.vue')
    },
    {
        name: 'websites_website',
        path: window.symfony.views.websites_website,
        component: () => import('@/Views/Websites/Website/View.vue')
    },
    {
        name: 'products',
        path: window.symfony.views.products,
        component: () => import('@/Views/Products/Products.vue')
    },
    {
        name: 'products_product',
        path: window.symfony.views.products_product,
        component: () => import('@/Views/Products/Product/View.vue')
    },
    {
        name: 'logos_logo',
        path: window.symfony.views.logos_logo,
        component: () => import('@/Views/Logos/Logo/View.vue')
    },
    {
        name: 'purchase_orders',
        path: window.symfony.views.purchase_orders,
        component: () => import('@/Views/PurchaseOrders/PurchaseOrders.vue') },
    {
        name: 'purchase_orders_purchase_order',
        path: window.symfony.views.purchase_orders_purchase_order,
        component: () => import('@/Views/PurchaseOrders/PurchaseOrder/View.vue')
    },
    {
        path: window.symfony.views.reports_orders,
        component: () => import('@/Views/Reports/Orders.vue')
    },
    {
        path: window.symfony.views.images_upload,
        component: () => import('@/Views/Images/UploadImage.vue')
    },
    {
        path: window.symfony.views.images_update,
        component: () => import('@/Views/Images/UpdateImages.vue')
    },
    {
        path: window.symfony.views.global_sheets,
        component: () => import('@/Views/GlobalSheets.vue')
    },
    {
        path: window.symfony.views.companies,
        component: () => import('@/Views/Companies/Companies.vue')
    },
    {
        path: window.symfony.views.config,
        component: () => import('@/Views/Config/Config.vue')
    },
    {
        path: window.symfony.views.config_section,
        component: () => import('@/Views/Config/Config.vue')
    },
    {
        name: 'companies_company',
        path: window.symfony.views.companies_company,
        component: () => import('@/Views/Companies/Company/View.vue')
    },
    { path: window.symfony.views.contacts, component: () => import('@/Views/Contacts/Contacts.vue') },
    { path: window.symfony.views.contacts_contact, component: () => import('@/Views/Contacts/Contact/View.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')
