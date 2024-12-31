<script setup>
import Loader from "@/components/globals/Loader.vue";
import Category from "@/Views/Config/Section/Categories/Category.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			categories: [],
			loading: false,
		}
	},
	props: [],
	inject: ['symfony', 'alert'],
	computed:{
		categoryIDs(){
			let ids = [];

			function traverse( category ){
				ids.push( category.handle );

				if( category.children && category.children.length ){
					category.children.forEach( (child) => {
						traverse( child );
					} );
				}
				return ids;
			}

			this.categories.forEach( (category) => traverse(category) )

			return ids;
		}
	},
	methods: {
		save(){
			let self = this;

			function success( response ){
				self.saving = false;
				self.alert('Saved!');
			}

			function error( response ){
				self.saving = false;
				self.alert('Error saving, see console.!', 'danger');
			}

			let data = {
				path: utils.config.keys.globalCategories,
				value: self.categories
			}

			this.saving = true;
			utils.ajax(this.symfony.api.config.save, success, error, data );
		},

		retrieve(){
			let self = this;
			self.loading = true;

			utils.config.get.globalCategories( (response) => {
				self.loading = false;

				if( !response ) return;
				self.categories = response;
			} )
		},

		addRootCategory(){
			let self = this;
			self.categories.push( {
				name: 'New Root Category',
				handle: 'new-root-category',
				children: []
			} );
			self.save();
		},

		checkIfUnique( id ){
			return this.categoryIDs.filter( (category) => category === id ).length <= 1;
		},
	},
	mounted() {
		this.retrieve();
	}
}
</script>
<template>

	<div class="d-flex justify-content-between">
		<div>
			<h2>Global Categories</h2>
			<p>This will only affect the global product categorization and websites that rely on the default categories.</p>
		</div>
		<div>
			<button class="btn btn-primary p-3" @click="save" :disabled="loading"><i class="bi bi-floppy-fill"></i> Save</button>
		</div>
	</div>

	<Loader v-if="loading" />

	<div v-else>
		<Category v-for="(category, i) in categories" :category="category" :isUnique="checkIfUnique" :index="i" :categories="categories" />

		<div class="pt-3">
			<div class="btn btn-primary" @click="addRootCategory">Add Root Category</div>
		</div>
	</div>

</template>
