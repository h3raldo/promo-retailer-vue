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

			if( !logo.variants.length ) return found_version;

			logo.variants.forEach( v => {
				if( v.image ) found_version = v;
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
			<tr v-for="logo in results">
				<td>
					<button class="btn btn-sm btn-primary" @click="selected(logo)">Select</button>
				</td>
				<td>
					<img class="bg-secondary p-2" :src="getFirstImage(logo)" width="100">
				</td>
				<td class="align-middle">
					{{ logo.name }} ({{ Object.keys(logo.variants).length }} logos)
				</td>
			</tr>
			</tbody>
		</table>

	</div>


</template>