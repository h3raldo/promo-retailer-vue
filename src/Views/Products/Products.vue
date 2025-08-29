<script setup>
	import Grid from "@/components/globals/Grid.vue";
	import Search from "@/Views/Products/Search.vue";
	import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>
<script>

import utils from "@/js/utils.js";

export default {
	data(){
		return {
			loading: {
				create: false,
				duplicate: false,
			},
			columns: {
				'ID': { id: 'id' },
				'Status': { id: 'status' },
				'Sku': { id: 'sku' },
				'Name': { id: 'name' },
				'Avg Weight': { },
				'Supplier': { },
			},
		}
	},
	inject: ['symfony', 'search', 'alert'],
	computed: {
		searchState(){
			return this.search.products;
		},
	},
	methods: {
		viewSingle( id ){
			this.$router.push( this.symfony.views.products_product.replace(':id', id) )
		},
		createNew()
		{
			let self = this;

			self.loading.create = true;
			utils.ajax( this.symfony.api.products.product.create, (data) => {

				self.loading.create = false;

				if( data.error === true || !data.id ){
					self.alert(data.message, 'danger');
					return;
				}

				self.$router.push( self.symfony.views.products_product.replace(':id', data.id) )

			}, (error) => {
				self.alert('Error creating', 'danger');
			})
		},
		async duplicate(id)
		{
			this.loading.duplicate = true;
			let res = await utils.ajaxAsync( this.symfony.api.products.product.duplicate, { id }, 'POST')
			this.loading.duplicate = false;

			if( res.error === true || !res.entity.product.id ){
				self.alert(res.message, 'danger');
				return;
			}

			self.$router.push( self.symfony.views.products_product.replace(':id', res.entity.product.id) )
		},
	},
	created() {
		if( typeof this.search.products === 'undefined' ) this.search.products = {}
	},
}
</script>

<template>

	<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center">
		<div>
			<h3 class="mb-0"><i class="bi bi-box-seam"></i> Products</h3>
		</div>
		<button class="btn btn-primary p-3" @click="createNew" :disabled="loading.create"><i class="bi bi-plus-square-fill"></i> Create New</button>
	</div>

	<Grid :api="symfony.api.products.search" :columns="columns" :searchState="searchState" :entity="'website'">
		<template #header="{search}">
			<Search :getEntities="search" :searchParams="searchState" />
		</template>

		<template #item="{item}">
			<td @click="viewSingle(item.id)">{{ item.id }}</td>
			<td @click="viewSingle(item.id)">
				{{ item.status }}
			</td>
			<td @click="viewSingle(item.id)">
				{{ item.sku }}
			</td>
			<td @click="viewSingle(item.id)">
				{{ item.name }}
			</td>
			<td @click="viewSingle(item.id)">
				{{ item.average_weight }}
			</td>
			<td @click="viewSingle(item.id)">
				{{ item.company.name }}
			</td>
			<td>
				<button class="btn btn-outline-primary" @click="duplicate"><i class="bi bi-copy"></i></button>
			</td>
		</template>
	</Grid>

</template>
