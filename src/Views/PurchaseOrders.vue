<script setup>
import Loader from "@/components/globals/Loader.vue";
import Search from "@/ViewComponents/PurchaseOrders/Search.vue";
</script>

<script>
import utils from "@/js/utils.js";
export default {
	data() {
		return {
			loading: true,
			data: {},
		}
	},

	inject: ['symfony'],

	methods: {
		formatPricing(price){
			return utils.pricing.format(price);
		},
		viewSingle( id ){
			this.$router.push( this.symfony.views.purchase_orders_purchase_order.replace(':id', id) )
		},
		get( params ){
			let self = this;
			if( !params ) params = '';

			let url = this.symfony.purchase_orders.search+'?' + params ?? ''

			self.loading = true;
			utils.ajax(url, (data) => {
				self.data = data;
				self.loading = false;
			})
		}
	},

	created() {

	},

	mounted() {
		if( this.data.length > 0 ) return;
		this.get()
	}
}
</script>

<template>

	<Search :getEntities="get" />

	<br>

	<Loader v-if="loading" :align="'center'" />

	<table class="table align-middle table-hover" v-if="data.totals">
		<thead>
		<tr>
			<th style="width: 5%">ID</th>
			<th>Status</th>
			<th>Vendor</th>
			<th>Created</th>
			<th>Totals</th>
			<th>Total</th>
			<th>Profit</th>
			<th style="width: 50px">Margin</th>
			<th style="width: 120px"></th>
		</tr>
		</thead>
		<tbody>
		<template v-for="quote in data.entities">
			<tr class="quote-row">
				<td @click="viewSingle(quote.id)">{{ quote.id }}</td>
				<td @click="viewSingle(quote.id)">{{ quote.status }}</td>
				<td @click="viewSingle(quote.id)">{{ quote.vendor }}</td>
				<td @click="viewSingle(quote.id)">{{ quote.created }}</td>
				<td @click="viewSingle(quote.id)">{{ formatPricing(quote.total_cost) }}</td>
				<td @click="viewSingle(quote.id)">{{ formatPricing(quote.total) }}</td>
				<td @click="viewSingle(quote.id)">{{ formatPricing(quote.profit) }}</td>
				<td @click="viewSingle(quote.id)">{{ quote.margin }}%</td>
				<td class="delete text-end"></td>
			</tr>
		</template>
		</tbody>
		<tfoot>
		<tr>
			<th colspan="999" class="text-end">

				<table class="float-end">
					<tr>
						<td class="pe-3">Total:</td>
						<td class="text-start">{{ formatPricing(data.totals.total) }}</td>
					</tr>
					<tr class="text-warning">
						<td class="pe-3">Cost:</td>
						<td class="text-start">{{ formatPricing(data.totals.cost) }}</td>
					</tr>
					<tr class="text-success">
						<td class="pe-3">Profit:</td>
						<td class="text-start">{{ formatPricing(data.totals.profit) }}</td>
					</tr>
					<tr>
						<td class="pe-3">Margin:</td>
						<td class="text-start">{{ data.totals.margin }}%</td>
					</tr>
				</table>
			</th>
		</tr>
		</tfoot>
	</table>
</template>