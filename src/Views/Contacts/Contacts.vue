<script setup>
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			loading: false,
			results: []
		}
	},
	inject: ['symfony', 'alert'],
	methods: {
		retrieve(params) {
			let self = this;
			if (!params) params = '';

			let url = this.symfony.api.contacts.search + '?' + params;

			self.loading = true;
			utils.ajax(url, (data) => {
				self.results = data.results;
				self.loading = false;
			})
		},
		goToCompany(id) {
			this.$router.push(this.symfony.views.contacts_contact.replace(':id', id))
		},
		createNew() {

			let self = this;

			utils.ajax(this.symfony.api.contacts.contact.new, (data) => {

				if (data.error === true || !data.id) {
					self.alert(data.message, 'danger');
					return;
				}

				self.$router.push(this.symfony.views.contacts_contact.replace(':id', data.id))

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
		<h3 class="m-0"><i class="bi bi-person"></i> Contacts</h3>
		<button class="btn btn-primary p-3" @click="createNew"><i class="bi bi-plus-square-fill"></i> Create New
		</button>
	</div>

	<Loader v-if="loading"/>

	<table v-if="!loading" class="table table-hover">
		<thead>
		<tr>
			<th>ID</th>
			<th>First Name</th>
			<th>Last Name</th>
			<th>Email</th>
			<th>Company</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="result in results" @click="goToCompany(result.id)">
			<td>{{ result.id }}</td>
			<td>{{ result.first_name }}</td>
			<td>{{ result.last_name }}</td>
			<td>{{ result.email }}</td>
			<td>{{ result.company }}</td>
		</tr>
		</tbody>
	</table>

</template>