<script setup>
import Search from "@/EntityComponents/Company/Search.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			loading: false,
		}
	},
	props: [],
	inject: ['website', 'symfony', 'alert'],
	computed: {
		publicUrl(){
			return `https://${this.website.handle}.promoretailer.com`;
		},
		companyLink(){
			if( !this.website.company.id ) return false;
			return this.symfony.views.companies_company.replace(':id', this.website.company.id)
		},
		saveData() {
			return {
				entities: {
					website: this.website,
				}
			}
		}
	},
	methods: {
		save()
		{
			let self = this;
			this.loading = true;

			function onSuccess( r ){
				if( r.error === false ) self.alert('Saved')
				else self.alert('Error Saving', 'danger', r.message);
				self.loading = false;
			}

			function onError( e ){
				self.alert('Error Saving', 'danger', e);
			}

			utils.ajax( this.symfony.api.websites.website.save, onSuccess, onError, this.saveData )
		},

		onCompanySelect( company )
		{
			this.website.company.id = company.id;
			this.website.company.name = company.name;
		},
	}
}
</script>
<template>

	<div class="d-flex justify-content-between align-items-center mb-2 bg-gray p-3">
		<div class="d-flex gap-3 align-items-center">
			<div>
				<button @click="$router.go(-1)" class="btn btn-secondary"><i class="bi bi-arrow-bar-left"></i></button>
			</div>
			<div class="fw-bold fs-4">
				<i class="bi bi-columns"></i> {{ website.name }}
			</div>
			<div>(<a :href="publicUrl" target="_blank"><small>{{ publicUrl }}</small></a>)</div>
		</div>
		<div>
			<div class="text-end d-flex gap-2">
				<button class="btn btn-primary" :disabled="loading" @click="save"><i class="bi bi-floppy-fill"></i> Save</button>
			</div>
		</div>
	</div>

	<div class="d-flex gap-3 align-items-start">

		<div>
			<div class="form-floating">
				<select class="form-select" id="status" v-model="website.status">
					<option value="new">New</option>
					<option value="enabled">Enabled</option>
					<option value="disabled">Disabled</option>
				</select>
				<label for="status">Status</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="client" placeholder="Quote Name" v-model="website.name">
				<label for="client">Title</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="client" placeholder="Subdomain" v-model="website.handle">
				<label for="client">Subdomain</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="client" placeholder="Google Sheet ID" v-model="website.config.google_sheet_id">
				<label for="client">Google Sheet ID</label>
			</div>
		</div>

		<div class="col-2">
			<div class="input-group">
				<div class="form-floating">
					<input type="text" class="form-control" placeholder="Vendor" v-model="website.company.name" disabled>
					<label>Company</label>
				</div>
				<Search :on-select="onCompanySelect" :button-text="''" :button-icon="'bi-pencil'" />
			</div>
			<div class="form-text" v-if="companyLink"><RouterLink :to="companyLink">View Company</RouterLink></div>
		</div>

	</div>

</template>