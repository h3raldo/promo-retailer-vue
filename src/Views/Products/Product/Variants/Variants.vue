<script setup>
import Generator from "@/Views/Products/Product/Variants/Generator.vue";
import BulkEdit from "@/Views/Products/Product/Variants/BulkEdit.vue";
import VariantsVariant from "@/Views/Products/Product/Variants/Variants.Variant.vue";
</script>
<script>
import entity from "@/js/entity.js";

export default {
	data(){
		return {

		}
	},
	props: [],
	inject: ['variants', 'product', 'returnToModal'],
	computed: {

	},
	methods: {
		create(){
			this.variants.push(entity.product.variant.create())
		},
		removeVariant( index )
		{
			let variant = this.variants[index];

			if( variant.id )
				variant.status = 'delete';
			else
				this.variants.splice( index, 1 );
		}
	},

	mounted(){
	},
}
</script>
<template>
	<div>

		<Generator />
		<BulkEdit />


		<table class="table">

			<thead>
			<tr>
				<th style="width: 75px"></th>
				<th>ID</th>
				<th class="col-3">Color</th>
				<th>Size</th>
				<th>Cost</th>
				<th>Status</th>
				<th></th>
				<th class="col-1"></th>
			</tr>
			</thead>

			<tbody>
				<VariantsVariant v-for="(variant, vi) in variants" :key="vi" :variant="variant" :vi="vi" :remove="removeVariant" :product="product" :returnToModal="returnToModal" />
			</tbody>
		</table>

		<div class="mt-3">
			<button class="btn btn-primary" @click="create">Add New Variant</button>
		</div>
	</div>
</template>
<style>
.to-delete
{
	opacity: 0.2;
	text-decoration: line-through;
}
</style>
