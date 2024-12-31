<script setup>
</script>
<script>
import utils from "@/js/utils.js";
export default {
	data(){
		return {

		}
	},
	inject: ['company', 'symfony', 'alert', 'entities'],
	methods: {
		newLogo(){
			let self = this;

			utils.ajax(this.symfony.api.websites.website.new + '?company_id=' + self.company.id, (data) => {

				if (data.error === true || !data.id) {
					self.alert(data.message, 'danger');
					return;
				}

				self.$router.push(this.symfony.views.websites_website.replace(':id', data.id))

			}, (error) => {
				this.alert('Error Creating Website', 'danger');
			})
		},
		goToWebsite(id){
			this.$router.push(this.symfony.views.websites_website.replace(':id', id))
		}
	}
}
</script>
<template>
	<div class="p-3 bg-light mb-4">
		<button class="btn btn-primary" @click="newLogo"><i class="bi bi-plus-circle"></i> Add New Website</button>
	</div>

	<table v-if="entities.website.length" class="table">
		<thead>
		<tr>
			<td></td>
			<th>ID</th>
			<th>Handle</th>
			<th>Name</th>
			<th>Link</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="website in entities.website">
			<td><button @click="goToWebsite(website.id)" class="btn btn-sm btn-primary">View/Edit</button></td>
			<td>{{ website.id }}</td>
			<td>{{ website.handle }}</td>
			<td>{{ website.name }}</td>
			<td><a :href="`https://${website.handle}.promoretailer.com`" target="_blank">View Website</a> </td>
		</tr>
		</tbody>
	</table>

	<div v-else>
		<h3>No Current Websites</h3>
	</div>
</template>