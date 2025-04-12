<script setup>
import "@/Views/Websites/Website/View/Rules/Category.vue";
</script>
<script>
export default {
	data() {
		return {
			breadcrumbs: [],
			active: false,
		}
	},
	props: ['category', 'parents', 'editCategory', 'top'],
	inject: ['products'],
	methods: {
		getBackground(){
			return this.category.isActive ? 'btn-secondary' : 'btn-light'
		}
	},
	created(){
		let parents = this.parents ?? [];
		parents.forEach( p => this.breadcrumbs.push(p));
		this.breadcrumbs.push(this.category.name);
	}
}
</script>
<template>
	<template v-if="category.rules.length">

		<template v-if="(category.children && category.children.length) || top">

			<button class="btn btn-sm d-flex align-items-end gap-2 mb-2 mt-2" :class="getBackground()" @click="editCategory(category)">
				<span class="mb-0 text-nowrap">{{ category.name }}</span>
			</button>

			<template v-if="category.isActive">
				<Teleport to="#category-children">
					<Category v-for="child in category.children" :category="child" :parents="breadcrumbs" :editCategory="editCategory" />
				</Teleport>
			</template>

<!--			<div class="ps-3 pt-1">-->
<!-- <Category v-for="child in category.children" :category="child" :parents="breadcrumbs" :editCategory="editCategory" /> -->
<!--			</div>-->
		</template>

		<template v-else>
			<div class="pb-1 mb-1">
				<button class="btn d-flex gap-2 align-items-end" :class="getBackground()" @click="editCategory(category)">
					<span class="text-nowrap">{{ category.name }}</span>
					<small class="text-nowrap">({{ category.rules.length }} Items)</small>
				</button>
			</div>
		</template>

	</template>
</template>
