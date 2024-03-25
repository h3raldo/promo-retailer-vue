<script setup>
import {RouterLink} from "vue-router";
</script>

<script>
export default {
	data() {
		return {
			links: [
				{
					title: 'Websites',
					icon: 'bi bi-box-arrow-up-left',
					url: 'https://promoretailer.prismic.io/documents/working?k=website&amp;l=en-us',
					type: 'external'
				},
				{
					title: 'Quotes',
					icon: 'bi bi-receipt-cutoff',
					url: '/quotes/',
					type: 'vue'
				},
				{
					title: 'Global Sheets',
					icon: 'bi bi-database',
					url: '/global-sheets/',
					type: 'vue'
				},
				{
					title: 'Upload Image',
					icon: 'bi bi-images',
					url: '/upload-image/',
					type: 'vue'
				},
				{
					title: 'Refresh Images',
					icon: 'bi bi-images',
					url: '/s3/imageCrawl/refresh',
					type: 'external'
				},
				{
					title: 'Reports',
					icon: 'bi-bar-chart-line-fill',
					url: '/magento/report/items',
					type: 'external'
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

						<RouterLink class="navbar-brand d-flex align-items-center text-dark text-decoration-none" to="/">
							<img class="pe-2" src="https://cdn.globalhealing.com/web/img/vendor/pr/pr-logo.png?w=80" width="40" alt="">
						</RouterLink>

						<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
							<span class="navbar-toggler-icon"></span>
						</button>

						<div class="collapse navbar-collapse" id="navbarNav">
							<ul class="navbar-nav flex-fill justify-content-center gap-4">
								<li v-for="link in links" class="nav-item">
									<template v-if="link.type === 'external'">
										<a class="nav-link" :href="link.url"><i :class="link.icon"></i> {{ link.title }}</a>
									</template>
									<template v-if="link.type === 'vue'">
										<RouterLink class="nav-link" :to="link.url"><i :class="link.icon"></i> {{ link.title }}</RouterLink>
									</template>
								</li>
							</ul>
						</div>
						<div>
							<a class="nav-link" href="/logout"><i class="bi bi-door-closed"></i> Logout (admin)</a>
						</div>
					</div>
				</nav>
			</header>
		</div>
	</div>
</template>
<script setup>
</script>