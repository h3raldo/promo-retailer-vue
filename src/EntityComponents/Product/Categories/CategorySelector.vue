<script setup>
import Modal from "@/components/globals/bootstrap/Modal.vue";
import Category from "@/EntityComponents/Product/Categories/CategorySelector.Category.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			selected: {
				categories: []
			},
			categories: [],
		}
	},
	props: ['onSelect', 'preloaded'],
	inject: ['symfony'],
	methods: {
		done(){
			this.onSelect(this.selected);
			this.selected.categories.length = 0;
		},
		addPathToCategories(){
			function addPath(category, path){
				category.path = path;
				if( category.children && category.children.length ){
					category.children.forEach( child => {
						addPath(child, path + category.name + ' > ');
					})
				}
			}
			this.categories.forEach( category => {
				addPath(category, '');
			})
		}
	},
	created(){
		if( this.preloaded && this.preloaded.length )
			this.categories = this.preloaded
		else
			utils.ajax(this.symfony.api.products.categories.counts, (d) => {
				this.categories = d;
				this.addPathToCategories();
			})
	}
}
</script>
<template>
	<Category v-for="(category, i) in categories" :category="category" :selected="selected" />
	<div class="pt-4 pb-3 text-center">
		<button class="btn btn-primary" @click="done">Add Selected Categories</button>
	</div>
</template>
