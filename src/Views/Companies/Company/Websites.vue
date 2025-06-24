<script setup>
import EntityDelete from "@/EntityComponents/Entity/EntityDelete.vue";
</script>
<script>
import utils from "@/js/utils.js";
export default {
	data(){
		return {
			query: ''
		}
	},
	inject: ['company', 'symfony', 'alert', 'entities'],
	computed: {
		availableWebsites(){
			if ( !this.entities.website.length ) return [];
			if( this.query.trim() === '' ) return this.entities.website;
			return this.entities.website.filter( w => w.name.toLowerCase().includes( this.query.toLowerCase() ) );
		}
	},
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
		},
		afterDelete( response )
		{
			if( !response.id ) return;
			this.entities.website = this.entities.website.filter( w => w.id !== response.id );
		}
	}
}
</script>
<template>
	<div class="p-3 bg-light mb-4">
		<button class="btn btn-primary" @click="newLogo"><i class="bi bi-plus-circle"></i> Add New Website</button>
	</div>

	<div class="form-floating">
		<input type="text" class="form-control mb-3" v-model="query" placeholder="Search for a website">
		<label>Filter Websites</label>
	</div>

	<table v-if="availableWebsites.length" class="table">
		<thead>
		<tr>
			<td></td>
			<th>ID</th>
			<th>Name</th>
			<th>Handle</th>
			<th></th>
		</tr>
		</thead>
		<tbody class="align-middle">
		<tr v-for="website in availableWebsites">
			<td><button @click="goToWebsite(website.id)" class="btn btn-sm btn-primary">Edit</button></td>
			<td>{{ website.id }}</td>
			<td>
				<span class="text-secondary" v-if="website.parent.name">{{ website.parent.name }} <i class="bi bi-chevron-double-right"></i></span>
				{{ website.name }}
			</td>
			<td>{{ website.handle }}</td>
			<td>
				<EntityDelete entity="website" :id="website.id" :callback="afterDelete" />
			</td>
		</tr>
		</tbody>
	</table>

	<div v-else>
		<h3>No Current Websites</h3>
	</div>
</template>