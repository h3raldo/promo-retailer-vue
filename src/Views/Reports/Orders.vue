<script setup>
import Loader from "@/components/globals/Loader.vue";
import utils from "@/js/utils.js";
import Search from "@/Views/Orders/Search.vue";
</script>

<script>
import utils from "@/js/utils.js";

export default {

	data(){
		return {
			loading: true,
			report: {},
			searchParams: {},
			group: '',
		}
	},

	inject: ['alert', "symfony"],

	methods: {
		getReport(params){
			let self = this;
			if( !params ) params = '';

			let url = this.symfony.api.orders.report + '?' + params

			self.loading = true;
			utils.ajax(url, (data) => {
				self.report = data;
				self.searchParams = data.search;
				self.loading = false;
			}, (error) => {
				self.alert(error.message, 'danger');
			})
		},
		prettify( column ){
			return column.replaceAll('_', ' ');
		}
	},

	mounted(){
		this.getReport();
	}
}
</script>
<template>

	<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center">
		<div>
			<h3 class="mb-0"><i class="bi bi-table"></i> Report - Orders</h3>
		</div>
	</div>

	<Search :getEntities="getReport" :searchParams="searchParams" />

	<br><hr>

	<Loader v-if="loading" />
	<div v-else>
		<table class="table table-striped">
			<thead>
			<tr>
				<th></th>
				<th>Value</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(value, key) in report.result">
				<td class="text-capitalize">{{ prettify(key) }}</td>

				<td v-if="key === 'count'">{{ value }}</td>
				<td v-else-if="key.includes('margin')">{{ value }}%</td>
				<td v-else>{{ utils.pricing.format(value) }}</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>