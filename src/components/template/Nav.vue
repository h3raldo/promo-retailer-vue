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
					title: 'Websites',
					icon: 'bi bi-box-arrow-up-left',
					url: 'https://promoretailer.prismic.io/documents/working?k=website&amp;l=en-us',
					type: 'external'
				},
				{
					title: 'Sales',
					icon: 'bi bi-receipt-cutoff',
					children: [
						{
							title: 'Quotes',
							icon: 'bi bi-calculator',
							url: self.symfony.views.quotes,
							type: 'vue'
						},
						{
							title: 'Orders',
							icon: 'bi bi-table',
							url: self.symfony.views.orders,
							type: 'vue'
						},
						{
							title: 'Purchase Orders',
							icon: 'bi bi-table',
							url: self.symfony.views.purchase_orders,
							type: 'vue'
						},
					]
				},
				{
					title: 'Global Sheets',
					icon: 'bi bi-database',
					url: self.symfony.views.global_sheets,
					type: 'vue'
				},
				{
					title: 'Images',
					icon: 'bi bi-images',
					children: [
						{
							title: 'Upload Image',
							icon: 'bi bi-cloud-arrow-up',
							url: self.symfony.views.images_upload,
							type: 'vue'
						},
						{
							title: 'Update CDN Images',
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
				}
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
	<div class="border-bottom pt-2 pb-2 mb-2 bg-gray">
		<div class="container">
			<header>
				<nav class="navbar navbar-expand-lg bg-body-tertiary">
					<div class="container-fluid">

						<RouterLink class="navbar-brand d-flex align-items-center text-dark text-decoration-none" :to="symfony.views.dashboard">
							<img class="pe-2" src="https://cdn.globalhealing.com/web/img/vendor/pr/pr-logo.png?w=80" width="40" alt="">
						</RouterLink>

						<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
							<span class="navbar-toggler-icon"></span>
						</button>

						<div class="collapse navbar-collapse" id="navbarNav">
							<ul class="navbar-nav flex-fill justify-content-center gap-4">
								<li v-for="link in nav" class="nav-item dropdown">
									<template v-if="link.children">
										<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i :class="link.icon"></i> {{ link.title }}</a>
										<ul class="dropdown-menu">
											<li v-for="child in link.children"><RouterLink class="dropdown-item" :to="child.url"><i :class="child.icon"></i> {{ child.title }}</RouterLink></li>
										</ul>
									</template>
									<template v-else>
										<template v-if="link.type === 'external'">
											<a class="nav-link" :href="link.url"><i :class="link.icon"></i> {{ link.title }}</a>
										</template>
										<template v-if="link.type === 'vue'">
											<RouterLink class="nav-link" :to="link.url"><i :class="link.icon"></i> {{ link.title }}</RouterLink>
										</template>
									</template>
								</li>
							</ul>
						</div>
						<div>
							<a class="nav-link" :href="symfony.logoutUrl"><i class="bi bi-door-closed"></i> Logout ({{ symfony.user }})</a>
						</div>
					</div>
				</nav>
			</header>
		</div>
	</div>
</template>
<script setup>
</script>