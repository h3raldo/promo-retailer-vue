<script setup>
</script>
<script>
import utils from "@/js/utils.js";
export default {
	data(){
		return {
			confirmDelete: {

			}
		}
	},
	inject: ['company', 'symfony', 'alert', 'entities'],
	methods: {
		newLogo(){
			let self = this;

			utils.ajax(this.symfony.api.logos.logo.new + '?company_id=' + self.company.id, (data) => {

				if (data.error === true || !data.id) {
					self.alert(data.message, 'danger');
					return;
				}

				self.$router.push(this.symfony.views.logos_logo.replace(':id', data.id))

			}, (error) => {
				this.alert('Error Creating Logo', 'danger');
			})
		},
		deleteLogo(logo, index){
			let self = this;
			utils.ajax( self.symfony.api.logos.logo.delete.replace(':id', logo.id), (r)=>{
				if( r.error && r.error === true ){
					self.alert('Error deleting logo', 'danger');
					return;
				}
				self.entities.logo.splice( index, 1 );
			})
		},
		goToLogo(id){
			this.$router.push(this.symfony.views.logos_logo.replace(':id', id))
		}
	}
}
</script>
<template>
	<div class="p-3 bg-light mb-4">
		<button class="btn btn-primary" @click="newLogo"><i class="bi bi-plus-circle"></i> Add New Logo</button>
	</div>

	<div v-if="entities.logo.length > 0">

		<table class="table align-middle">
			<thead>
			<tr>
				<th></th>
				<th>ID</th>
				<th>Status</th>
				<th>Name</th>
				<th>Handle</th>
				<th class="col-2"></th>
			</tr>
			</thead>
			<tbody>
				<tr v-for="(logo, li) in entities.logo">
					<td>
						<button class="btn btn-primary btn-sm" @click="goToLogo(logo.id)"><i class="bi bi-pencil"></i> Edit</button>
					</td>
					<td>
						{{ logo.id }}
					</td>
					<td>
						{{ logo.status }}
					</td>
					<td>
						<b>{{ logo.name }}</b>
					</td>
					<td>
						{{ logo.handle }}
					</td>
					<td>
						<button v-if="!confirmDelete[li]" class="btn btn-outline-danger btn-sm" @click="confirmDelete[li] = true">Delete</button>
						<button v-else class="btn btn-danger btn-sm" @click="deleteLogo(logo, li)">Confirm Delete?</button>
					</td>
				</tr>
			</tbody>
		</table>

	</div>
</template>