<script setup>
	import Loader from "@/components/globals/Loader.vue";
	import Modal from "@/components/globals/bootstrap/Modal.vue";
	import Search from "@/Views/Orders/Search.vue";
</script>

<script>
import utils from "@/js/utils.js";
export default {
	data() {
		return {
			loading: true,
			quotes: {},
		}
	},

	inject: ['symfony', 'search'],

	computed: {
		searchState(){
			if( typeof this.search.orders === 'undefined' ) this.search.orders = {}
			return this.search.orders;
		}
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
		getEntities( params ){
			if( params )
				this.searchState.urlParams = params;
			else if( this.searchState.urlParams )
				params = this.searchState.urlParams;
			else
				params = ''

			let self = this;
			let url = this.symfony.orders.search +'?' + params ?? ''

			self.loading = true;
			utils.ajax(url, (data) => {
				self.search.orders = data.search;
				self.search.orders.urlParams = params;
				self.quotes = data;
				self.loading = false;
			})
		},
		getStatusColor( status ){
			let statuses = {
				sent: 'primary',
				pushed: 'success'
			}

			let className = 'secondary';
			if( statuses[status] ) className = statuses[status];

			return `badge text-bg-${className}`;
		}
	},

	created() {

	},

	mounted() {
		if( this.quotes.length > 0 ) return;
		this.getEntities()
	}
}
</script>

<template>
	<Search :getEntities="getEntities" :searchParams="searchState" />

	<br>

	<Loader v-if="loading" :align="'center'" />

	<table class="table align-middle table-hover" v-if="quotes.totals">
		<thead>
		<tr>
<!--			<th style="width: 5%">ID</th>-->
<!--			<th>Author</th>-->
			<th>Status</th>
			<th>Reference Number</th>
			<th>Client</th>
			<th style="width: 9%">Order Date</th>
			<th style="width: 9%">Origin Date</th>
			<th>Totals</th>
			<th>Total</th>
			<th>Profit</th>
			<th style="width: 50px">Margin</th>
			<th style="width: 120px"></th>
		</tr>
		</thead>
		<tbody>
		<template v-for="quote in quotes.results">
		<tr class="quote-row">
			<td @click="viewQuote(quote.id)">
				<span :class="getStatusColor(quote.status)">
					{{ quote.status }}
				</span>
			</td>
			<td @click="viewQuote(quote.id)">
				<span :class="'fw-normal badge source-'+quote.source">{{ quote.source.charAt(0).toUpperCase() }}</span>
				{{ quote.reference_number }}
			</td>
<!--			<td @click="viewQuote(quote.id)">{{ quote.id }}</td>-->
<!--			<td @click="viewQuote(quote.id)">{{ quote.author }}</td>-->
			<td @click="viewQuote(quote.id)">
				{{ quote.client }}
			</td>
			<td @click="viewQuote(quote.id)">{{ quote.created }}</td>
			<td @click="viewQuote(quote.id)">{{ quote.date }}</td>
			<td @click="viewQuote(quote.id)">{{ formatPricing(quote.total_cost) }}</td>
			<td @click="viewQuote(quote.id)">{{ formatPricing(quote.total) }}</td>
			<td @click="viewQuote(quote.id)">{{ formatPricing(quote.profit) }}</td>
			<td @click="viewQuote(quote.id)">{{ quote.margin }}%</td>
			<td class="delete text-end">
				<a class="btn btn-outline-primary me-1" :href="getDuplicateUrl(quote.id)"><i class="bi bi-copy"></i></a>

				<Modal :id="'deleteQuote-'+quote.id" :title="'Are you sure?'"  :icon="'bi-trash'" :buttonClasses="'btn btn-danger'">
					<p>Quote will be deleted permanently. Cannot be undone.</p>
					<a class="btn btn-danger" :href="getDeleteUrl(quote.id)"><i class="bi bi-trash"></i> DELETE</a>
				</Modal>
			</td>
		</tr>
		</template>
		</tbody>
		<tfoot>
		<tr>
			<th colspan="999" class="text-end">

				<table class="float-end">
					<tr>
						<td class="pe-3">Total:</td>
						<td class="text-start">{{ formatPricing(quotes.totals.total) }}</td>
					</tr>
					<tr class="text-warning">
						<td class="pe-3">Cost:</td>
						<td class="text-start">{{ formatPricing(quotes.totals.cost) }}</td>
					</tr>
					<tr class="text-success">
						<td class="pe-3">Profit:</td>
						<td class="text-start">{{ formatPricing(quotes.totals.profit) }}</td>
					</tr>
					<tr>
						<td class="pe-3">Margin:</td>
						<td class="text-start">{{ quotes.totals.margin }}%</td>
					</tr>
				</table>
			</th>
		</tr>
		</tfoot>
	</table>

</template>
<style scoped>
tr{
	cursor: pointer;
}
.source-magento{
	background-color: #f46f25;
}
.source-quote{
	background-color: green;
}
</style>