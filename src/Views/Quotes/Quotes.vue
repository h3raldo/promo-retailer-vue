<script setup>
	import Modal from "@/components/globals/bootstrap/Modal.vue";
	import Search from "@/Views/Quotes/Search.vue";
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
			quotes: {},
			columns: {
				'ID': { id: 'id' },
				'Status': { id: 'status' },
				'Category': { id: 'category' },
				'Date': { id: 'date_created' },
				'Title': { id: 'title' },
				'Events': { },
				'Total': { id: 'total' },
				'Cost': { id: 'total_cost' },
				'Profit': { id: 'total_profit' },
				'Margin': { id: 'total_margin' },
				'Author': { id: 'author' },
			},
			bulkEdits: [
				{
					name: 'Status',
					column: 'status',
					type: 'select',
					options: entity.quote.default.statuses
				},
				{
					name: 'Date',
					column: 'date',
					type: 'date'
				},
			],
		}
	},

	inject: ['symfony', 'search'],

	computed: {
		searchState(){
			return this.search.quotes;
		},
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
			this.$router.push( this.symfony.views.quotes_quote.replace(':id', id) )
		},
		getDuplicateUrl( id )
		{
			return this.symfony.quotes.quote.duplicate.replace(':id', id);
		},
		getDeleteUrl( id )
		{
			return this.symfony.quotes.quote.delete.replace(':id', id);
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
		if( typeof this.search.quotes === 'undefined' ) this.search.quotes = {}
	},
}
</script>

<template>

	<Grid :columns="columns" :searchState="searchState" :api="symfony.quotes.search" :bulkEdits="bulkEdits" :entity="'quote'">

		<template #header="{search}">
			<Search :getQuotes="search" :searchParams="searchState" />
		</template>

		<template #item="{item}">
			<td @click="viewQuote(item.id)">{{ item.id }}</td>
			<td>
				<EditableColumn :type="'select'" :item="item" :column="'status'" :options="entity.quote.default.statuses" :entity="'quote'">
					<span :class="getStatusColor(item.status)">
						{{ item.status }}
					</span>
				</EditableColumn>
			</td>
			<td @click="viewQuote(item.id)">{{ item.category }}</td>
			<td @click="viewQuote(item.id)">{{ formatDate(item.date) }}</td>
			<td @click="viewQuote(item.id)">
				<span class="badge text-bg-secondary rounded-pill">{{ item.client }}</span><br>
				{{ item.title }}
			</td>
			<td>
				<details class=" p-1 mb-1" v-for="event in item.events">
					<summary style="text-transform: capitalize">{{ event.type }}: {{ formatDate(event.date) }}</summary>
					{{event.note}}
				</details>
			</td>
			<td @click="viewQuote(item.id)">{{ formatPricing(item.total) }}</td>
			<td @click="viewQuote(item.id)">{{ formatPricing(item.total_cost) }}</td>
			<td @click="viewQuote(item.id)">{{ formatPricing(item.profit) }}</td>
			<td @click="viewQuote(item.id)">{{ item.margin }}%</td>
			<td @click="viewQuote(item.id)">{{ item.author }}</td>
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

</template>