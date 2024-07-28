<script setup>
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import utils from "@/js/utils.js";
export default {
	data(){
		return {
			loading: false,
			noResults: false,
			query: '',
			results: []
		}
	},
	inject: ['symfony'],
	props: ['selected'],
	methods: {
		search(e){
			e.preventDefault();
			let self = this;
			let url = this.symfony.api.quickbooks.customer.search + '?name=' + this.query;
			self.loading = true;
			utils.ajax( url, d => {
				self.results = d.results;
				self.loading = false;
				self.noResults = self.results.length === 0;
			}, e => {
				self.loading = false;
			})
		},
		onSelect( customer ){
			this.selected( customer );
			this.query = '';
			this.results.length = 0;
		}
	}
}
</script>
<template>

	<div>

		<form @submit="search">
			<div class="input-group mb-3">
				<input type="text" class="form-control" placeholder="Search Quickbooks Customers" v-model="query">
				<button class="btn btn-outline-secondary" type="submit">Search</button>
			</div>
		</form>

		<Loader v-if="loading" />

		<div v-if="noResults" class="alert alert-warning">No results found </div>

		<table v-if="!loading && results.length" class="table">
			<thead>
			<tr>
				<th></th>
				<th>Company</th>
				<th>Display Name</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="company in results">
				<td>
					<button class="btn btn-sm btn-primary" @click="onSelect(company)">Select</button>
				</td>
				<td class="align-middle">
					{{ company.CompanyName }}
				</td>
				<td class="align-middle">
					{{ company.DisplayName }}
				</td>
			</tr>
			</tbody>
		</table>

	</div>


</template>