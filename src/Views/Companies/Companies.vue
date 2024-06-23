<script setup>
import Loader from "@/components/globals/Loader.vue";
import Tabs from "@/components/globals/Tabs.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			loading: false,
			type: 'client',
			companies: [],
		}
	},
	inject: ['symfony', 'alert'],
	methods: {
		retrieve(params) {
			let self = this;
			if (!params) params = '';

			let url = this.symfony.api.companies.search + `?type=${this.type}&${params}`;

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
		onTabChange(label){
			this.type = label;
			this.retrieve();
		}
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
		<button class="btn btn-primary p-3" @click="createNew"><i class="bi bi-plus-square-fill"></i> Create New</button>
	</div>

	<ul class="nav nav-tabs pt-3">
		<li class="nav-item">
			<button :class="'nav-link' + ( type === 'client' ? ' active' : '' )" @click="onTabChange('client')">Clients</button>
		</li>
		<li class="nav-item">
			<button :class="'nav-link' + ( type === 'vendor' ? ' active' : '' )" @click="onTabChange('vendor')">Vendors</button>
		</li>
	</ul>

	<Loader v-if="loading"/>

	<table v-if="!loading" class="table table-hover">
		<thead>
		<tr>
			<th class="col-1">ID</th>
			<th class="col-1">Type</th>
			<th>Company</th>
			<th class="col-1 text-center">Supplier</th>
			<th class="col-1 text-center">Decorator</th>
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
				{{ company.name }}
			</td>
			<td class="text-center">
				<span v-if="company.data && company.data.type && company.data.type.supplier">
					<i class="bi bi-check-square-fill"></i>
				</span>
			</td>
			<td class="text-center">
				<span v-if="company.data && company.data.type && company.data.type.decorator">
					<i class="bi bi-check-square-fill"></i>
				</span>
			</td>
		</tr>
		</tbody>
	</table>

</template>