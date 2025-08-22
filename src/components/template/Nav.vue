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
				{
					title: 'Dashboard',
					icon: 'bi bi-house',
					url: self.symfony.views.dashboard,
					type: 'vue'
				},

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
					title: 'Products',
					icon: 'bi bi-box-seam',
					url: self.symfony.views.products,
					type: 'vue'
				},
				{
					title: 'Decorators',
					icon: 'bi bi-brush',
					url: self.symfony.views.decorators,
					type: 'vue'
				},
				{
					title: 'Websites',
					icon: 'bi bi-columns',
					url: self.symfony.views.websites,
					type: 'vue'
				},
				{
					title: 'Images',
					icon: 'bi bi-card-image',
					type: 'dropdown',
					children: [
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
					]
				},
				{
					title: 'Reports',
					icon: 'bi-bar-chart-line-fill',
					url: self.symfony.views.reports_orders,
					type: 'vue'
				},
				{
					title: 'Reports (v2)',
					icon: 'bi-bar-chart-line-fill',
					url: self.symfony.views.reports_cogs,
					type: 'vue'
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
			<img class="pe-2 d-block" :src="symfony.brand.logo_small" width="40" alt="">
			<span>{{ symfony.brand.name }}</span>
		</RouterLink>

		<hr>

		<ul class="nav nav-pills flex-column mb-auto">

			<template v-for="link in nav">

				<template v-if="link.type === 'vue'">
				<li class="nav-item">
					<RouterLink class="nav-link text-white" :active-class="'nav-link active'" :to="link.url"><i :class="link.icon"></i> {{ link.title }}</RouterLink>
				</li>
				</template>

				<template v-else-if="link.type === 'dropdown'">
				<li class="nav-item dropdown">
					<a class="nav-link text-white dropdown-toggle" data-bs-toggle="dropdown" href="#"><i :class="link.icon"></i> {{ link.title }}</a>
					<ul class="dropdown-menu dropdown-menu-dark text-small shadow">
						<li v-for="child in link.children">
							<RouterLink class="nav-link text-white" :active-class="'nav-link active'" :to="child.url"><i :class="child.icon"></i> {{ child.title }}</RouterLink>
						</li>
					</ul>
				</li>
				</template>

				<template v-else>
				<li class="nav-item">
					<a class="nav-link text-white" :href="link.url"><i :class="link.icon"></i> {{ link.title }}</a>
				</li>
				</template>


			</template>

		</ul>
		<hr>
		<div class="">
			<a href="#" class="d-flex align-items-center text-white gap-2 text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
				<span><i class="bi bi-person-circle"></i></span>
				<strong>{{ symfony.user }}</strong>
			</a>
			<ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
				<li>
					<RouterLink class="dropdown-item" :to="symfony.views.config"><i class="bi bi-gear-fill"></i> Config</RouterLink>
				</li>
				<li><a class="dropdown-item" :href="symfony.api.quickbooks.connect">QuickBooks Connect</a></li>
				<li><hr class="dropdown-divider"></li>
				<li><a class="dropdown-item" :href="symfony.logoutUrl">Sign out</a></li>
			</ul>
		</div>

	</div>
</template>