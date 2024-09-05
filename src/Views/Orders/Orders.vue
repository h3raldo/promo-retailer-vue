<script setup>
import Modal from "@/components/globals/bootstrap/Modal.vue";
import Search from "@/Views/Orders/Search.vue";
import Grid from "@/components/globals/Grid.vue";
import EditableColumn from "@/components/globals/Grid/EditableColumn.vue";
import entity from "@/js/entity.js";
</script>

<script>
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";
export default {
	data() {
		return {
			loading: false,
			columns: {
				'ID': { id: 'id' },
				'Status': { id: 'status' },
				'Type': { id: 'type' },
				'Pushed Date': { id: 'date' },
				// 'Reference Number': { id: 'reference_number' },
				'Origin/Client': { id: 'client' },
				'Ship By': { id: 'date_ship_by' },
				'In-Hands': { id: 'date_deliver_by' },
				'-': {  },
				'Total': { id: 'total' },
				'Profit': { id: 'total_profit'  },
				'Margin': { id: 'total_margin' }
			},
			bulkEdits: [
				{
					name: 'Status',
					column: 'status',
					type: 'select',
					options: entity.order.default.statuses
				},
				{
					name: 'Ship By',
					column: 'dateShipBy',
					type: 'date'
				},
				{
					name: 'In-Hands',
					column: 'dateDeliverBy',
					type: 'date'
				},
			],
			quotes: {},
			editing: 0,
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
		api(){

		}
	},

	methods: {
		formatPricing(price){
			return utils.pricing.format(price);
		},
		formatDate(date)
		{
			if( !date ) return '-';
			return utils.time.dateToNiceString(date, true);
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
				bulk: 'info'
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

	<Grid :api="symfony.orders.search" :columns="columns" :searchState="searchState" :bulkEdits="bulkEdits" :entity="'order'">

		<template #header="{search}">
			<Search :getEntities="search" :searchParams="searchState" />
		</template>

		<template #item="{item}">

			<td @click="viewQuote(item.id)">{{ item.id }}</td>

			<td>
				<EditableColumn :type="'select'" :item="item" :column="'status'" :options="entity.order.default.statuses" :entity="'order'">
					<span :class="getStatusColor(item.status)" @click="editing = item.id">
						{{ item.status }}
					</span>
				</EditableColumn>
			</td>

			<td>
				<EditableColumn :type="'select'" :item="item" :column="'type'" :options="entity.order.default.types" :entity="'order'">
					<span :class="getStatusColor(item.type)" @click="editing = item.id">
						<span v-if="item.type === 'default'">-</span>
						<span v-else>{{ item.type }}</span>
					</span>
				</EditableColumn>
			</td>

			<td @click="viewQuote(item.id)">{{ formatDate(item.date) }}</td>

			<td @click="viewQuote(item.id)">
				<span class="d-block">
					<span :class="'fw-normal badge source-'+item.source">
						{{ item.source.charAt(0).toUpperCase() }} -
						{{ item.referenceNumber || '' }}
					</span>

					<span v-if="!item.company || !item.quickbooksID" class="text-danger badge">
						<i class="bi bi-info-circle pe-1"></i>
						<span v-if="!item.company">Company</span>
						<span v-if="item.company && !item.quickbooksID">QB ID</span>
					</span>
				</span>
				<span class="d-block">{{ item.title }}</span>
				<span class="d-block small">{{ item.client }}</span>
			</td>

			<td>
				<EditableColumn :type="'date'" :item="item" :column="'dateShipBy'" :entity="'order'">
					{{ formatDate(item.dateShipBy) }}
				</EditableColumn>
			</td>
			<td>
				<EditableColumn :type="'date'" :item="item" :column="'dateDeliverBy'" :entity="'order'">
					{{ formatDate(item.dateDeliverBy) }}
				</EditableColumn>
			</td>
			<td>
				<span v-if="item.invoice_quickbooks_id" class="badge text-bg-success">
					<i class="bi bi-currency-dollar"></i> Invoiced
				</span><br v-if="item.invoice_quickbooks_id">

				<span v-if="item.statuses.paid" class="badge text-bg-success">
					Paid
				</span><br v-if="item.statuses.paid">

				<span v-if="item.statuses.shipped" class="badge text-bg-primary">
					Shipped
				</span>

				<!--
				<details class=" p-1 mb-1" v-for="event in item.events">
					<summary style="text-transform: capitalize">{{ event.type }}: {{ formatDate(event.date) }}</summary>
					{{event.note}}
				</details>
				-->
			</td>
			<td @click="viewQuote(item.id)">{{ formatPricing(item.total) }}</td>
			<td @click="viewQuote(item.id)">{{ formatPricing(item.totalProfit) }}</td>
			<td @click="viewQuote(item.id)">{{ item.totalMargin }}%</td>

			<td class="delete text-end">
				<a class="btn btn-outline-primary me-1" :href="getDuplicateUrl(item.id)"><i class="bi bi-copy"></i></a>
				<Modal :id="'deleteQuote-'+item.id" :title="'Are you sure?'"  :icon="'bi-trash'" :buttonClasses="'btn btn-danger'">
					<p>Quote will be deleted permanently. Cannot be undone.</p>
					<a class="btn btn-danger" :href="getDeleteUrl(item.id)"><i class="bi bi-trash"></i> DELETE</a>
				</Modal>
			</td>

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