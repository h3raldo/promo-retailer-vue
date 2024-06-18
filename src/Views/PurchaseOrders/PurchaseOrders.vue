<script setup>
import Loader from "@/components/globals/Loader.vue";
import Search from "@/Views/PurchaseOrders/Search.vue";
import Totals from "@/Views/PurchaseOrders/Totals.vue";
</script>

<script>
import utils from "@/js/utils.js";
export default {
	inject: ['symfony'],
	data(){
		return {
			data: {},
			loading: true,
		}
	},
	methods: {
		get( params ){
			let self = this;
			if( !params ) params = '';

			let url = self.symfony.api.purchase_orders.search+'?' + params ?? ''

			self.loading = true;
			utils.ajax(url, (response) => {
				self.data = response;
				self.loading = false;
			})
		},
		viewSingle( id ){
			this.$router.push( this.symfony.views.purchase_orders_purchase_order.replace(':id', id) )
		},
		formatPricing( price ){
			return utils.pricing.format(price);
		}
	},
	mounted() {
		if( this.data.length > 0 ) return;
		this.get()
	}
}
</script>

<template>

	<Search :getEntities="get" :searchParams="{}" />

	<br>

	<Loader v-if="loading" :align="'center'" />

	<table class="table align-middle table-hover" v-if="data.totals">
		<thead>
		<tr>
			<th style="width: 5%">ID</th>
			<th>Status</th>
			<th>Vendor</th>
			<th>In-Hands</th>
			<th>Follow-Up</th>
			<th>Note</th>
<!--			<th>Created</th>-->
			<th>Total</th>
			<th style="width: 120px"></th>
		</tr>
		</thead>
		<tbody>
		<template v-for="quote in data.entities">
			<tr class="quote-row">
				<td @click="viewSingle(quote.id)">{{ quote.id }}</td>
				<td @click="viewSingle(quote.id)">{{ quote.status }}</td>
				<td @click="viewSingle(quote.id)">{{ quote.vendor }}</td>
				<template v-if="quote.data && JSON.parse(quote.data).po">
				<td>{{ JSON.parse(quote.data).po.info.deliver_by }}</td>
				<td>{{ JSON.parse(quote.data).po.info.follow_up_date }}</td>
				<td>{{ JSON.parse(quote.data).po.info.follow_up_note }}</td>
				</template>
				<template v-else>
					<td></td>
					<td></td>
					<td></td>
				</template>
<!--				<td @click="viewSingle(quote.id)">{{ quote.created }}</td>-->
				<td @click="viewSingle(quote.id)">{{ formatPricing(quote.total) }}</td>
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
				</table>
			</th>
		</tr>
		</tfoot>
	</table>
</template>