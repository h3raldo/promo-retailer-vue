<script setup>
import Loader from "@/components/globals/Loader.vue";
</script>

<script>
import utils from "@/js/utils.js";

export default {

	data(){
		return {
			loading: false,
			contacts: [],
			contactEntity: {},
			contact: {
				id: '',
				first_name: 'New',
				last_name: 'Contact',
				email: ''
			},
		}
	},

	inject: ['alert', "symfony"],
	props: ['company', 'onSelect'],

	methods: {
		load(){
			if( !this.company ) return;

			let self = this;
			let url = this.symfony.api.companies.company.contacts.replace(':id', this.company)

			self.loading = true;
			utils.ajax(url, (data) => {
				self.contacts = data.results;
				self.loading = false;
			}, (error) => {
				self.alert(error.message, 'danger');
			})
		},
		select(){

		}
	},

	mounted(){
		this.load();
	}
}
</script>
<template>

	<Loader v-if="loading" />

	<div v-else>
		<select class="form-select" v-model="contactEntity">
			<option :value="{}">New Contact</option>
			<option v-for="contact in contacts" :value="contact">
				{{ contact.first_name }} {{ contact.last_name }} ({{ contact.email }})
			</option>
		</select>

		<div v-if="!contactEntity.id">
			<div class="bg-light p-3">
				<div class="row mb-3">
					<div class="col">
						<label class="form-label">First Name</label>
						<input type="text" class="form-control" placeholder="First Name">
					</div>
					<div class="col">
						<label class="form-label">Last Name</label>
						<input type="text" class="form-control" placeholder="Last Name">
					</div>
					<div class="col">
						<label class="form-label">Email</label>
						<input type="text" class="form-control" placeholder="Email">
					</div>
				</div>

				<button class="btn btn-primary" :disabled="!company">Save</button>
				<span class="text-danger ps-2" v-if="!company">Company required</span>
			</div>
		</div>
	</div>
</template>