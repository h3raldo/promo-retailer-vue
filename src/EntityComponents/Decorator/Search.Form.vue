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
	props: ['selected', 'buttonText', 'buttonIcon', 'type'],
	methods: {
		search(e){
			e.preventDefault();
			let self = this;
			let url = this.symfony.api.decorators.search + '?name=' + encodeURIComponent(this.query);
			if( this.type ) url += '&type=' + this.type;
			self.loading = true;
			utils.ajax( url, d => {
				self.results = d.results;
				self.loading = false;
			}, e => {
				self.loading = false;
			})
		}
	}
}
</script>
<template>

	<div>

		<form @submit="search">
			<div class="input-group mb-3">
				<input type="text" class="form-control" placeholder="Search Decorators" v-model="query">
				<button class="btn btn-outline-secondary" type="submit">Search</button>
			</div>
		</form>

		<Loader v-if="loading" />

		<table v-if="!loading && results.length" class="table">
			<thead>
			<tr>
				<th class="col-1"></th>
				<th>Name</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="decorator in results">
				<td>
					<button class="btn btn-sm btn-primary" @click="selected(decorator)">Select</button>
				</td>
				<td class="align-middle">
					{{ decorator.name }}
				</td>
			</tr>
			</tbody>
		</table>

	</div>


</template>