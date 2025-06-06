<script setup>
import Category from "@/Views/Products/Product/Categories.Category.vue";
</script>
<script>
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			loading: false,
			categories: [],
			remoteCategories: []
		}
	},
	props: [],
	inject: ['product', 'config'],
	computed: {
		allCategories(){
			if( this.config?.categories ) return this.config.categories;
			return this.remoteCategories;
		}
	},
	methods: {
		updated(){
			entity.product.categories.verifySelected( this.product.categories, this.categories );
		}
	},
	watch: {
		'product.categories'(){
			this.updated();
		}
	},
	mounted(){
		if( this.config?.categories ) return;

		let self = this;
		self.loading = true;

		utils.config.get.globalCategories( (response) => {
			self.loading = false;

			if( !response ) return;
			self.remoteCategories = response;

			self.updated();
		} )
	}
}
</script>
<template>
<div>
	<Category v-for="category in allCategories" :product="product" :category="category" />
</div>
</template>
