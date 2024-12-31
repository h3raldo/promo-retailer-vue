<script setup>
import Category from "@/Views/Config/Section/Categories/Category.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {}
	},
	props: ['category', 'isUnique', 'index', 'categories'],
	inject: [],
	computed: {
		categoryClasses(){
			return 'form-control ' + ( this.isUnique( this.category.handle) ? '' : 'is-invalid')
		}
	},
	methods: {
		add(){
			let self = this;
			self.category.children.push( {
				name: "New Category",
				handle: self.category.handle + "-new-category",
				children: []
			} );
		},
		remove(i){
			this.categories.splice( i, 1 );
		},
		move(direction, currentIndex, array){
			utils.array.move( direction, currentIndex, array );
		}
	}
}
</script>
<template>
	<div>

		<details class="mb-2">
			<summary class="">
				{{ category.name }}
				<button class="btn btn-outline-secondary btn-sm me-2" @click="move('up', index, categories)"><i class="bi bi-arrow-up-short"></i></button>
				<button class="btn btn-outline-secondary btn-sm me-2" @click="move('down', index, categories)"><i class="bi bi-arrow-down-short"></i></button>
				<button class="btn btn-outline-danger btn-sm" @click="remove(index, categories)"><i class="bi bi-x"></i></button>
			</summary>

			<div class="ps-3 pt-2 pb-2 border-start">
				<div class="row mb-3">
					<div class="col">
						<div class="form-floating">
							<input class="form-control" type="text" v-model="category.name" placeholder="Category Name">
							<label>Category Name</label>
						</div>
					</div>
					<div class="col">
						<div class="form-floating">
							<input :class="categoryClasses" type="text" v-model="category.handle" placeholder="Category ID" >
							<div class="invalid-feedback">
								ID must be unique
							</div>
							<label>Category ID</label>
						</div>
					</div>
				</div>

				<div v-if="category.children && category.children.length">
					<Category v-for="(child, i) in category.children" :category="child" :isUnique="isUnique" :index="i" :categories="category.children" />
				</div>

				<div class="mt-3">
					<button class="btn btn-primary" @click="add">
						Add Child Under "{{ category.name }}"
					</button>
				</div>
			</div>

		</details>

	</div>
</template>
