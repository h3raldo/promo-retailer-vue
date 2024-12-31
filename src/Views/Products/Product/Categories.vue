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
		}
	},
	props: [],
	inject: ['product'],
	computed: {
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
		let self = this;
		self.loading = true;

		utils.config.get.globalCategories( (response) => {
			self.loading = false;

			if( !response ) return;
			self.categories = response;

			self.updated();
		} )
	}
}
</script>
<template>
<div>
	<Category v-for="category in categories" :product="product" :category="category" />
</div>
</template>
