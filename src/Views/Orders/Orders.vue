<script setup>
	import Loader from "@/components/globals/Loader.vue";
	import Modal from "@/components/globals/bootstrap/Modal.vue";
	import Search from "@/Views/Orders/Search.vue";
	import Grid from "@/components/globals/Grid.vue";
</script>

<script>
import utils from "@/js/utils.js";
export default {
	data() {
		return {
			loading: false,
			columns: {
				'ID': { id: 'id' },
				'Status': { id: 'status' },
				'Pushed Date': { id: 'date' },
				// 'Reference Number': { id: 'reference_number' },
				'Origin/Client': { id: 'client' },
				'Ship By': { id: 'date_ship_by' },
				'In-Hands': { id: 'date_deliver_by' },
				'Total': { id: 'total' },
				'Profit': { id: 'total_profit'  },
				'Margin': { id: 'total_margin' }
			},
			quotes: {},
		}
	},

	inject: ['symfony', 'search'],

	computed: {
		searchState(){
			return this.search.orders;
		},
		exportLink(){
			let params = '';

			if( this.searchState.urlParams )
				params = this.searchState.urlParams;

			return this.symfony.api.orders.export +'?' + params ?? ''
		},
	},

	methods: {
		formatPricing(price){
			return utils.pricing.format(price);
		},
		viewQuote( id ){
			this.$router.push( this.symfony.views.orders_order.replace(':id', id) );
		},
		getDuplicateUrl( id )
		{
			return this.symfony.orders.order.duplicate.replace(':id', id);
		},
		getDeleteUrl( id )
		{
			return this.symfony.orders.order.delete.replace(':id', id);
		},
		getStatusColor( status ){
			let statuses = {
				sent: 'primary',
				confirmed: 'primary',
				complete: 'success',
			}

			let className = 'secondary';
			if( statuses[status] ) className = statuses[status];

			return `badge text-bg-${className}`;
		},
	},

	created() {
		if( typeof this.search.orders === 'undefined' ) this.search.orders = {}
	},
}
</script>

<template>

	<Grid :api="symfony.orders.search" :columns="columns" :searchState="searchState">

		<template #header="{search}">
			<Search :getEntities="search" :searchParams="searchState" />
		</template>

		<template #item="{item}">
			<tr class="quote-row">

				<td @click="viewQuote(item.id)">{{ item.id }}</td>

				<td @click="viewQuote(item.id)">
					<span :class="getStatusColor(item.status)">
						{{ item.status }}
					</span>
				</td>

				<td @click="viewQuote(item.id)">{{ item.date }}</td>

				<td @click="viewQuote(item.id)">
					<span class="d-block">
						<span :class="'fw-normal badge source-'+item.source">
							{{ item.source.charAt(0).toUpperCase() }} -
							{{ item.reference_number || '' }}
						</span>
					</span>
					{{ item.client }}
				</td>

				<td @click="viewQuote(item.id)">{{ item.ship_by || '-' }}</td>
				<td @click="viewQuote(item.id)">{{ item.deliver_by || '-' }}</td>
				<td @click="viewQuote(item.id)">{{ formatPricing(item.total) }}</td>
				<td @click="viewQuote(item.id)">{{ formatPricing(item.profit) }}</td>
				<td @click="viewQuote(item.id)">{{ item.margin }}%</td>

				<td class="delete text-end">
					<a class="btn btn-outline-primary me-1" :href="getDuplicateUrl(item.id)"><i class="bi bi-copy"></i></a>
					<Modal :id="'deleteQuote-'+item.id" :title="'Are you sure?'"  :icon="'bi-trash'" :buttonClasses="'btn btn-danger'">
						<p>Quote will be deleted permanently. Cannot be undone.</p>
						<a class="btn btn-danger" :href="getDeleteUrl(item.id)"><i class="bi bi-trash"></i> DELETE</a>
					</Modal>
				</td>

			</tr>
		</template>

		<template #footer="{response}">
			<tr v-if="response && response.totals">
				<th colspan="999" class="text-end">

					<table class="float-end">
						<tr>
							<td class="pe-3">Total:</td>
							<td class="text-start">{{ formatPricing(response.totals.total) }}</td>
						</tr>
						<tr class="text-warning">
							<td class="pe-3">Cost:</td>
							<td class="text-start">{{ formatPricing(response.totals.cost) }}</td>
						</tr>
						<tr class="text-success">
							<td class="pe-3">Profit:</td>
							<td class="text-start">{{ formatPricing(response.totals.profit) }}</td>
						</tr>
						<tr>
							<td class="pe-3">Margin:</td>
							<td class="text-start">{{ response.totals.margin }}%</td>
						</tr>
					</table>

				</th>
			</tr>
		</template>
	</Grid>

	<div class="text-center">
		<a class="btn btn-outline-primary" :href="exportLink" target="_blank">Export to CSV</a>
	</div>

</template>
<style>
tr{
	cursor: pointer;
}
.source-magento{
	background-color: #f46f25;
}
.source-quote{
	background-color: green;
}
.source-order{
	background-color: blue;
}
</style>