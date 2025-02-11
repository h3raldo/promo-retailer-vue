<script setup>
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import utils from "@/js/utils.js";
export default {
	data(){
		return {
			loading: false,
			name: '',
			sku: '',
			results: [],
			results_sage: []
		}
	},
	inject: ['symfony'],
	props: ['selected', 'sage'],
	methods: {
		search(e){
			if( e ) e.preventDefault();

			let self = this;
			let url = this.symfony.api.products.search + '?name=' + encodeURIComponent( this.name );

			if( this.sage ) url += '&sage=true';
			if( this.sku ) url += '&sku=' + encodeURIComponent( this.sku );

			self.loading = true;
			utils.ajax( url, d => {
				self.results = d.results;
				self.results_sage = d.results_sage;
				self.loading = false;
			}, e => {
				self.loading = false;
			})
		},
	},
	mounted(){

	}
}
</script>
<template>

	<div>

		<form @submit="search">
			<div class="d-flex gap-2 mb-3">
				<div class="col">
					<input type="text" class="form-control" placeholder="Name" v-model="name">
				</div>
				<div class="col">
					<input type="text" class="form-control" placeholder="Item Number / SKU" v-model="sku">
				</div>
				<div class="">
					<button class="btn btn-outline-secondary" type="submit">Search</button>
				</div>
			</div>
		</form>

		<Loader v-if="loading" />

		<table v-if="!loading && (results.length || results_sage.length)" class="table">
			<thead>
			<tr>
				<th class="col-1"></th>
				<th></th>
				<th>SKU</th>
				<th>Name</th>
				<th>Supplier</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="product in results" class="align-middle">
				<td>
					<button class="btn btn-sm btn-primary" @click="selected(product)">Select</button>
				</td>
				<td>
					<a :href="product.thumbnail" target="_blank"><img width="50" :src="product.thumbnail" alt=""></a>
				</td>
				<td>
					{{ product.sku }}
				</td>
				<td class="align-middle">
					<span class="badge text-bg-success">PR</span> {{ product.name }}
				</td>
				<td>
					{{ product.company.name }}
				</td>
			</tr>

			<tr v-for="product in results_sage" class="align-middle">
				<td>
					<button class="btn btn-sm btn-primary" @click="selected(product)">+ Import</button>
				</td>
				<td>
					<a :href="product.thumbPic" target="_blank"><img width="50" :src="product.thumbPic" alt=""></a>
				</td>
				<td>
					{{ product.itemNum }}
				</td>
				<td class="align-middle">
					<span class="badge text-bg-secondary">Sage</span> {{ product.name }}
				</td>
				<td>
					{{ product.supplier }}
				</td>
			</tr>
			</tbody>
		</table>

	</div>


</template>