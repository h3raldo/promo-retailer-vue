<script setup>
</script>
<script>
export default {
	data() {
		return {
			current: {},
			shouldShowChildren: true,
		}
	},
	props: ['categories', 'editCategory'],
	inject: [],
	methods: {
		setActive(category){
			if( !category.isActive )
				this.shouldShowChildren = category !== this.current;
			else
				this.shouldShowChildren = true;

			this.editCategory(category);
			this.current = category;
		},
	},
	watch: {
		categories(){
			if( this.categories.filter(category => category.isActive).length === 0) this.current = {};
		}
	},
	mounted() {
		let actives = this.categories.filter(category => category.isActive);
		if(actives.length > 1) this.current = actives[0];
	}
}
</script>
<template>
	<div class="d-flex  flex-wrap bg-light px-2 pt-2">
		<template v-for="category in categories">
			<button v-if="category.rules.length" class="btn btn-sm d-flex align-items-end gap-2 mb-2" :class="{'btn-light' : !category === current, 'btn-secondary': (category === current || category.isActive) }" @click="setActive(category)">
				<span class="mb-0 text-nowrap">{{ category.name }}</span>
			</button>
		</template>
	</div>
	<template v-if="current && current.children && shouldShowChildren">
		<div class="text-center">
			<i class="bi bi-chevron-down"></i>
		</div>
		<Categories :categories="current.children" :editCategory="editCategory"  />
	</template>
</template>
