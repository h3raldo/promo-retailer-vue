<script setup>
import {RouterLink} from "vue-router";
</script>

<script>
export default {
	data() {
		return {

		}
	},

	inject: ['symfony'],

	computed: {
		nav(){
			let self = this;

			return [

			  /*
				{
					title: 'Sales',
					icon: 'bi bi-receipt-cutoff',
					children: []
				},
				{
					title: 'Images',
					icon: 'bi bi-images',
					children: []
				},
		*/
				{
					title: 'Quotes',
					icon: 'bi bi-calculator',
					url: self.symfony.views.quotes,
					type: 'vue'
				},
				{
					title: 'Sales Orders',
					icon: 'bi bi-table',
					url: self.symfony.views.orders,
					type: 'vue'
				},
				{
					title: 'Purchase Orders',
					icon: 'bi bi-cash-coin',
					url: self.symfony.views.purchase_orders,
					type: 'vue'
				},
				{
					title: 'Companies/Vendors',
					icon: 'bi bi-building',
					url: self.symfony.views.companies,
					type: 'vue'
				},
				{
					title: 'Contacts',
					icon: 'bi bi-person',
					url: self.symfony.views.contacts,
					type: 'vue'
				},
				{
					title: 'Global Sheets',
					icon: 'bi bi-database',
					url: self.symfony.views.global_sheets,
					type: 'vue'
				},
				{
					title: 'Upload Image',
					icon: 'bi bi-cloud-arrow-up',
					url: self.symfony.views.images_upload,
					type: 'vue'
				},
				{
					title: 'Refresh CDN Images',
					icon: 'bi bi-arrow-clockwise',
					url: self.symfony.views.images_update,
					type: 'vue'
				},
				{
					title: 'Reports',
					icon: 'bi-bar-chart-line-fill',
					url: self.symfony.views.reports_orders,
					type: 'vue'
				},
				{
					title: 'Websites',
					icon: 'bi bi-box-arrow-up-left',
					url: 'https://promoretailer.prismic.io/documents/working?k=website&amp;l=en-us',
					type: 'external'
				},
			]
		}
	},

	methods: {

	},

	created() {

	},

	mounted() {

	}
}
</script>
<template>

	<div>
		<RouterLink class="d-flex align-items-center mb-3 gap-1 mb-md-0 me-md-auto text-white text-decoration-none" :to="symfony.views.dashboard">
			<img class="pe-2 d-block" src="https://cdn.globalhealing.com/web/img/vendor/pr/pr-logo.png?w=80" width="40" alt="">
			<span>Promo Retailer</span>
		</RouterLink>

		<hr>

		<ul class="nav nav-pills flex-column mb-auto">

			<li v-for="link in nav" class="nav-item">
				<RouterLink v-if="link.type === 'vue'" class="nav-link text-white" :active-class="'nav-link active'" :to="link.url"><i :class="link.icon"></i> {{ link.title }}</RouterLink>
				<a v-else class="nav-link text-white" :href="link.url"><i :class="link.icon"></i> {{ link.title }}</a>
			</li>
		</ul>
		<hr>
		<div class="dropdown">
			<a href="#" class="d-flex align-items-center text-white gap-2 text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
				<span><i class="bi bi-person-circle"></i></span>
				<strong>{{ symfony.user }}</strong>
			</a>
			<ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
				<li><a class="dropdown-item" :href="symfony.api.quickbooks.connect">QuickBooks Connect</a></li>
				<li><hr class="dropdown-divider"></li>
				<li><a class="dropdown-item" :href="symfony.logoutUrl">Sign out</a></li>
			</ul>
		</div>
	</div>
</template>
<script setup>
</script>