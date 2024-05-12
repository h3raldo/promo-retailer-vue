<script setup>
import Loader from "@/components/globals/Loader.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import Search from "@/EntityComponents/Company/Search.vue";
</script>
<script>
import utils from "@/js/utils.js";
export default {
	data(){
		return {
			loading: false,
			saving: false,
			id: this.$route.params.id,
			selectedParent: {},
			company: {},
			extra: {},
		}
	},
	inject: ['symfony', 'alert'],
	methods: {
		retrieve(){
			let self = this;
			let url = this.symfony.api.companies.company.get.replace(':id', self.id);

			self.loading = true;
			utils.ajax(url, (data) => {
				self.company = data.entity;
				self.extra = data.extra;
				if( !self.company.data ) self.company.data = {};
				if( !self.company.data.properties ) self.company.data.properties = [];
				self.loading = false;
			})
		},
		save() {
			let self = this;
			let url = this.symfony.api.companies.company.save;
			let callback = {
				success(d) {

					if( d.error === false )
						self.alert('Company Saved!');
					else
						self.alert(`Error saving: ${d.message}`, 'danger');

					self.saving = false;
				},
				error() {
					self.alert('Error saving, see console.', 'danger');
					self.saving = false;
				}
			}

			self.saving = true;
			utils.ajax(url, callback.success, callback.error, this.company);
		},
		addProperty(){
			this.company.data.properties.push({ name: 'Property', value: 'Value' })
		},
		selectParent(company){
			this.company.parent_name = company.name;
			this.company.parent = company.id;
		}
	},
	mounted() {
		this.retrieve();
	}
}
</script>

<template>

	<Loader v-if="loading"/>

	<template v-if="!loading && company.name">

		<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center">
			<button @click="$router.go(-1)" class="btn btn-secondary"><i class="bi bi-arrow-bar-left"></i></button>
			<h2 class="m-0 text-center">
				{{ company.name }}<br>
				<span class="h4" v-if="company.parent_name">Under: {{ company.parent_name }}</span>
			</h2>
			<button class="btn btn-primary p-3" @click="save" :disabled="saving"><i class="bi bi-floppy-fill"></i> Save Changes</button>
		</div>

		<br>
		<div class="row">
			<div class="col-9">
				<label class="form-label">Name</label>
				<input class="form-control" type="text" v-model="company.name" />
			</div>
			<div class="col">
				<label class="form-label">Type</label>
				<select class="form-select" v-model="company.type">
					<option value="">Default</option>
					<option value="vendor">Vendor</option>
				</select>
			</div>
			<div class="col">
				<label class="form-label">&nbsp;</label><br>
				<Search :onSelect="selectParent" :buttonText="'Set Parent'" :buttonIcon="'bi-pencil'" />
			</div>
		</div>
		<br>

		<div class="row">
			<div class="col">
				<div v-for="property in company.data.properties" class="d-flex gap-3 pb-3">

					<div class="col-5">
						<input v-model="property.name" class="form-control" type="text" />
					</div>

					<div><label class="col-form-label">:</label></div>

					<div class="col-4">
						<input v-model="property.value" class="form-control" type="text" />
					</div>

				</div>

				<button @click="addProperty" class="btn btn-primary">Add Property</button>
			</div>
			<div class="col">
				<h3>Company Contacts</h3>
				<div v-if="extra.contacts" class="bg-light p-3">
					<div v-for="contact in extra.contacts">{{ contact.first_name }} {{ contact.last_name }} <{{ contact.email }}></div>
				</div>
			</div>
		</div>



	</template>


</template>