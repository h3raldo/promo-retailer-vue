<script setup>
import Category from "@/Views/Products/Product/Categories.Category.vue";
</script>
<script>
export default {
	data() {
		return {}
	},
	props: ['product', 'category'],
	inject: [],
	computed: {},
	methods: {
	}
}
</script>
<template>
<div>

	<template v-if="category.children && category.children.length">

		<details :open="product.categories.includes( category.handle )" class="border-bottom pb-1 mb-1">
			<summary>
					<label class="form-check-label"><input class="form-check-input me-1" type="checkbox" v-model="product.categories" :value="category.handle">
						{{ category.name }} <span class="badge text-bg-light">:{{ category.handle }}</span>
					</label>
			</summary>

			<div class="ps-4 pt-1">
				<Category v-for="child in category.children" :product="product" :category="child" />
			</div>
		</details>

	</template>


	<template v-else>
		<div class="border-bottom pb-1 mb-1">
			<label class="form-check-label"><input class="form-check-input me-1" type="checkbox" v-model="product.categories" :value="category.handle">
				{{ category.name }}  <span class="badge text-bg-light">:{{ category.handle }}</span>
			</label>
		</div>
	</template>

</div>
</template>
