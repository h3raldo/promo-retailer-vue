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
				'Margin': { id: 'total_margin' },
				'Author': { id: 'author' },
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

	inject: ['symfony', 'search', 'cache'],

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
		lastOpened(){
			console.log(this.cache.component.grid.orders.last_opened);
			return this.cache.component.grid.orders.last_opened;
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
			this.cache.component.grid.orders.last_opened = id;
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
		createNew()
		{
			let self = this;

			utils.ajax( this.symfony.orders.order.new, (data) => {

				if( data.error === true || !data.id ){
					self.alert(data.message, 'danger');
					return;
				}

				self.$router.push( self.symfony.views.orders_order.replace(':id', data.id) )

			}, (error) => {
				this.alert('Error creating new order', 'danger');
			})
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
		hasPRPurchaseOrder( purchaseOrders )
		{
			let types = {};
			let prs = purchaseOrders.filter( p => p?.company?.includes('PR ') );
			prs.forEach( p => types[p.company] = true )
			return Object.keys(types);
		},
		isInvoiced( item ){
			if( !item.invoice_quickbooks_id ) return false;
			item.bg_success = true;
			return true;
		},
		getRowClasses( row_item ) {
			let type = row_item.type;
			let colors = {
				hold: 'table-warning',
				inventory: 'table-info',
				production: 'table-success',
				urgent: 'table-danger',
			}
			if( colors[type] ) return colors[type];
			return '';
		}
	},

	created() {
		if( typeof this.search.orders === 'undefined' ) this.search.orders = {}
		if( typeof this.cache.component.grid === 'undefined' ) this.cache.component.grid = {
			orders: {
				last_opened: 0
			}
		}
	},
}
</script>

<template>

	<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center d-print-none">
		<div>
			<h3 class="mb-0"><i class="bi bi-table"></i> Sales Orders</h3>
		</div>
		<button class="btn btn-primary p-3" @click="createNew"><i class="bi bi-plus-square-fill"></i> Create New</button>
	</div>

	<Grid :api="symfony.orders.search" :columns="columns" :searchState="searchState" :bulkEdits="bulkEdits" :entity="'order'" :rowClasses="getRowClasses">

		<template #header="{search}">
			<Search :getEntities="search" :searchParams="searchState" />
		</template>

		<template #item="{item}">

			<td>{{ item.id }}</td>

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

			<td @click="viewQuote(item.id)">
				{{ formatDate(item.date) }}
			</td>

			<td @click="viewQuote(item.id)" :class="{'bg-warning-subtle': lastOpened === item.id}">

				<div class="d-flex align-items-center">
					<div class="flex-grow-1">
						<span class="d-block">
							<span :class="'fw-normal badge source-'+item.source">
								{{ item.source.charAt(0).toUpperCase() }} -
								{{ item.referenceNumber || '' }}
							</span>

							<span v-if="item.status==='confirmed' && item.purchaseOrders.length < 1" class="badge text-bg-danger ms-1">
								<i class="bi bi-info-circle pe-1"></i> NO PURCHASE ORDERS CREATED
							</span>

							<span v-if="!item.company || !item.quickbooksID" class="text-danger badge">
								<i class="bi bi-info-circle pe-1"></i>
								<span v-if="!item.company">Company</span>
								<span v-if="item.company && !item.quickbooksID">QB ID</span>
							</span>

							<small v-if="lastOpened === item.id" class="text-warning-emphasis float-end"><i class="bi bi-mouse2"></i> Last Opened</small>
						</span>
						<span class="d-block">{{ item.title }}</span>
						<span class="d-block small">{{ item.client }}</span>
						<template v-if="item.purchaseOrders.length">
							<span class="d-block small">
								<span class="badge text-bg-primary">
									<i class="bi bi-cash-coin"></i> x {{ item.purchaseOrders.length }} <span v-if="hasPRPurchaseOrder(item.purchaseOrders).length > 0">({{ hasPRPurchaseOrder(item.purchaseOrders).join(', ') }})</span>
								</span>
								<span class="badge text-bg-danger ms-2" v-if="item.qa.POs.difference && item.qa.POs.difference > 5">
									<i class="bi bi-cash-coin"></i> {{ Math.round(item.qa.POs.difference) }}% Diff
								</span>

							</span>
						</template>
						<template v-if="item.events">
							<div style="height: 7px;"></div>
							<span class="badge text-bg-warning" style="white-space: initial;">
								<i class="bi bi-calendar-event"></i> {{ item.events[item.events.length-1].type }} {{ formatDate(item.events[item.events.length-1].date) }}: {{item.events[item.events.length-1].note}}
							</span>
						</template>

					</div>
					<div>
						<div v-if="item.events" class="pr-tooltip">
							<span class="badge text-bg-warning"><i class="bi bi-calendar-event"></i></span>
							<div class="pr-tooltip--content bg-light p-2 border text-start" style="width: 200px;">
								<p class=" p-1 mb-1" v-for="event in item.events">
									<b class="text-capitalize d-block">{{ event.type }}: {{ formatDate(event.date) }}</b>
									{{event.note}}
								</p>
							</div>
						</div>
					</div>
				</div>

			</td>

			<td>
				<EditableColumn :type="'date'" :item="item" :column="'dateShipBy'" :entity="'order'">
					{{ formatDate(item.dateShipBy) }}
				</EditableColumn>
			</td>
			<td>
				<EditableColumn :type="'date'" :item="item" :column="'dateDeliverBy'" :entity="'order'">
					<span v-if="item.dateDeliverByFirm" class="badge text-bg-danger">
						{{ formatDate(item.dateDeliverBy) }}
					</span>
					<span v-else>
						{{ formatDate(item.dateDeliverBy) }}
					</span>
				</EditableColumn>
			</td>
			<td>
				<span v-if="isInvoiced(item)" class="badge text-bg-success">
					<i class="bi bi-currency-dollar"></i> Invoiced
				</span><br v-if="isInvoiced(item)">

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
			<td @click="viewQuote(item.id)">{{ item.author }}</td>

			<td class="delete text-end d-print-none">
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
						<tbody>
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
						</tbody>
					</table>

				</th>
			</tr>
		</template>
	</Grid>

	<div class="text-center d-print-none">
		<a class="btn btn-outline-primary" :href="exportLink" target="_blank">Export to CSV</a>
	</div>

</template>

<style>
@media print {
	.main-menu-sidebar{
		display: none !important;
	}
	.badge{
		background: transparent !important;
		color: black !important;
		font-weight: bold !important;
	}
	.text-bg-secondary{
		color: #000 !important;
	}
	.text-bg-success{
		color: green !important;
	}
	.text-bg-primary{
		color: blue !important;
	}
	.source-magento{
		color: orange !important;
	}
	.source-order{
		color: blue !important;
	}
	.source-quote{
		color: green !important;
	}
}
</style>