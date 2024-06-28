<script setup>
import Loader from "@/components/globals/Loader.vue";
import Search from "@/Views/PurchaseOrders/Search.vue";
import Totals from "@/Views/PurchaseOrders/Totals.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>

<script>
import utils from "@/js/utils.js";
export default {
	inject: ['symfony', 'search'],
	data(){
		return {
			data: {},
			loading: true,
		}
	},
	computed: {
		searchState(){
			if( typeof this.search.purchase_orders === 'undefined' ) this.search.purchase_orders = {}
			return this.search.purchase_orders;
		}
	},
	methods: {
		get( params ){
			if( params )
				this.searchState.urlParams = params;
			else if( this.searchState.urlParams )
				params = this.searchState.urlParams;
			else
				params = ''

			let self = this;
			let url = self.symfony.api.purchase_orders.search+'?' + params ?? ''

			self.loading = true;
			utils.ajax(url, (response) => {
				self.search.purchase_orders = response.search;
				self.search.purchase_orders.urlParams = params;
				self.data = response;
				self.loading = false;
			})
		},
		getDeleteUrl( id )
		{
			return this.symfony.api.purchase_orders.order.delete.replace(':id', id);
		},
		viewSingle( id ){
			this.$router.push( this.symfony.views.purchase_orders_purchase_order.replace(':id', id) )
		},
		formatPricing( price ){
			return utils.pricing.format(price);
		},
		getStatusColor( status ){
			let statuses = {
				sent: 'primary',
				confirmed: 'primary',
				closed: 'success',
				complete: 'success',
			}

			let className = 'secondary';
			if( statuses[status] ) className = statuses[status];

			return `badge text-bg-${className}`;
		}
	},
	mounted() {
		if( this.data.length > 0 ) return;
		this.get()
	}
}
</script>

<template>

	<Search :getEntities="get" :searchParams="searchState" />

	<br>

	<Loader v-if="loading" :align="'center'" />

	<table class="table align-middle table-hover" v-if="data.totals">
		<thead>
		<tr>
			<th style="width: 5%">ID</th>
			<th>SO#</th>
			<th>Status</th>
			<th>Title</th>
<!--			<th>Client</th>-->
			<th>In-Hands</th>
			<th style="width: 20%">Events</th>
<!--			<th>Created</th>-->
			<th style="width: 100px">Total</th>
			<th style="width: 90px"></th>
		</tr>
		</thead>
		<tbody>
		<template v-for="quote in data.entities">
			<tr class="quote-row">
				<td @click="viewSingle(quote.id)">{{ quote.id }}</td>
				<td @click="viewSingle(quote.id)">#{{ quote.reference_number }}</td>
				<td @click="viewSingle(quote.id)">
					<span :class="getStatusColor(quote.status)">
						{{ quote.status }}
					</span>
				</td>

				<td @click="viewSingle(quote.id)">
					<span class="badge text-bg-secondary rounded-pill">{{ quote.vendor }}</span>

					<span class="d-block">
						{{ quote.title }}
					</span>

					<span v-if="quote.reference_order && quote.reference_order.client" class="d-block">
						{{ quote.reference_order.client }}
					</span>

				</td>
<!--
				<td @click="viewSingle(quote.id)">
					<span v-if="quote.reference_order && quote.reference_order.client" class="d-block">
						{{ quote.reference_order.client }}
					</span>
				</td>-->

				<td>{{ quote.deliver_by }}</td>
				<td>
					<details class=" p-1 mb-1" v-for="event in quote.events">
						<summary style="text-transform: capitalize">{{ event.type }}: {{event.date}}</summary>
						{{event.note}}
					</details>
				</td>

<!--				<td @click="viewSingle(quote.id)">{{ quote.created }}</td>-->
				<td @click="viewSingle(quote.id)">{{ formatPricing(quote.total) }}</td>
				<td class="delete text-end">
<!--					<a class="btn btn-outline-primary me-1" :href="getDuplicateUrl(quote.id)"><i class="bi bi-copy"></i></a>-->

					<Modal :id="'deletePO-'+quote.id" :title="'Are you sure?'"  :icon="'bi-trash'" :buttonClasses="'btn btn-danger'">
						<p>Will be deleted permanently. Cannot be undone.</p>
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