<script setup>
import "@/Views/Websites/Website/View/Rules/Category.vue";
</script>
<script>
export default {
	data() {
		return {}
	},
	props: ['category'],
	inject: [],
	methods: {}
}
</script>
<template>
	<template v-if="category.products.length">

		<template v-if="category.children && category.children.length">
			<details class="border-bottom pb-1 mb-1">
				<summary>
					{{ category.name }} <span class="badge text-bg-light">{{ category.products.length }} Product(s)</span>
				</summary>

				<div class="ps-3 pt-1 mb-1">
					<details>
						<summary class="badge text-bg-secondary">View Products</summary>

						<div>
							<div v-for="product in category.products">
								- {{ product.name }}
							</div>
						</div>
					</details>
				</div>

				<div class="ps-4 pt-1">
					<Category v-for="child in category.children" :category="child" />
				</div>
			</details>
		</template>

		<template v-else>
			<div class="border-bottom pb-1 mb-1">
				{{ category.name }} <span class="badge text-bg-light">{{ category.products.length }} Product(s)</span>

				<div class="pt-1 mb-1">
					<details>
						<summary class="badge text-bg-secondary">View Products</summary>

						<div>
							<div v-for="product in category.products">
								- {{ product.name }}
							</div>
						</div>
					</details>
				</div>
			</div>
		</template>

	</template>
</template>
