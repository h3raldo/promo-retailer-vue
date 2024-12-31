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

		<table class="table">
			<thead>
			<tr>
				<th>ID</th>
				<th>Status</th>
				<th>Name</th>
				<th>Handle</th>
				<th></th>
			</tr>
			</thead>
			<tbody>
				<tr v-for="logo in entities.logo">
					<td>
						{{ logo.id }}
					</td>
					<td>
						{{ logo.status }}
					</td>
					<td>
						<h4>{{ logo.name }}</h4>
					</td>
					<td>
						{{ logo.handle }}
					</td>
					<td>
						<button class="btn btn-outline-primary" @click="goToLogo(logo.id)">View Logo <i class="bi bi-arrow-right"></i></button>
					</td>
				</tr>
			</tbody>
		</table>

	</div>
</template>