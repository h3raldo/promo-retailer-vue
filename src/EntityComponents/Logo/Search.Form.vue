<script setup>
import Loader from "@/components/globals/Loader.vue";
import BackgroundToggle from "@/EntityComponents/Logo/BackgroundToggle.vue";
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
	props: ['selected', 'companyId', 'selectVariant'],
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

		<table v-if="!loading && results.length" class="table align-middle">
			<thead>
			<tr>
				<th></th>
				<th>Name</th>
				<th v-if="selectVariant !== true" class="col-2"></th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="logo in results">
				<td>
					<BackgroundToggle :image="getFirstImage(logo)" width="200" />
				</td>
				<td class="align-middle">
					{{ logo.name }}
					<table class="table align-middle" v-if="selectVariant === true">
						<thead>
						<tr>
							<th>Image</th>
							<th>Types</th>
							<th class="col-1"></th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="variant in logo.variants">
							<td>
								<BackgroundToggle :image="variant.image" width="50" />
							</td>
							<td>{{ variant.types.join(', ') }}</td>
							<td><button class="btn btn-primary btn-sm" @click="selected(logo, variant)">Select</button></td>
						</tr>
						</tbody>
					</table>
				</td>
				<td v-if="selectVariant !== true">
					<button class="btn btn-sm btn-primary" @click="selected(logo)">Select</button>
				</td>
			</tr>
			</tbody>
		</table>

	</div>


</template>