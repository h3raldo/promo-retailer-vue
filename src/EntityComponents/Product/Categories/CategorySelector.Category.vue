<script setup>
import Category from "@/EntityComponents/Product/Categories/CategorySelector.Category.vue";
</script>
<script>
export default {
	data() {
		return {}
	},
	props: ['category', 'selected', 'tree'],
	inject: [],
	methods: {}
}
</script>
<template>
	<template v-if="category.children && category.children.length">

		<details class="border-bottom pb-1 mb-1">
			<summary>
				<label class="form-check-label"><input class="form-check-input me-1" type="checkbox" v-model="selected.categories" :value="category">
					{{ category.name }}
					<span class="badge text-bg-light">{{ category.count }} Products</span>
				</label>
			</summary>

			<div class="ps-4 pt-1">
				<Category v-for="child in category.children" :category="child" :selected="selected" :tree="tree" />
			</div>
		</details>

	</template>


	<template v-else>
		<div class="border-bottom pb-1 mb-1">
			<label class="form-check-label"><input class="form-check-input me-1" type="checkbox" v-model="selected.categories" :value="category">
				{{ category.name }}
				<span class="badge text-bg-light">{{ category.count }} Products</span>
			</label>
		</div>
	</template>
</template>
