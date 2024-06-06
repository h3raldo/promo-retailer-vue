<script setup>
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			loading: false,
			companies: []
		}
	},
	inject: ['symfony', 'alert'],
	methods: {
		retrieve(params) {
			let self = this;
			if (!params) params = '';

			let url = this.symfony.api.companies.search + '?' + params;

			self.loading = true;
			utils.ajax(url, (data) => {
				self.companies = data;
				self.loading = false;
			})
		},
		goToCompany(id) {
			this.$router.push(this.symfony.views.companies_company.replace(':id', id))
		},
		createNew() {

			let self = this;

			utils.ajax(this.symfony.api.companies.company.new, (data) => {

				if (data.error === true || !data.id) {
					self.alert(data.message, 'danger');
					return;
				}

				self.$router.push(this.symfony.views.companies_company.replace(':id', data.id))

			}, (error) => {
				this.alert('Error Creating', 'danger');
			})
		},
	},
	mounted() {
		this.loading = true;
		this.retrieve();
	}
}
</script>

<template>

	<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center">
		<h3 class="m-0"><i class="bi bi-building"></i> Companies/Vendors</h3>
		<button class="btn btn-primary p-3" @click="createNew"><i class="bi bi-plus-square-fill"></i> Create New
		</button>
	</div>

	<Loader v-if="loading"/>

	<table v-if="!loading" class="table table-hover">
		<thead>
		<tr>
			<th>ID</th>
			<th class="col-1">Type</th>
			<th>Company</th>
			<th>Child</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="company in companies" @click="goToCompany(company.id)">
			<td>{{ company.id }}</td>
			<td>
				<span v-if="company.type" class="badge text-bg-success text-end">{{ company.type }}</span>
				<span v-else class="badge text-bg-secondary text-end">default</span>
			</td>
			<td>
				<template v-if="company.parent">
					{{ company.parent }}
				</template>
				<template v-else>
					{{ company.name }}
				</template>
			</td>
			<td>
				<template v-if="company.parent">
					{{ company.name }}
				</template>
			</td>
		</tr>
		</tbody>
	</table>

</template>