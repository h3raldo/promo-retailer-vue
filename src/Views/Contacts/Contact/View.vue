<script setup>
import Loader from "@/components/globals/Loader.vue";
import Search from "@/EntityComponents/Company/Search.vue";
import BackButton from "@/components/template/BackButton.vue";
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
			contact: {}
		}
	},
	inject: ['symfony', 'alert'],
	methods: {
		retrieve(){
			let self = this;
			let url = this.symfony.api.contacts.contact.get.replace(':id', self.id);

			self.loading = true;
			utils.ajax(url, (data) => {
				self.contact = data.entities.contact;
				if( !self.contact.data ) self.contact.data = {};
				if( !self.contact.data.properties ) self.contact.data.properties = [];
				self.loading = false;
			})
		},
		save() {
			let self = this;
			let url = this.symfony.api.contacts.contact.save;
			let callback = {
				success(d) {
					if( d.error === false )
						self.alert('Contact Saved!');
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
			utils.ajax(url, callback.success, callback.error, { entities: { contact: this.contact } } );
		},
		addProperty(){
			this.contact.data.properties.push({ name: '', value: '' })
		},
		removeProperty(i)
		{
			this.contact.data.properties.splice(i, 1);
		},
		selectParent(company){
			this.contact.company_name = company.name;
			this.contact.company = company.id;
		}
	},
	mounted() {
		this.retrieve();
	}
}
</script>

<template>

	<Loader v-if="loading"/>

	<template v-if="!loading && contact.first_name">

		<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center">
			<BackButton />
			<h2 class="m-0 text-center">
				{{ contact.first_name }} {{ contact.last_name }}<br>
				<span class="h4" v-if="contact.company_name">Under: {{ contact.company_name }}</span>
			</h2>
			<button class="btn btn-primary p-3" @click="save" :disabled="saving"><i class="bi bi-floppy-fill"></i> Save Changes</button>
		</div>

		<br>
		<div class="row">
			<div class="col">
				<label class="form-label">First Name</label>
				<input class="form-control" type="text" v-model="contact.first_name" />
			</div>
			<div class="col">
				<label class="form-label">Last Name</label>
				<input class="form-control" type="text" v-model="contact.last_name" />
			</div>
			<div class="col">
				<label class="form-label">Email</label>
				<input class="form-control" type="email" v-model="contact.email" />
			</div>
			<div class="col">
				<label class="form-label">&nbsp;</label><br>
				<Search :onSelect="selectParent" :buttonText="'Set Company'" :buttonIcon="'bi-pencil'" />
			</div>
		</div>
		<br>

		<div v-for="(property, i) in contact.data.properties" class="d-flex gap-3 pb-3">

			<div class="col-2">
				<input v-model="property.name" class="form-control" type="text" placeholder="Property Name" />
			</div>

			<div><label class="col-form-label">:</label></div>

			<div class="col-4">
				<input v-model="property.value" class="form-control" type="text" placeholder="Property Value" />
			</div>

			<div class="col-2">
				<button class="btn btn-danger" @click="removeProperty(i)"><i class="bi bi-trash"></i></button>
			</div>

		</div>

		<button @click="addProperty" class="btn btn-primary">Add Property</button>

	</template>


</template>