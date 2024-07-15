<script setup>
import Loader from "@/components/globals/Loader.vue";
import Search from "@/Views/PurchaseOrders/Search.vue";
import Totals from "@/Views/PurchaseOrders/Totals.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import Grid from "@/components/globals/Grid.vue";
</script>

<script>
import utils from "@/js/utils.js";
export default {
	inject: ['symfony', 'search'],
	data(){
		return {
			data: {},
			loading: false,
			columns: {
				'ID': { id: 'id' },
				'SO#': {},
				'Status': { id: 'status' },
				'Date': { id: 'date_updated' },
				'Title': { },
				'Ship By': { id:'date_ship_by' },
				'In-Hands': { id: 'date_deliver_by' },
				// 'Events': { },
				'Total': { id: 'total' },
			},
		}
	},
	computed: {
		searchState(){
			return this.search.purchase_orders;
		}
	},
	methods: {
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
	created() {
		if( typeof this.search.purchase_orders === 'undefined' ) this.search.purchase_orders = {}
	},
}
</script>

<template>

	<Grid :api="symfony.api.purchase_orders.search" :columns="columns" :searchState="searchState">

		<template #header="{search}">
			<Search :getEntities="search" :searchParams="searchState" />
		</template>

		<template #item="{item}">
			<tr class="quote-row">
				<td @click="viewSingle(item.id)">{{ item.id }}</td>
				<td @click="viewSingle(item.id)">#{{ item.reference_number }}</td>
				<td @click="viewSingle(item.id)">
					<span :class="getStatusColor(item.status)">
						{{ item.status }}
					</span>
				</td>

				<td @click="viewSingle(item.id)">
					{{ item.updated }}
				</td>

				<td @click="viewSingle(item.id)">
					<span class="badge text-bg-secondary rounded-pill">{{ item.vendor }}</span>

					<span class="d-block">
						{{ item.title }}
					</span>

					<span v-if="item.reference_order && item.reference_order.client" class="d-block">
						{{ item.reference_order.client }}
					</span>

				</td>
				<!--
								<td @click="viewSingle(item.id)">
									<span v-if="item.reference_order && item.reference_order.client" class="d-block">
										{{ item.reference_order.client }}
									</span>
								</td>-->

				<td>{{ item.ship_by || '-' }}</td>
				<td>{{ item.deliver_by || '-' }}</td>
				<td class="d-none">
					<details class=" p-1 mb-1" v-for="event in item.events">
						<summary style="text-transform: capitalize">{{ event.type }}: {{event.date}}</summary>
						{{event.note}}
					</details>
				</td>

				<!--				<td @click="viewSingle(item.id)">{{ item.created }}</td>-->
				<td @click="viewSingle(item.id)">{{ formatPricing(item.total) }}</td>
				<td class="delete text-end">
					<!--					<a class="btn btn-outline-primary me-1" :href="getDuplicateUrl(item.id)"><i class="bi bi-copy"></i></a>-->

					<Modal :id="'deletePO-'+item.id" :title="'Are you sure?'"  :icon="'bi-trash'" :buttonClasses="'btn btn-danger'">
						<p>Will be deleted permanently. Cannot be undone.</p>
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
					</table>
				</th>
			</tr>
		</template>

	</Grid>
</template>