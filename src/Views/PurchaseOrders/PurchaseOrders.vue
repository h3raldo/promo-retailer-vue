<script setup>
import utils from "@/js/utils.js";
import { useRouter } from 'vue-router';
import { inject, ref, reactive, onMounted } from 'vue'
const router = useRouter();

let loading = ref(true);
let data = reactive({});

const symfony = inject('symfony').value;

function formatPricing(price){
	return utils.pricing.format(price);
}

function viewSingle( id ){
	router.push( symfony.views.purchase_orders_purchase_order.replace(':id', id) )
}

function get( params ){
	if( !params ) params = '';

	let url = symfony.purchase_orders.search+'?' + params ?? ''

	loading.value = true;
	utils.ajax(url, (response) => {
		data = response;
		loading.value = false;
	})
}

onMounted(() => {
	if( data.length > 0 ) return;
	get()
})

import Loader from "@/components/globals/Loader.vue";
import Search from "@/Views/PurchaseOrders/Search.vue";
import Totals from "@/Views/PurchaseOrders/Totals.vue";
</script>

<template>

	<Search :getEntities="get" />

	<br>

	<Loader v-if="loading" :align="'center'" />

	<Totals v-if="data.totals" :totals="data.totals" />

	<table class="table align-middle table-hover" v-if="data.totals">
		<thead>
		<tr>
			<th style="width: 5%">ID</th>
			<th>Status</th>
			<th>Vendor</th>
			<th>Created</th>
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
				<td @click="viewSingle(quote.id)">{{ quote.created }}</td>
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