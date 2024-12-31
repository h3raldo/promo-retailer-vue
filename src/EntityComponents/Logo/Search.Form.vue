<script setup>
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import utils from "@/js/utils.js";
export default {
	data(){
		return {
			loading: false,
			query: '',
			results: []
		}
	},
	inject: ['symfony'],
	props: ['selected', 'companyId'],
	methods: {
		getFirstImage(logo){
			let found_version = '';
			['all', 'dark', 'light', 'laser-engrave'].forEach( type => {
				if( logo.variants[type] && found_version === '' ) found_version = logo.variants[type];
			})
			return found_version.image
		},
		search(e){
			if( e ) e.preventDefault();

			let self = this;
			let url = this.symfony.api.logos.search + '?name=' + this.query;

			if( this.companyId ) url += '&company_id=' + this.companyId;

			self.loading = true;
			utils.ajax( url, d => {
				self.results = d.results;
				self.loading = false;
			}, e => {
				self.loading = false;
			})
		},
	},
	mounted(){
		if( !this.companyId ) return;
		this.search();
	}
}
</script>
<template>

	<div>

		<form @submit="search">
			<div class="input-group mb-3">
				<input type="text" class="form-control" placeholder="Search Logos" v-model="query">
				<button class="btn btn-outline-secondary" type="submit">Search</button>
			</div>
		</form>

		<Loader v-if="loading" />

		<table v-if="!loading && results.length" class="table">
			<thead>
			<tr>
				<th class="col-1"></th>
				<th></th>
				<th>Name</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="company in results">
				<td>
					<button class="btn btn-sm btn-primary" @click="selected(company)">Select</button>
				</td>
				<td>
					<img class="bg-secondary p-2" :src="getFirstImage(company)" width="100">
				</td>
				<td class="align-middle">
					{{ company.name }} ({{ Object.keys(company.variants).length }} logos)
				</td>
			</tr>
			</tbody>
		</table>

	</div>


</template>