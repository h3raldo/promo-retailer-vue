<script setup>
import Loader from "@/components/globals/Loader.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
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
	props: ['onSelect', 'buttonText', 'buttonIcon'],
	methods: {
		search(e){
			e.preventDefault();
			let self = this;
			let url = this.symfony.api.companies.search + '?name=' + this.query;
			self.loading = true;
			utils.ajax( url, d => {
				self.results = d;
				self.loading = false;
			}, e => {
				self.loading = false;
			})
		},
		selected( company ){
			this.onSelect(company)
			this.$refs.modal.$refs.closeModalButton.click();
		}
	}
}
</script>
<template>

	<Modal :id="'company-search'" :title="'Search Companies'" :buttonText="buttonText" :icon="buttonIcon" :buttonClasses="'btn btn-primary'" ref="modal">

		<form @submit="search">
			<div class="input-group mb-3">
				<input type="text" class="form-control" placeholder="Search Companies" v-model="query">
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
			<tr v-for="company in results">
				<td>
					<button class="btn btn-sm btn-primary" @click="selected(company)">Select</button>
				</td>
				<td class="align-middle">
					{{ company.name }}
				</td>
			</tr>
			</tbody>
		</table>

	</Modal>


</template>